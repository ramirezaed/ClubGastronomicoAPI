import { SubscriptionPlanNotFoundError } from "@/modules/users/domain/exceptions/subscription/SubscriptionPlanNotFoundError";
import { SubscriptionPlanRegisterError } from "@/modules/users/domain/exceptions/subscription/SubscriptionPlanRegisterError";

export class SubscriptionPlan {
  constructor(
    public readonly id: string,
    public name: string,
    public price: string,
    public description: string,
    public is_active: boolean,
    public deleted_at: Date | null,
  ) {}
  static create(name: string, price: string, description: string): SubscriptionPlan {
    if (!name || !price || !description) {
      throw new SubscriptionPlanRegisterError();
    }
    return new SubscriptionPlan("", name, price, description, true, null);
  }
  update(newPrice: string, newDescription: string): void {
    if (this.deleted_at) {
      throw new SubscriptionPlanNotFoundError();
    }
    this.price = newPrice ?? this.price;
    this.description = newDescription ?? this.description;
  }
  softdelete(): void {
    if (this.deleted_at) {
      throw new SubscriptionPlanNotFoundError();
    }
    this.is_active = false;
    this.deleted_at = new Date();
  }
}
