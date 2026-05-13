import { registerPlanDTO } from "@/modules/users/application/dtos/subscription/RegisterPlanDTO";
import { subscriptionResponseDTO } from "@/modules/users/application/dtos/subscription/subscriptionResponseDTO";
import { SubscriptionPlanAlreadyExistsError } from "@/modules/users/domain/exceptions/subscription/SubscriptionPlanAlreadyExistsError";
import { SubscriptionPlanRepository } from "@/modules/users/infrastructure/persistence/subscription/subscriptionRepository";
import { SubscriptionPlan } from "@/modules/users/domain/entities/SubscriptionPlan";
export class registerPlanUseCase {
  constructor(private readonly iplanRepository: SubscriptionPlanRepository) {}
  async execute(dto: registerPlanDTO): Promise<subscriptionResponseDTO> {
    //verifica que no exista un plan con el mismo nombre
    const planName = await this.iplanRepository.findByName(dto.name);
    if (planName) {
      throw new SubscriptionPlanAlreadyExistsError();
    }
    const plan = SubscriptionPlan.create(dto.name, dto.price);
    const saved = await this.iplanRepository.save(plan);
    return {
      id: saved.id,
      name: saved.name,
      price: saved.price,
      is_active: saved.is_active,
    };
  }
}
