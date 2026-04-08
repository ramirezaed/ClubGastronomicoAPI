import { RoleNotExistsError } from "@/modules/users/domain/exceptions/role/RoleNotExistsError";
import { IRoleRepository } from "@/modules/users/domain/repositories/role/IRoleRepository";

export class DeleteRole {
  constructor(private readonly roleRepository: IRoleRepository) {}
  async execute(id: string): Promise<void> {
    const existe = await this.roleRepository.findById(id); //verifica si existe el id
    if (!existe) {
      //si no existe lanza el error
      throw new RoleNotExistsError();
    }
    await this.roleRepository.delete(id); //eliminar el rol
    return;
  }
}
