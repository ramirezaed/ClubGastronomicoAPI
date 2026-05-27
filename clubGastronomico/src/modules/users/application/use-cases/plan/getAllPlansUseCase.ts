import { subscriptionResponseDTO } from "@/modules/users/application/dtos/subscription/subscriptionResponseDTO";
import { SubscriptionPlanNotFoundError } from "@/modules/users/domain/exceptions/subscription/SubscriptionPlanNotFoundError";
import { ISubscriptionQueryRepository } from "@/modules/users/domain/repositories/subscription/subscriptionQueryRepository";

export class getAllPlansUseCase {
  constructor(private readonly iSubscriptionQueryPlan: ISubscriptionQueryRepository) {}
  async execute(): Promise<subscriptionResponseDTO[] | null> {
    const plans = await this.iSubscriptionQueryPlan.getall();
    if (!plans) {
      throw new SubscriptionPlanNotFoundError();
    }
    return plans;
  }
}
