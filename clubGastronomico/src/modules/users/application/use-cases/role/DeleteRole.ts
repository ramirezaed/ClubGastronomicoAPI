import { RolesNotFoundError } from "@/modules/users/domain/exceptions/role/RolesNotFoundError";
import { IRoleRepository } from "@/modules/users/domain/repositories/role/IRoleRepository";

export class DeleteRole {
  constructor(private readonly roleRepository: IRoleRepository) {}
  async execute(id: string): Promise<void> {
    const role = await this.roleRepository.findById(id); //verifica si existe el id
    if (!role) {
      //si no existe lanza el error
      throw new RolesNotFoundError();
    }
    await this.roleRepository.delete(id); //eliminar el rol
    return;
  }
}
