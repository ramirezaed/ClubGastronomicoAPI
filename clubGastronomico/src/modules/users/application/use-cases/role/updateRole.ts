import { IUpdateRoleDTO } from "@/modules/users/application/dtos/role/UpdateRoleDTO";
//
import { IRoleRepository } from "@/modules/users/domain/repositories/role/IRoleRepository";
import { UpdateRoleError } from "@/modules/users/domain/exceptions/role/UpdateRoleError";
import { RoleResponseDto } from "@/modules/users/application/dtos/role/RoleResponseDTO";

export class UpdateRole {
  constructor(private readonly roleRepository: IRoleRepository) {}

  async execute(id: string, dto: IUpdateRoleDTO): Promise<RoleResponseDto> {
    //busca el rol por id y comprueba si existe ese rol
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new UpdateRoleError();
    }

    role.update(dto.description);
    await this.roleRepository.update(role);
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      is_active: role.is_active,
    };
  }
}
