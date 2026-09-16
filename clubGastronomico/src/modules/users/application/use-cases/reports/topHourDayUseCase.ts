import { TopHoursReportDTO } from "@/modules/users/application/dtos/reports/topHourDTO";
import { CompanyNotFoundError } from "@/modules/users/domain/exceptions/Company/CompanyNotFoundError";
import { ValidationPlanReportsError } from "@/modules/users/domain/exceptions/reports/ValidationPlanReportsError";
import { ValidationReportsError } from "@/modules/users/domain/exceptions/reports/validationReportsError";
import { ICompanyQueryRepository } from "@/modules/users/domain/repositories/company/ICompanyQueryrepository";
import { IreportQueryRepository } from "@/modules/users/domain/repositories/reports/IreportsQueryRepository";

export class topHourDayUseCase {
  constructor(
    private readonly ireportQueryRepository: IreportQueryRepository,
    private readonly icompanyQueryRepository: ICompanyQueryRepository,
  ) {}

  async execute(company_id: string, date_from?: string, date_to?: string): Promise<TopHoursReportDTO> {
    const company = await this.icompanyQueryRepository.findById(company_id);
    if (!company || !company.is_active) throw new CompanyNotFoundError();
    const today = new Date().toISOString().split("T")[0];
    //verifica que su plan sea premium
    //cambiar a que si es free no se puede ver
    if (company.subscription_plan.name !== "Premium") {
      throw new ValidationPlanReportsError("Esta funcion no esta disponible en tu plan");
    }

    const from = date_from ?? today;
    const to = date_to ?? today;

    if (isNaN(new Date(from).getTime()) || isNaN(new Date(to).getTime())) {
      throw new ValidationReportsError("Las fechas ingresadas no son válidas");
    }
    if (to > today) throw new ValidationReportsError("la fecha fin no puede ser mayor a la fecha de hoy");
    if (to < from) throw new ValidationReportsError("la fecha fin no puede ser menor que la fecha inicio");

    const topHourDay = await this.ireportQueryRepository.getTopHours(company_id, from, to);

    return {
      top_hours: topHourDay.top_hours,
    };
  }
}
