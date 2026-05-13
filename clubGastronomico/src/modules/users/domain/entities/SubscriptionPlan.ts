import { SubscriptionPlanNotFoundError } from "@/modules/users/domain/exceptions/subscription/SubscriptionPlanNotFoundError";
import { SubscriptionPlanRegisterError } from "@/modules/users/domain/exceptions/subscription/SubscriptionPlanRegisterError";

export class SubscriptionPlan {
  constructor(
    public readonly id: string,
    public name: string,
    public price: string,
    public is_active: boolean,
    public deleted_at: Date | null,
  ) {}
  static create(name: string, price: string): SubscriptionPlan {
    if (!name || !price) {
      throw new SubscriptionPlanRegisterError();
    }
    return new SubscriptionPlan("", name, price, true, null);
  }
  update(newPrice: string): void {
    if (this.deleted_at) {
      throw new SubscriptionPlanNotFoundError();
    }
    this.price = newPrice ?? this.price;
  }
}
