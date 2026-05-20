import { CompanyAlreadyDeactivateError } from "@/modules/users/domain/exceptions/Company/CompanyAlreadyDeactivateError";
import { CompanyAlreadyHasThisPlanError } from "@/modules/users/domain/exceptions/Company/CompanyAlreadyHasThisPlanError";
import { CompanyInactiveError } from "@/modules/users/domain/exceptions/Company/CompanyInactiveError";
import { CompanyNotFoundError } from "@/modules/users/domain/exceptions/Company/CompanyNotFoundError";
import { CompanyAlreadyActivateError } from "@/modules/users/domain/exceptions/Company/CompayAlreadyActivateError";
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
  update(name: string, phone: string): void {
    if (!this.is_active) {
      throw new CompanyInactiveError();
    }
    this.name = name ?? this.name;
    this.phone = phone ?? this.phone;
  }
  softdelete(): void {
    if (!this.deleted_at) {
      throw new CompanyNotFoundError();
    }
    this.deleted_at = new Date();
    this.is_active = false;
  }
  activate(): void {
    if (this.is_active) {
      throw new CompanyAlreadyActivateError();
    }
    this.is_active = true;
  }
  deactivate(): void {
    if (!this.is_active) {
      throw new CompanyAlreadyDeactivateError();
    }
    this.is_active = false;
  }
  changePlan(planId: string): void {
    if (this.subscription_plan_id === planId) {
      throw new CompanyAlreadyHasThisPlanError();
    }
    this.subscription_plan_id = planId;
  }
}
