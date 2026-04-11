import { RoleNotExistsError } from "@/modules/users/domain/exceptions/role/RoleNotExistsError";
import { UserNotExistError } from "@/modules/users/domain/exceptions/user/UserNotExistsError";
import { IUserRepository } from "@/modules/users/domain/repositories/user/IUserRepository";
import { IRoleRepository } from "@/modules/users/domain/repositories/role/IRoleRepository";
import { UpdateRoleUserError } from "@/modules/users/domain/exceptions/user/UpdateRoleUserError";
import { ResponseUserDTO } from "@/modules/users/application/dtos/user/ResponseUserDTO";

export class UpdateRoleUserUseCase {
  constructor(
    private readonly IuserRepository: IUserRepository,
    private readonly IroleRepository: IRoleRepository,
  ) {}
  async execute(id: string, role_id: string): Promise<ResponseUserDTO> {
    const user = await this.IuserRepository.findById(id);
    if (!user) {
      throw new UserNotExistError();
    }
    const role = await this.IroleRepository.findById(role_id);
    if (!role) {
      throw new RoleNotExistsError();
    }
    const newUser = await this.IuserRepository.updateRole(id, role_id);
    if (!newUser) {
      throw new UpdateRoleUserError();
    }
    return newUser;
  }
}
