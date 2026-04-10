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
    const verif = await this.IuserRepository.findById(id);
    if (!verif) {
      throw new UserNotExistError();
    }
    const verifRole = await this.IroleRepository.findById(role_id);
    if (!verifRole) {
      throw new RoleNotExistsError();
    }
    const user = await this.IuserRepository.updateRole(id, role_id);
    if (!user) {
      throw new UpdateRoleUserError();
    }
    return user;
  }
}
