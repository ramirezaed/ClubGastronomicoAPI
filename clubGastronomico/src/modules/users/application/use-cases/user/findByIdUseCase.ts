import { GetUserResponseDTO } from "@/modules/users/application/dtos/user/GetUserResponseDTO";
import { UserNotExistError } from "@/modules/users/domain/exceptions/user/UserNotExistsError";
import { IUserQueryRepository } from "@/modules/users/domain/repositories/user/IUserqueryRepository";

export class findByIdUseCase {
  constructor(private readonly iuserRepository: IUserQueryRepository) {}

  async execute(id: string): Promise<GetUserResponseDTO> {
    const user = await this.iuserRepository.findById(id);
    if (!user) {
      throw new UserNotExistError();
    }
    return user;
  }
}
