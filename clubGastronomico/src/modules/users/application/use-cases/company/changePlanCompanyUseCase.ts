import { changePlanResponseDTO } from "@/modules/users/application/dtos/subscription/changePlanResponseDTO";
import { CompanyNotFoundError } from "@/modules/users/domain/exceptions/Company/CompanyNotFoundError";
import { SubscriptionPlanNotFoundError } from "@/modules/users/domain/exceptions/subscription/SubscriptionPlanNotFoundError";
import { ICompanyRepository } from "@/modules/users/domain/repositories/company/ICompanyRepository";
import { ISubscriptionQueryRepository } from "@/modules/users/domain/repositories/subscription/subscriptionQueryRepository";

export class changePlanCompanyUseCase {
  constructor(
    private readonly icompanyrepository: ICompanyRepository,
    private readonly isubscriptionQueryrepository: ISubscriptionQueryRepository,
  ) {}
  async execute(company_id: string, plan_id: string): Promise<changePlanResponseDTO> {
    const company = await this.icompanyrepository.findById(company_id);
    if (!company) {
      throw new CompanyNotFoundError();
    }
    const newPlan = await this.isubscriptionQueryrepository.findById(plan_id);
    if (!newPlan) {
      throw new SubscriptionPlanNotFoundError();
    }
    company.changePlan(newPlan.id);
    await this.icompanyrepository.update(company);
    return {
      company_id: company.id,
      company_name: company.name,
      plan_name: newPlan.name,
      plan_description: newPlan.description,
    };
  }
}
