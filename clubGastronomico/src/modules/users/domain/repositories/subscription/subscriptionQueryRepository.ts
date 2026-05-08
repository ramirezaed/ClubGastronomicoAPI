import { subscriptionResponseDTO } from "@/modules/users/application/dtos/subscription/subscriptionResponseDTO";
import { SubscriptionPlan } from "@/modules/users/domain/entities/SubscriptionPlan";

export interface ISubscriptionQueryRepository {
  findByName(name: string): Promise<subscriptionResponseDTO | null>;
  findById(id: string): Promise<subscriptionResponseDTO | null>;
}
