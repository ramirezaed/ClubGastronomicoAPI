import { canceledSalesDTO } from "@/modules/users/application/dtos/reports/canceledSalesReportsDTO";
import { dailySalesReportsDTO } from "@/modules/users/application/dtos/reports/dailySalesReportsDTO";
import { topItemsReportsDTO } from "@/modules/users/application/dtos/reports/topItemsDTO";
import { OrderStatus } from "@/modules/users/domain/entities/Order";
import { IreportQueryRepository } from "@/modules/users/domain/repositories/reports/IreportsQueryRepository";
import OrderModel from "@/modules/users/infrastructure/persistence/order/OrderModel";
import mongoose, { now } from "mongoose";

export class reportsQueryRepository implements IreportQueryRepository {
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
            total_amount: { $sum: { $multiply: ["$items.quantity", "$items.unit_price"] } },
          },
        },
        { $sort: { total_quantity: -1 } },
        { $limit: 5 },
      ]);

      return {
        date_from: dateFrom,
        date_to: dateTo,
        topItems: results.map((r) => ({
          menuItems_id: r._id.toString(),
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
}
