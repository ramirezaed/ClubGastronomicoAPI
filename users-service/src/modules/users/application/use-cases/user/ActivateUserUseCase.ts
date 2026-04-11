import { ResponseUserDTO } from "@/modules/users/application/dtos/user/ResponseUserDTO";
import { UserNotExistError } from "@/modules/users/domain/exceptions/user/UserNotExistsError";
import { IUserRepository } from "@/modules/users/domain/repositories/user/IUserRepository";
import { UserAlreadyActiveError } from "@/modules/users/domain/exceptions/user/UserAlreadyActiveError";

export class ActivateUserUseCase {
  constructor(private readonly iuserRepository: IUserRepository) {}
  async execute(id: string): Promise<ResponseUserDTO | null> {
    const user = await this.iuserRepository.findById(id);
    if (!user) {
      throw new UserNotExistError();
    }
    //si es true
    if (user.is_active) {
      throw new UserAlreadyActiveError();
    }
    return await this.iuserRepository.activate(id);
  }
}
