import { RegisterRoleError } from "@/modules/users/domain/exceptions/role/RegisterRoleError";
import { RoleAlreadyActivateError } from "@/modules/users/domain/exceptions/role/RoleAlreadyActiveError";
import { RoleAlreadyDeactivateError } from "@/modules/users/domain/exceptions/role/RoleAlreadyDeactivateError";
import { RoleInactiveError } from "@/modules/users/domain/exceptions/role/RoleInactiveError";

export class Role {
  constructor(
    public readonly id: string,
    public name: string,
    public description: string,
    public is_active: boolean,
    public deleted_at: Date | null,
  ) {}
  static create(name: string, description: string): Role {
    if (!name || !description) {
      throw new RegisterRoleError();
    }
    return new Role("", name, description, true, null); // por defecto el rol siempre se crea con estado true
  }
  update(description: string): void {
    if (!this.is_active) {
      throw new RoleInactiveError(); // si el rol no esta activado lanza error
    }
    this.description = description ?? this.description;
  }
  activate(): void {
    if (this.is_active) {
      throw new RoleAlreadyActivateError(); //si el rol ya esta activado lanza error
    }
    this.is_active = true;
  }
  deactivate(): void {
    if (!this.is_active) {
      throw new RoleAlreadyDeactivateError(); //si el rol ya esta desactivado lanza error
    }
    this.is_active = false;
  }
}
