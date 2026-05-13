import { subscriptionResponseDTO } from "@/modules/users/application/dtos/subscription/subscriptionResponseDTO";
import { updatePlanDTO } from "@/modules/users/application/dtos/subscription/updatePlanDTO";
import { updatePlanResponseDTO } from "@/modules/users/application/dtos/subscription/updatePlanResponseDTO";
import { SubscriptionPlanNotFoundError } from "@/modules/users/domain/exceptions/subscription/SubscriptionPlanNotFoundError";
import { ISubscriptionRepository } from "@/modules/users/domain/repositories/subscription/subscriptionRepository";

export class UpdatePlanUseCase {
  constructor(private readonly iplanRepository: ISubscriptionRepository) {}
  async execute(id: string, dto: updatePlanDTO): Promise<updatePlanResponseDTO> {
    const plan = await this.iplanRepository.findById(id);
    if (!plan) {
      throw new SubscriptionPlanNotFoundError();
    }
    plan.update(dto.price);
    await this.iplanRepository.update(plan);

    return {
      id: plan.id,
      name: plan.name,
      price: plan.price,
    };
  }
}
