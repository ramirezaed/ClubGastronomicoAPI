import { canceledSalesDTO } from "@/modules/users/application/dtos/reports/canceledSalesReportsDTO";
import { dailySalesReportsDTO } from "@/modules/users/application/dtos/reports/dailySalesReportsDTO";
import { OrderStatus } from "@/modules/users/domain/entities/Order";

export interface IreportQueryRepository {
  getDailySales(company_id: string, date?: string): Promise<dailySalesReportsDTO>;
  canceledSales(company_id: string, date?: string): Promise<canceledSalesDTO>;
}
