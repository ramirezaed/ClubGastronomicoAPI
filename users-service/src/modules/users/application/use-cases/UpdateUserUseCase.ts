import { User } from "@/modules/users/domain/entities/User";
import { IUpdateUserDTO } from "@/modules/users/application/dtos/UpdateUserDTO";
import { IUserRepository } from "@/modules/users/domain/repositories/IUserRepository";
import { UserNotExistError } from "@/modules/users/domain/exceptions/UserNotExistsError";
import { UpdateUserError } from "@/modules/users/domain/exceptions/UpdateUserError";

export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string, dto: IUpdateUserDTO): Promise<User> {
    const existe = await this.userRepository.findById(id);
    if (!existe) {
      throw new UserNotExistError();
    }
    const UserActualizado = new User(
      existe.id,
      existe.company_id,
      existe.branch_id,
      dto.name ?? existe.name,
      dto.lastname ?? existe.lastname,
      existe.email,
      existe.password,
      existe.role_id,
      existe.is_active,
      existe.deleted_at,
    );
    const guardar = await this.userRepository.update(UserActualizado);
    if (!guardar) {
      throw new UpdateUserError();
    }
    return guardar;
  }
}
