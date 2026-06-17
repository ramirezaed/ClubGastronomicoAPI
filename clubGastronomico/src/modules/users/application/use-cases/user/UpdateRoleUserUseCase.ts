import { UserNotExistError } from "@/modules/users/domain/exceptions/user/UserNotExistsError";
import { IUserRepository } from "@/modules/users/domain/repositories/user/IUserRepository";
import { IRoleRepository } from "@/modules/users/domain/repositories/role/IRoleRepository";
import { UpdateRoleUserDTO } from "@/modules/users/application/dtos/user/UpdateRoleUserResponseDTO";
import { RolesNotFoundError } from "@/modules/users/domain/exceptions/role/RolesNotFoundError";
import { userErrorValidation404 } from "@/modules/users/domain/exceptions/user/UserErrorValidation404";

export class UpdateRoleUserUseCase {
  constructor(
    private readonly IuserRepository: IUserRepository,
    private readonly IroleRepository: IRoleRepository,
  ) {}

  async execute(id: string, role_id: string): Promise<UpdateRoleUserDTO> {
    //busca el usuario por id
    const user = await this.IuserRepository.findById(id);
    if (!user) {
      throw new userErrorValidation404("el usuario que buscas no existe");
    }

    const role = await this.IroleRepository.findById(role_id);
    //verifica que exista el rol
    if (!role) {
      throw new RolesNotFoundError();
    }
    if (user.role_id === role.id) {
      throw new userErrorValidation404(`el usuario ya tiene asignado el rol ${role.name}`);
    }
    user.updateRole(role_id);
    await this.IuserRepository.update(user);
    return {
      id: user.id,
      id_role: user.role_id,
    };
  }
}
