import { ActivateResponseUserDTO } from "@/modules/users/application/dtos/user/ActivateResponseUserDTO";
import { UserNotExistError } from "@/modules/users/domain/exceptions/user/UserNotExistsError";
import { IUserRepository } from "@/modules/users/domain/repositories/user/IUserRepository";

export class ActivateUserUseCase {
  constructor(private readonly iuserRepository: IUserRepository) {}
  async execute(id: string): Promise<ActivateResponseUserDTO> {
    const user = await this.iuserRepository.findById(id);
    if (!user) {
      throw new UserNotExistError();
    }
    user.activate(); //activa el usuario o lanza UserAlreadyActiveError
    await this.iuserRepository.update(user);
    return {
      //mappeo que coincide con ActivateuserResponse
      id: user.id,
      is_active: user.is_active,
    };
  }
}
