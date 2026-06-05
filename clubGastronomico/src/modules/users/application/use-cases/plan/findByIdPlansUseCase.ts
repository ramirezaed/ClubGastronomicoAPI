import { subscriptionResponseDTO } from "@/modules/users/application/dtos/subscription/subscriptionResponseDTO";
import { SubscriptionPlanNotFoundError } from "@/modules/users/domain/exceptions/subscription/SubscriptionPlanNotFoundError";
import { ISubscriptionQueryRepository } from "@/modules/users/domain/repositories/subscription/subscriptionQueryRepository";

export class findByIdPlansUseCase {
  constructor(private readonly isubscriptionQueryPlan: ISubscriptionQueryRepository) {}
  async execute(id: string): Promise<subscriptionResponseDTO | null> {
    const plan = await this.isubscriptionQueryPlan.findById(id);
    if (!plan) {
      throw new SubscriptionPlanNotFoundError();
    }
    return plan;
  }
}
