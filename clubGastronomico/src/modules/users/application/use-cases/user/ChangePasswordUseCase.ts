import { IUserRepository } from "@/modules/users/domain/repositories/user/IUserRepository";
import { PasswordHasher } from "@/modules/users/infrastructure/services/PasswordHash";
import { ChangePasswordDTO } from "@/modules/users/application/dtos/user/ChangePasswordDTO";
import { UserNotExistError } from "@/modules/users/domain/exceptions/user/UserNotExistsError";

export class ChangePasswordUseCase {
  constructor(
    private readonly iuserRepository: IUserRepository,
    private readonly ipasswordhash: PasswordHasher,
  ) {}
  async execute(id: string, dto: ChangePasswordDTO) {
    const user = await this.iuserRepository.findById(id);
    if (!user) {
      throw new UserNotExistError();
    }
    user.is_active; //verifica en la entidad si esta activo, sino lanza error(regla de negocio)
    const isMatch = await this.ipasswordhash.compare(dto.currentPassword, user.password);
    user.verifyPassword(isMatch); //verifica en la entidad si coincide el password, sino lanza error(regla de negocio)

    const hashedPassword = await this.ipasswordhash.hash(dto.newPassword);
    user.resetPassword(hashedPassword);

    await this.iuserRepository.update(user);
    return;
  }
}
