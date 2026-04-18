import { Role } from "@/modules/users/domain/entities/Role";
import { IRoleRepository } from "@/modules/users/domain/repositories/role/IRoleRepository";
import { RolesNotFoundError } from "@/modules/users/domain/exceptions/role/RolesNotFoundError";

export class GetAllRoles {
  constructor(private readonly roleRepository: IRoleRepository) {}

  async execute(): Promise<Role[]> {
    const roles = await this.roleRepository.findAll();
    if (!roles) {
      throw new RolesNotFoundError();
    }
    return roles;
  }
}
