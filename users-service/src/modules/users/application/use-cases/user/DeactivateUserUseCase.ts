import { IUserRepository } from "@/modules/users/domain/repositories/user/IUserRepository";

import { ResponseUserDTO } from "@/modules/users/application/dtos/user/ResponseUserDTO";
import { UserNotExistError } from "@/modules/users/domain/exceptions/user/UserNotExistsError";
import { UserAlreadyDeactiveError } from "@/modules/users/domain/exceptions/user/UserAlreadyDeactiveError";
export class DeactivateUserUseCase {
  constructor(private readonly iuserREpository: IUserRepository) {}

  async execute(id: string): Promise<ResponseUserDTO | null> {
    const user = await this.iuserREpository.findById(id);
    if (!user) {
      throw new UserNotExistError();
    }
    //si no es true
    if (!user.is_active) {
      throw new UserAlreadyDeactiveError();
    }
    return await this.iuserREpository.deactivate(id);
  }
}
