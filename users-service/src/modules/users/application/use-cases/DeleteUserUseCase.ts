import { UserNotExistError } from "@/modules/users/domain/exceptions/UserNotExistsError";
import { IUserRepository } from "@/modules/users/domain/repositories/IUserRepository";

export class DeleteUserUseCase {
  constructor(private readonly IusurRepository: IUserRepository) {}

  async execute(id: string): Promise<void> {
    const user = await this.IusurRepository.findById(id);
    if (!user) {
      throw new UserNotExistError();
    }
    await this.IusurRepository.delete(id);
    return;
  }
}
