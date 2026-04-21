import { RoleInactiveError } from "@/modules/users/domain/exceptions/role/RoleInactiveError";

export class Role {
  constructor(
    public readonly id: string,
    public name: string,
    public permissions: string[],
    public description: string,
    public is_active: boolean,
    public deleted_at: Date | null,
  ) {}

  update(description: string): void {
    if (!this.is_active) {
      throw new RoleInactiveError(); // si el rol no esta activado lanza error
    }
    this.description = description ?? this.description;
  }
}
