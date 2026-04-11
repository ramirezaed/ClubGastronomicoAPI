//caso de uso registrar role

import { IRegisterRoleDTO } from "@/modules/users/application/dtos/role/RegisterRoleDTO";
import { Role } from "@/modules/users/domain/entities/Role";
import { IRoleRepository } from "@/modules/users/domain/repositories/role/IRoleRepository";
import { DuplicateNameError } from "@/modules/users/domain/exceptions/role/DuplicateNameError";
import { RegisterRoleError } from "@/modules/users/domain/exceptions/role/RegisterRoleError";

export class RegisterRole {
  constructor(private readonly roleRepository: IRoleRepository) {}

  async execute(dto: IRegisterRoleDTO): Promise<Role> {
    const role = await this.roleRepository.findByName(dto.name);
    if (role) {
      throw new DuplicateNameError(dto.name);
    }
    //crea la entidad del dominio role
    const newRole = new Role("", dto.name, dto.permissions, dto.description, dto.is_active, null);
    //se guarda el rol mediante el repositorio
    const save = await this.roleRepository.save(newRole);
    if (!save) {
      throw new RegisterRoleError();
    }
    return save;
  }
}
