import { canceledSalesDTO } from "@/modules/users/application/dtos/reports/canceledSalesReportsDTO";
import { dailySalesReportsDTO } from "@/modules/users/application/dtos/reports/dailySalesReportsDTO";
import { OrderStatus } from "@/modules/users/domain/entities/Order";
import { IreportQueryRepository } from "@/modules/users/domain/repositories/reports/IreportsQueryRepository";
import OrderModel from "@/modules/users/infrastructure/persistence/order/OrderModel";
import mongoose, { now } from "mongoose";

export class reportsQueryRepository implements IreportQueryRepository {
  async getDailySales(company_id: string, date?: string): Promise<dailySalesReportsDTO> {
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
  async canceledSales(company_id: string, date?: string): Promise<canceledSalesDTO> {
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
}
