import { CompanyNotFoundError } from "@/modules/users/domain/exceptions/Company/CompanyNotFoundError";
import { ValidationReportsError } from "@/modules/users/domain/exceptions/reports/validationReportsError";
import { ICompanyQueryRepository } from "@/modules/users/domain/repositories/company/ICompanyQueryrepository";
import { IreportQueryRepository } from "@/modules/users/domain/repositories/reports/IreportsQueryRepository";

export class dailySalesUseCase {
  constructor(
    private readonly ireportQueryReports: IreportQueryRepository,
    private readonly icompanyQueryRepository: ICompanyQueryRepository,
  ) {}
  async execute(company_id: string, date?: string) {
    const company = await this.icompanyQueryRepository.findById(company_id);
    if (!company || !company.is_active) {
      throw new CompanyNotFoundError();
    }
    // si no ingresa fecha, toma la fecha del dia actual
    if (date && isNaN(new Date(date).getTime())) {
      throw new ValidationReportsError("La fecha ingresada no es válida");
    }
    const dailysales = await this.ireportQueryReports.getDailySales(company_id, date);
    return {
      date: dailysales.date,
      total_orders: dailysales.total_orders,
      total_amount: dailysales.total_amount,
    };
  }
}
