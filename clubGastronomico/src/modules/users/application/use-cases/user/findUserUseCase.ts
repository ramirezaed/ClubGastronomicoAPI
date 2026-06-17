import { GetUserResponseDTO } from "@/modules/users/application/dtos/user/GetUserResponseDTO";
import { IUserQueryRepository } from "@/modules/users/domain/repositories/user/IUserqueryRepository";

export class findUserUseCase {
  constructor(private readonly iuserQueryRepository: IUserQueryRepository) {}

  async execute(filter: { name?: string; email?: string }): Promise<GetUserResponseDTO[]> {
    const users = await this.iuserQueryRepository.findUser(filter);
    return users;
  }
}
