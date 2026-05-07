export class SubscriptionPlan {
  constructor(
    public readonly id: string,
    public name: string,
    public price: string,
    public is_active: boolean,
    public deleted_at: Date,
  ) {}
}
