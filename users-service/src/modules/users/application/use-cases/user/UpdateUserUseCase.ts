import { User } from "@/modules/users/domain/entities/User";
import { IUpdateUserDTO } from "@/modules/users/application/dtos/user/UpdateUserDTO";
import { IUserRepository } from "@/modules/users/domain/repositories/user/IUserRepository";
import { UserNotExistError } from "@/modules/users/domain/exceptions/user/UserNotExistsError";
import { UpdateUserError } from "@/modules/users/domain/exceptions/user/UpdateUserError";

export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string, dto: IUpdateUserDTO): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotExistError();
    }
    const UserActualizado = new User(
      user.id,
      user.company_id,
      user.branch_id,
      dto.name ?? user.name,
      dto.lastname ?? user.lastname,
      user.email,
      user.password,
      user.role_id,
      user.is_active,
      user.deleted_at,
    );
    const save = await this.userRepository.update(UserActualizado);
    if (!save) {
      throw new UpdateUserError();
    }
    return save;
  }
}
