import { SubscriptionPlanNotFoundError } from "@/modules/users/domain/exceptions/subscription/SubscriptionPlanNotFoundError";
import { ISubscriptionRepository } from "@/modules/users/domain/repositories/subscription/subscriptionRepository";

export class softdeletePlanUseCase {
  constructor(private readonly iplanRepository: ISubscriptionRepository) {}
  async execute(id: string): Promise<void> {
    const plan = await this.iplanRepository.findById(id);
    if (!plan) {
      throw new SubscriptionPlanNotFoundError();
    }
    plan.softdelete();
    await this.iplanRepository.update(plan);
  }
}
