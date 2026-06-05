import { IUserRepository } from "@/modules/users/domain/repositories/user/IUserRepository";
import { UserNotExistError } from "@/modules/users/domain/exceptions/user/UserNotExistsError";
import { ActivateResponseUserDTO } from "@/modules/users/application/dtos/user/ActivateResponseUserDTO";

export class DeactivateUserUseCase {
  constructor(private readonly iuserREpository: IUserRepository) {}

  async execute(id: string): Promise<ActivateResponseUserDTO> {
    const user = await this.iuserREpository.findById(id);
    if (!user) {
      throw new UserNotExistError();
    }
    user.deactivate(); // desactiva el usuario o lanza UserAlreadyDeactiveError
    await this.iuserREpository.update(user);
    return {
      //mappeo que coincide con ActivateuserResponse
      id: user.id,
      is_active: user.is_active,
    };
  }
}
