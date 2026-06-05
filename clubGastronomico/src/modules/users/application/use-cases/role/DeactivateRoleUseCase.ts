import { RoleResponseDto } from "@/modules/users/application/dtos/role/RoleResponseDTO";
import { RolesNotFoundError } from "@/modules/users/domain/exceptions/role/RolesNotFoundError";
import { IRoleRepository } from "@/modules/users/domain/repositories/role/IRoleRepository";

export class DeactivateRoleUserUseCase {
  constructor(private readonly roleRepository: IRoleRepository) {}
  async exectute(id: string): Promise<RoleResponseDto> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new RolesNotFoundError();
    }
    role.deactivate();
    await this.roleRepository.update(role);
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      is_active: role.is_active,
    };
  }
}
