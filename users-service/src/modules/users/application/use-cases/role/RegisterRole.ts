//caso de uso registrar role

import { IRegisterRoleDTO } from "@/modules/users/application/dtos/role/RegisterRoleDTO";
import { IRoleRepository } from "@/modules/users/domain/repositories/role/IRoleRepository";
import { Role } from "@/modules/users/domain/entities/Role";
import { DuplicateNameError } from "@/modules/users/domain/exceptions/role/DuplicateNameError";
import { RegisterRoleError } from "@/modules/users/domain/exceptions/role/RegisterRoleError";

export class RegisterRole {
  constructor(private readonly roleRepository: IRoleRepository) {}

  async execute(dto: IRegisterRoleDTO): Promise<Role> {
    const existe = await this.roleRepository.findByName(dto.name);
    if (existe) {
      throw new DuplicateNameError(dto.name);
    }
    //crea la entidad del dominio role
    const rol = new Role(
      "",
      dto.name,
      dto.permissions,
      dto.description,
      dto.is_active,
      null,
    );
    //se guarda el rol mediante el repositorio
    const guardar = await this.roleRepository.save(rol);
    if (!guardar) {
      throw new RegisterRoleError();
    }
    return guardar;
  }
}
