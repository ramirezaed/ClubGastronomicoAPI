import { canceledSalesDTO } from "@/modules/users/application/dtos/reports/canceledSalesReportsDTO";
import { CompanyNotFoundError } from "@/modules/users/domain/exceptions/Company/CompanyNotFoundError";
import { ValidationReportsError } from "@/modules/users/domain/exceptions/reports/validationReportsError";
import { ICompanyQueryRepository } from "@/modules/users/domain/repositories/company/ICompanyQueryrepository";
import { IreportQueryRepository } from "@/modules/users/domain/repositories/reports/IreportsQueryRepository";

export class canceledSalesUseCase {
  constructor(
    private readonly ireportsQueryRepository: IreportQueryRepository,
    private readonly icompanyQueryRepository: ICompanyQueryRepository,
  ) {}
  async execute(company_id: string, date?: string): Promise<canceledSalesDTO> {
    const company = await this.icompanyQueryRepository.findById(company_id);
    if (!company || !company.is_active) {
      throw new CompanyNotFoundError();
    }
    // si no ingresa fecha, toma la fecha del dia actual
    if (date && isNaN(new Date(date).getTime())) {
      throw new ValidationReportsError("La fecha ingresada no es válida");
    }
    const canceledSales = await this.ireportsQueryRepository.canceledSales(company_id, date);

    return {
      date: canceledSales.date,
      total_orders: canceledSales.total_orders,
    };
  }
}
