import { IUpdateRoleDTO } from "@/modules/users/application/dtos/role/UpdateRoleDTO";
import { Role } from "@/modules/users/domain/entities/Role";
import { IRoleRepository } from "@/modules/users/domain/repositories/role/IRoleRepository";
import { RoleNotExistsError } from "@/modules/users/domain/exceptions/role/RoleNotExistsError";
import { UpdateRoleError } from "@/modules/users/domain/exceptions/role/UpdateRoleError";

export class UpdateRole {
  constructor(private readonly roleRepository: IRoleRepository) {}

  async execute(id: string, dto: IUpdateRoleDTO): Promise<Role> {
    //busca el rol por id y comprueba si existe ese rol
    const existe = await this.roleRepository.findById(id);
    if (!existe) {
      throw new UpdateRoleError();
    }

    const rolActualizado = new Role(
      existe.id,
      existe.name, // siempre el nombre que ya tiene
      dto.permissions ?? existe.permissions, // si no viene, usa el existente
      dto.description ?? existe.description, // si no viene, usa el existente
      dto.is_active ?? existe.is_active, // si no viene, usa el existente
      existe.deleted_at,
    );

    const guardar = await this.roleRepository.update(rolActualizado);
    if (!guardar) {
      throw new UpdateRoleError();
    }
    return guardar;
  }
}
