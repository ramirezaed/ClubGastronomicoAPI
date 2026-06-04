import { ProductRankingReportDTO } from "@/modules/users/application/dtos/reports/dailySalesReportsDTO";
import { CompanyNotFoundError } from "@/modules/users/domain/exceptions/Company/CompanyNotFoundError";
import { ValidationPlanReportsError } from "@/modules/users/domain/exceptions/reports/ValidationPlanReportsError";
import { ICompanyQueryRepository } from "@/modules/users/domain/repositories/company/ICompanyQueryrepository";
import { IreportQueryRepository } from "@/modules/users/domain/repositories/reports/IreportsQueryRepository";

export class getProductRankingUseCase {
  constructor(
    private readonly ireportQueryRepository: IreportQueryRepository,
    private readonly icompanyQueryRepository: ICompanyQueryRepository,
  ) {}

  async execute(company_id: string): Promise<ProductRankingReportDTO> {
    const company = await this.icompanyQueryRepository.findById(company_id);
    if (!company || !company.is_active) throw new CompanyNotFoundError();
    if (company.subscription_plan.name !== "Free") {
      throw new ValidationPlanReportsError("Esta funcion no esta disponible en tu plan");
    }
    return this.ireportQueryRepository.getProductRanking(company_id);
  }
}
