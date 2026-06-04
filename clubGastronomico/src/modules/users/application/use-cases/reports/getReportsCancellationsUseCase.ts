import { CancellationReportDTO } from "@/modules/users/application/dtos/reports/canceledSalesReportsDTO";
import { CompanyNotFoundError } from "@/modules/users/domain/exceptions/Company/CompanyNotFoundError";
import { ValidationPlanReportsError } from "@/modules/users/domain/exceptions/reports/ValidationPlanReportsError";
import { ValidationReportsError } from "@/modules/users/domain/exceptions/reports/validationReportsError";
import { ICompanyQueryRepository } from "@/modules/users/domain/repositories/company/ICompanyQueryrepository";
import { IreportQueryRepository } from "@/modules/users/domain/repositories/reports/IreportsQueryRepository";

export class getReportsCancellationsUseCase {
  constructor(
    private readonly ireportQueryRepository: IreportQueryRepository,
    private readonly icompanyQueryRepository: ICompanyQueryRepository,
  ) {}

  async execute(company_id: string, dateFrom?: string, dateTo?: string): Promise<CancellationReportDTO> {
    const company = await this.icompanyQueryRepository.findById(company_id);
    if (!company || !company.is_active) throw new CompanyNotFoundError();
    if (company.subscription_plan.name !== "Free") {
      throw new ValidationPlanReportsError("Esta funcion no esta disponible en tu plan");
    }

    const today = new Date().toISOString().split("T")[0];
    const from = dateFrom ?? today;
    const to = dateTo ?? today;

    if (isNaN(new Date(from).getTime()) || isNaN(new Date(to).getTime())) {
      throw new ValidationReportsError("Las fechas ingresadas no son válidas");
    }
    if (to > today) {
      throw new ValidationReportsError("La fecha de fin no puede ser mayor a hoy");
    }
    if (to < from) {
      throw new ValidationReportsError("La fecha de fin no puede ser menor a la fecha de inicio");
    }

    const canceledSales = await this.ireportQueryRepository.getCancellations(company_id, from, to);
    return {
      date_from: canceledSales.date_from,
      date_to: canceledSales.date_to,
      total_orders: canceledSales.total_orders,
      total_cancellations: canceledSales.total_cancellations,
      cancellation_percentage: canceledSales.cancellation_percentage,
      reasons: canceledSales.reasons,
    };
  }
}
