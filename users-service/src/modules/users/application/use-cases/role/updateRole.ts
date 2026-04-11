import { IUpdateRoleDTO } from "@/modules/users/application/dtos/role/UpdateRoleDTO";
import { Role } from "@/modules/users/domain/entities/Role";
import { IRoleRepository } from "@/modules/users/domain/repositories/role/IRoleRepository";
import { UpdateRoleError } from "@/modules/users/domain/exceptions/role/UpdateRoleError";

export class UpdateRole {
  constructor(private readonly roleRepository: IRoleRepository) {}

  async execute(id: string, dto: IUpdateRoleDTO): Promise<Role> {
    //busca el rol por id y comprueba si existe ese rol
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new UpdateRoleError();
    }

    const newRole = new Role(
      role.id,
      role.name, // siempre el nombre que ya tiene
      dto.permissions ?? role.permissions, // si no viene, usa el existente
      dto.description ?? role.description, // si no viene, usa el existente
      dto.is_active ?? role.is_active, // si no viene, usa el existente
      role.deleted_at,
    );

    const save = await this.roleRepository.update(newRole);
    if (!save) {
      throw new UpdateRoleError();
    }
    return save;
  }
}
