import { RolesNotFoundError } from "@/modules/users/domain/exceptions/role/RolesNotFoundError";
import { RoleResponseDto } from "@/modules/users/application/dtos/role/RoleResponseDTO";
import { IRoleQueryRepository } from "@/modules/users/domain/repositories/role/IRoleQueryRepository";

export class GetRoleById {
  constructor(private readonly roleRepository: IRoleQueryRepository) {}
  async execute(id: string): Promise<RoleResponseDto> {
    const role = await this.roleRepository.findById(id); //busca el rol por id
    if (!role) {
      // si no existe el id, lanza el error
      throw new RolesNotFoundError(); //error personalizado
    }
    return role;
  }
}
