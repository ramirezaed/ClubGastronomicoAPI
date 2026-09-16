import { RoleInUseError } from "@/modules/users/domain/exceptions/role/RoleInUseError";
import { RolesNotFoundError } from "@/modules/users/domain/exceptions/role/RolesNotFoundError";
import { IRoleRepository } from "@/modules/users/domain/repositories/role/IRoleRepository";
import { IUserRepository } from "@/modules/users/domain/repositories/user/IUserRepository";

export class DeleteRole {
  constructor(
    private readonly roleRepository: IRoleRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const role = await this.roleRepository.findById(id);

    if (!role) {
      throw new RolesNotFoundError();
    }
    const roleInUse = await this.userRepository.existsByRoleId(id);
    if (roleInUse) {
      throw new RoleInUseError("Existen usuarios con este rol");
    }

    await this.roleRepository.delete(id);
  }
}
