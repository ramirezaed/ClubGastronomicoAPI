import { topItemsReportsDTO } from "@/modules/users/application/dtos/reports/topItemsDTO";
import { CompanyNotFoundError } from "@/modules/users/domain/exceptions/Company/CompanyNotFoundError";
import { ValidationPlanReportsError } from "@/modules/users/domain/exceptions/reports/ValidationPlanReportsError";
import { ValidationReportsError } from "@/modules/users/domain/exceptions/reports/validationReportsError";
import { ICompanyQueryRepository } from "@/modules/users/domain/repositories/company/ICompanyQueryrepository";
import { IreportQueryRepository } from "@/modules/users/domain/repositories/reports/IreportsQueryRepository";

export class topItemsUseCase {
  constructor(
    private readonly ireportQueryRepository: IreportQueryRepository,
    private readonly icompanyQueryRepository: ICompanyQueryRepository,
  ) {}

  async execute(company_id: string, dateFrom?: string, dateTo?: string): Promise<topItemsReportsDTO> {
    const company = await this.icompanyQueryRepository.findById(company_id);
    if (!company || !company.is_active) {
      throw new CompanyNotFoundError();
    }
    if (company.subscription_plan.name !== "Free") {
      throw new ValidationPlanReportsError("Esta funcion no esta disponible en tu plan");
    }
    //asigna fecha del dia
    const today = new Date().toISOString().split("T")[0];

    // si no se ingresa nada, usa hoy
    const from = dateFrom ?? today;
    const to = dateTo ?? today;

    // validar formato
    if (isNaN(new Date(from).getTime()) || isNaN(new Date(to).getTime())) {
      throw new ValidationReportsError("Las fechas ingresadas no son válidas");
    }
    // date_to no puede ser mayor a hoy
    if (to > today) {
      throw new ValidationReportsError("La fecha de fin no puede ser mayor a hoy");
    }
    // date_to no puede ser menor a date_from
    if (to < from) {
      throw new ValidationReportsError("La fecha de fin no puede ser menor a la fecha de inicio");
    }
    const topItems = await this.ireportQueryRepository.getTopProducts(company_id, from, to);
    return {
      date_from: topItems.date_from,
      date_to: topItems.date_to,
      topItems: topItems.topItems,
    };
  }
}
