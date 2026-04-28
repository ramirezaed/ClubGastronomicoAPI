import { IUserQueryRepository } from "@/modules/users/domain/repositories/user/IUserqueryRepository";
import { UserNotExistError } from "@/modules/users/domain/exceptions/user/UserNotExistsError";
import { GetUserResponseDTO } from "@/modules/users/application/dtos/user/GetUserResponseDTO";

export class MeUserUseCase {
  constructor(private readonly iuserRepository: IUserQueryRepository) {}

  async execute(id: string): Promise<GetUserResponseDTO> {
    const user = await this.iuserRepository.me(id);
    if (!user) {
      throw new UserNotExistError();
    }
    return user;
  }
}
