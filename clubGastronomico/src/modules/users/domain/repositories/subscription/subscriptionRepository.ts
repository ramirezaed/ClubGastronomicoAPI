import { SubscriptionPlan } from "@/modules/users/domain/entities/SubscriptionPlan";

export interface ISubscriptionRepository {
  findByName(name: string): Promise<SubscriptionPlan | null>;
  findById(id: string): Promise<SubscriptionPlan | null>;
  save(plan: SubscriptionPlan): Promise<SubscriptionPlan>;
  update(plan: SubscriptionPlan): Promise<SubscriptionPlan | null>;
}
