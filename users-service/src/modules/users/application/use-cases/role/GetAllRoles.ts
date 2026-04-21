import { RolesNotFoundError } from "@/modules/users/domain/exceptions/role/RolesNotFoundError";
import { IRoleQueryRepository } from "@/modules/users/domain/repositories/role/IRoleQueryRepository";
import { RoleResponseDto } from "@/modules/users/application/dtos/role/RoleResponseDTO";

export class GetAllRoles {
  constructor(private readonly roleRepository: IRoleQueryRepository) {}

  async execute(): Promise<RoleResponseDto[]> {
    const roles = await this.roleRepository.findAll();
    if (!roles) {
      throw new RolesNotFoundError();
    }
    return roles;
  }
}
