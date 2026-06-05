import { subscriptionResponseDTO } from "@/modules/users/application/dtos/subscription/subscriptionResponseDTO";

export interface ISubscriptionQueryRepository {
  findByName(name: string): Promise<subscriptionResponseDTO | null>;
  findById(id: string): Promise<subscriptionResponseDTO | null>;
  getall(): Promise<subscriptionResponseDTO[] | null>;
}
