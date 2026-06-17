import { findUserResponseDTO } from "@/modules/users/application/dtos/user/findResponseDTO";
import { IUserQueryRepository } from "@/modules/users/domain/repositories/user/IUserqueryRepository";

export class findUserUseCase {
  constructor(private readonly iuserQueryRepository: IUserQueryRepository) {}

  async execute(filter: { name?: string; email?: string }): Promise<findUserResponseDTO[]> {
    const users = await this.iuserQueryRepository.findUser(filter);
    return users;
  }
}
