import { ActivateResponseUserDTO } from "@/modules/users/application/dtos/user/ActivateResponseUserDTO";
import { UserNotExistError } from "@/modules/users/domain/exceptions/user/UserNotExistsError";
import { UserActivateNotifier } from "@/modules/users/domain/ports/UserAcivateNotifier";
import { IUserRepository } from "@/modules/users/domain/repositories/user/IUserRepository";

export class ActivateUserUseCase {
  constructor(
    private readonly iuserRepository: IUserRepository,
    private readonly n8nActivcate: UserActivateNotifier,
  ) {}
  async execute(id: string): Promise<ActivateResponseUserDTO> {
    const user = await this.iuserRepository.findById(id);
    if (!user) {
      throw new UserNotExistError();
    }
    user.activate(); //activa el usuario o lanza UserAlreadyActiveError
    await this.iuserRepository.update(user);
    await this.n8nActivcate.notify({
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      email: user.email,
    });

    return {
      //mappeo que coincide con ActivateuserResponse
      id: user.id,
      is_active: user.is_active,
    };
  }
}
