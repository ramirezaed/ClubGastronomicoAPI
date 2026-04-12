import { UserNotExistError } from "@/modules/users/domain/exceptions/user/UserNotExistsError";
import { IUserRepository } from "@/modules/users/domain/repositories/user/IUserRepository";

export class DeleteUserUseCase {
  constructor(private readonly IusurRepository: IUserRepository) {}

  async execute(id: string): Promise<void> {
    const user = await this.IusurRepository.findById(id);
    if (!user) {
      throw new UserNotExistError();
    }
    user.delete(); // elimina el usuario, o lanza error si ya esta eliminado
    await this.IusurRepository.update(user);
    return;
  }
}
