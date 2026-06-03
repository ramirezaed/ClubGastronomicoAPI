import { canceledSalesDTO } from "@/modules/users/application/dtos/reports/canceledSalesReportsDTO";
import { dailySalesReportsDTO } from "@/modules/users/application/dtos/reports/dailySalesReportsDTO";
import { TopHoursReportDTO } from "@/modules/users/application/dtos/reports/topHourDTO";
import { topItemsReportsDTO } from "@/modules/users/application/dtos/reports/topItemsDTO";

export interface IreportQueryRepository {
  getDailySales(company_id: string, date: string): Promise<dailySalesReportsDTO>;
  canceledSales(company_id: string, date: string): Promise<canceledSalesDTO>;
  getTopProducts(company_id: string, dateFrom: string, dateTo: string): Promise<topItemsReportsDTO>;
  getTopHours(company_id: string, dateFrom: string, dateTo: string): Promise<TopHoursReportDTO>;
}
