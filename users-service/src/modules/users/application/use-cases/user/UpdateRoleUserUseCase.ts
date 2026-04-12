import { RoleNotExistsError } from "@/modules/users/domain/exceptions/role/RoleNotExistsError";
import { UserNotExistError } from "@/modules/users/domain/exceptions/user/UserNotExistsError";
import { IUserRepository } from "@/modules/users/domain/repositories/user/IUserRepository";
import { IRoleRepository } from "@/modules/users/domain/repositories/role/IRoleRepository";
import { UpdateRoleUserDTO } from "@/modules/users/application/dtos/user/UpdateRoleUserResponseDTO";

export class UpdateRoleUserUseCase {
  constructor(
    private readonly IuserRepository: IUserRepository,
    private readonly IroleRepository: IRoleRepository,
  ) {}
  async execute(id: string, role_id: string): Promise<UpdateRoleUserDTO> {
    const user = await this.IuserRepository.findById(id);
    if (!user) {
      throw new UserNotExistError();
    }

    const role = await this.IroleRepository.findById(role_id);
    if (!role) {
      throw new RoleNotExistsError();
    }
    user.updateRole(role_id);
    await this.IuserRepository.update(user);
    return {
      id: user.id,
      id_role: user.role_id,
    };
  }
}
