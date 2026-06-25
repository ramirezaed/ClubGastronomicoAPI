import { SubscriptionPlanInUseError } from "@/modules/users/domain/exceptions/subscription/SubscriptionPlanInUseError";
import { SubscriptionPlanNotFoundError } from "@/modules/users/domain/exceptions/subscription/SubscriptionPlanNotFoundError";
import { ICompanyRepository } from "@/modules/users/domain/repositories/company/ICompanyRepository";
import { ISubscriptionRepository } from "@/modules/users/domain/repositories/subscription/subscriptionRepository";

export class softdeletePlanUseCase {
  constructor(
    private readonly iplanRepository: ISubscriptionRepository,
    private readonly companyRepository: ICompanyRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const plan = await this.iplanRepository.findById(id);

    if (!plan) {
      throw new SubscriptionPlanNotFoundError();
    }
    const hasCompanies = await this.companyRepository.existsBySubscriptionPlanId(id);
    if (hasCompanies) {
      throw new SubscriptionPlanInUseError("El plan se encuentra en uso");
    }
    plan.softdelete();
    await this.iplanRepository.update(plan);
  }
}
