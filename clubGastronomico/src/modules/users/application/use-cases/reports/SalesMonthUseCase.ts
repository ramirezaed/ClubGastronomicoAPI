import { SalesEvolutionReportDTO } from "@/modules/users/application/dtos/reports/SalesMonthDTO";
import { CompanyNotFoundError } from "@/modules/users/domain/exceptions/Company/CompanyNotFoundError";
import { ValidationPlanReportsError } from "@/modules/users/domain/exceptions/reports/ValidationPlanReportsError";
import { ICompanyQueryRepository } from "@/modules/users/domain/repositories/company/ICompanyQueryrepository";
import { IreportQueryRepository } from "@/modules/users/domain/repositories/reports/IreportsQueryRepository";

export class salesMonthUseCase {
  constructor(
    private readonly ireportsQueryRepository: IreportQueryRepository,
    private readonly icompanyQueryRepository: ICompanyQueryRepository,
  ) {}
  async execute(company_id: string): Promise<SalesEvolutionReportDTO> {
    const company = await this.icompanyQueryRepository.findById(company_id);
    if (!company || !company.is_active) {
      throw new CompanyNotFoundError();
    }
    if (company.subscription_plan.name !== "Premium") {
      throw new ValidationPlanReportsError("Esta funcion no esta disponible en tu plan");
    }
    const salesMonth = await this.ireportsQueryRepository.getSalesEvolution(company_id);
    return {
      months: salesMonth.months,
    };
  }
}
