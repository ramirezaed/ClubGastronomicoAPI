import { Role } from "@/modules/users/domain/entities/Role";
import { IRoleRepository } from "@/modules/users/domain/repositories/role/IRoleRepository";
import { RoleNotExistsError } from "@/modules/users/domain/exceptions/role/RoleNotExistsError";

export class GetRoleById {
  constructor(private readonly roleRepository: IRoleRepository) {}
  async execute(id: string): Promise<Role> {
    const role = await this.roleRepository.findById(id); //busca el rol por id
    if (!role) {
      // si no existe el id, lanza el error
      throw new RoleNotExistsError(); //error personalizado
    }
    return role;
  }
}
