import { canceledSalesDTO, CancellationReportDTO } from "@/modules/users/application/dtos/reports/canceledSalesReportsDTO";
import {
  dailySalesReportsDTO,
  ProductRankingDTO,
  ProductRankingReportDTO,
} from "@/modules/users/application/dtos/reports/dailySalesReportsDTO";
import { SalesEvolutionReportDTO } from "@/modules/users/application/dtos/reports/SalesMonthDTO";
import { TopHoursReportDTO } from "@/modules/users/application/dtos/reports/topHourDTO";
import { topItemsReportsDTO } from "@/modules/users/application/dtos/reports/topItemsDTO";
import { OrderStatus } from "@/modules/users/domain/entities/Order";
import { IreportQueryRepository } from "@/modules/users/domain/repositories/reports/IreportsQueryRepository";
import OrderModel from "@/modules/users/infrastructure/persistence/order/OrderModel";
import OrderCancellationModel from "@/modules/users/infrastructure/persistence/orderCancellation/orderCancellationModel";
import mongoose, { now } from "mongoose";

export class reportsQueryRepository implements IreportQueryRepository {
  private toProductRankingDTO(r: any): ProductRankingDTO {
    return {
      menuItems_id: r._id.toString(),
      item_name: r.item_name,
      category_name: r.category_name,
      total_quantity: r.total_quantity,
    };
  }
  async getDailySales(company_id: string, date: string): Promise<dailySalesReportsDTO> {
    try {
      // Si no ingresa fecha, usar la fecha actual
      const targetDate = date || new Date().toISOString().split("T")[0];
      //crea fecha de inicio
      const start = new Date(`${date}T00:00:00.000Z`);
      //crea fecha de fin
      const end = new Date(`${date}T23:59:59.999Z`);

      const [result] = await OrderModel.aggregate([
        {
          $match: {
            company_id: new mongoose.Types.ObjectId(company_id),
            created_at: { $gte: start, $lte: end },
            deleted_at: null,
            status: OrderStatus.COMPLETED,
          },
        },
        {
          $group: {
            _id: null,
            total_orders: { $sum: 1 },
            total_amount: { $sum: "$total_amount" },
          },
        },
      ]);
      return {
        date: targetDate,
        total_orders: result?.total_orders ?? 0,
        total_amount: result?.total_amount ?? 0,
      };
    } catch (error) {
      console.error(error);
      throw new Error("error al buscar ventas por dia");
    }
  }
  async canceledSales(company_id: string, date: string): Promise<canceledSalesDTO> {
    try {
      const targetDate = date || new Date().toISOString().split("T")[0];
      //crea fecha de inicio
      const start = new Date(`${date}T00:00:00.000Z`);
      //crea fecha de fin
      const end = new Date(`${date}T23:59:59.999Z`);

      const [result] = await OrderModel.aggregate([
        {
          $match: {
            company_id: new mongoose.Types.ObjectId(company_id),
            created_at: { $gte: start, $lte: end },
            deleted_at: null,
            status: OrderStatus.CANCEL,
          },
        },
        {
          $group: {
            _id: null,
            total_orders: { $sum: 1 },
          },
        },
      ]);
      return {
        date: targetDate,
        total_orders: result?.total_orders ?? 0,
      };
    } catch (error) {
      console.error(error);
      throw new Error("error al buscar ventas por dia");
    }
  }
  async getTopProducts(company_id: string, dateFrom: string, dateTo: string): Promise<topItemsReportsDTO> {
    try {
      const start = new Date(`${dateFrom}T00:00:00.000Z`);
      const end = new Date(`${dateTo}T23:59:59.999Z`);
      const results = await OrderModel.aggregate([
        {
          $match: {
            company_id: new mongoose.Types.ObjectId(company_id),
            created_at: { $gte: start, $lte: end },
            deleted_at: null,
            status: OrderStatus.COMPLETED,
          },
        },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.menuItems_id",
            item_name: { $first: "$items.item_name" },
            category_name: { $first: "$items.category_name" },
            total_quantity: { $sum: "$items.quantity" },
            total_amount: { $sum: { $multiply: ["$items.quantity", "$items.unit_price"] } },
          },
        },
        { $sort: { total_quantity: -1 } }, //ordena de mayor a menor
        { $limit: 5 },
      ]);

      return {
        date_from: dateFrom,
        date_to: dateTo,
        topItems: results.map((r) => ({
          // menuItems_id: r._id.toString(),
          item_name: r.item_name,
          category_name: r.category_name,
          total_quantity: r.total_quantity,
          total_amount: r.total_amount,
        })),
      };
    } catch (error) {
      console.error(error);
      throw new Error("error al buscar top productos");
    }
  }

  async getTopHours(company_id: string, dateFrom: string, dateTo: string): Promise<TopHoursReportDTO> {
    try {
      const start = new Date(`${dateFrom}T00:00:00.000Z`);
      const end = new Date(`${dateTo}T23:59:59.999Z`);
      const TIMEZONE = "America/Argentina/Buenos_Aires";

      const results = await OrderModel.aggregate([
        {
          $match: {
            company_id: new mongoose.Types.ObjectId(company_id),
            created_at: { $gte: start, $lte: end },
            deleted_at: null,
            status: OrderStatus.COMPLETED,
          },
        },
        {
          $addFields: {
            // Extraer hora y día en la zona horaria deseada
            localHour: { $hour: { date: "$created_at", timezone: TIMEZONE } },
            localDayOfWeek: { $dayOfWeek: { date: "$created_at", timezone: TIMEZONE } },
          },
        },
        {
          $group: {
            _id: {
              dayOfWeek: "$localDayOfWeek",
              hourBlock: { $floor: { $divide: ["$localHour", 2] } },
            },
            total_orders: { $sum: 1 },
          },
        },
        { $sort: { total_orders: -1 } },
        { $limit: 5 },
      ]);

      const daysMap: { [key: number]: string } = {
        1: "domingo",
        2: "lunes",
        3: "martes",
        4: "miércoles",
        5: "jueves",
        6: "viernes",
        7: "sábado",
      };

      return {
        top_hours: results.map((r) => {
          const hour_from = r._id.hourBlock * 2;
          const hour_to = hour_from + 2;
          const dayName = daysMap[r._id.dayOfWeek];
          return {
            label: `${dayName} ${String(hour_from).padStart(2, "0")}:00 - ${String(hour_to).padStart(2, "0")}:00`,
            total_orders: r.total_orders,
          };
        }),
      };
    } catch (error) {
      console.error(error);
      throw new Error("error al buscar top horas por día");
    }
  }

  async getCancellations(company_id: string, dateFrom: string, dateTo: string): Promise<CancellationReportDTO> {
    try {
      const start = new Date(`${dateFrom}T00:00:00.000Z`);
      const end = new Date(`${dateTo}T23:59:59.999Z`);

      const companyObjectId = new mongoose.Types.ObjectId(company_id);

      // total de órdenes del período (cualquier status)
      const total_orders = await OrderModel.countDocuments({
        company_id: companyObjectId,
        created_at: { $gte: start, $lte: end },
        deleted_at: null,
      });

      // cancelaciones agrupadas por motivo
      const results = await OrderCancellationModel.aggregate([
        {
          $match: {
            company_id: companyObjectId,
            created_at: { $gte: start, $lte: end },
          },
        },
        {
          $group: {
            _id: "$reason",
            total: { $sum: 1 },
          },
        },
        { $sort: { total: -1 } },
      ]);

      const total_cancellations = results.reduce((acc, r) => acc + r.total, 0);

      return {
        date_from: dateFrom,
        date_to: dateTo,
        total_orders,
        total_cancellations,
        cancellation_percentage: total_orders === 0 ? 0 : Number(((total_cancellations / total_orders) * 100).toFixed(1)),
        reasons: results.map((r) => ({
          reason: r._id,
          total: r.total,
          percentage_of_cancellations: total_cancellations === 0 ? 0 : Number(((r.total / total_cancellations) * 100).toFixed(1)),
        })),
      };
    } catch (error) {
      console.error(error);
      throw new Error("error al buscar cancelaciones");
    }
  }

  async getSalesEvolution(company_id: string): Promise<SalesEvolutionReportDTO> {
    try {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth() - 5, 1); // primer dia de hace 6 meses

      const results = await OrderModel.aggregate([
        {
          $match: {
            company_id: new mongoose.Types.ObjectId(company_id),
            created_at: { $gte: start },
            deleted_at: null,
            status: OrderStatus.COMPLETED,
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$created_at" },
              month: { $month: "$created_at" },
            },
            total_orders: { $sum: 1 },
            total_amount: { $sum: "$total_amount" },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]);

      return {
        months: results.map((r) => ({
          month: `${r._id.year}-${String(r._id.month).padStart(2, "0")}`,
          total_orders: r.total_orders,
          total_amount: r.total_amount,
        })),
      };
    } catch (error) {
      console.error(error);
      throw new Error("error al buscar evolución de ventas");
    }
  }
  async getProductRanking(company_id: string): Promise<ProductRankingReportDTO> {
    try {
      const results = await OrderModel.aggregate([
        {
          $match: {
            company_id: new mongoose.Types.ObjectId(company_id),
            deleted_at: null,
            status: OrderStatus.PENDING,
          },
        },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.menuItems_id",
            item_name: { $first: "$items.item_name" },
            category_name: { $first: "$items.category_name" },
            total_quantity: { $sum: "$items.quantity" },
          },
        },
        { $sort: { total_quantity: -1 } },
      ]);

      if (!results.length) return { top_sellers: [], least_sellers: [] };

      const splitIndex = Math.ceil(results.length / 2);
      const topPool = results.slice(0, splitIndex);
      const bottomPool = results.slice(splitIndex);

      const topThreshold = topPool[Math.min(4, topPool.length - 1)].total_quantity;
      const bottomThreshold = bottomPool.length
        ? bottomPool[Math.max(bottomPool.length - 5, 0)].total_quantity
        : topPool[topPool.length - 1].total_quantity;

      const top_sellers = topPool.filter((r) => r.total_quantity >= topThreshold).map(this.toProductRankingDTO);

      const least_sellers = bottomPool.filter((r) => r.total_quantity <= bottomThreshold).map(this.toProductRankingDTO);

      return { top_sellers, least_sellers };
    } catch (error) {
      console.error(error);
      throw new Error("error al buscar ranking de productos");
    }
  }
}
