import { RegisterCompanyError } from "@/modules/users/domain/exceptions/Company/registerCompanyError";

export class Company {
  constructor(
    public readonly id: string,
    public owner_id: string,
    public subscription_plan_id: string,
    public name: string,
    public phone: string,
    public is_active: boolean,
    public deleted_at: Date | null,
  ) {}

  static create(owner_id: string, subscription_plan_id: string, name: string, phone: string): Company {
    if (!name || !owner_id || !subscription_plan_id || !phone) {
      throw new RegisterCompanyError();
    }
    return new Company("", owner_id, subscription_plan_id, name, phone, true, null);
  }
}
