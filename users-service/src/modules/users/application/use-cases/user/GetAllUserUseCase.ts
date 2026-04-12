import { IUserQueryRepository } from "@/modules/users/domain/repositories/user/IUserqueryRepository";
import { GetUserResponseDTO } from "@/modules/users/application/dtos/user/GetUserResponseDTO";

export class GetAllUsersUseCase {
  constructor(private readonly userRepository: IUserQueryRepository) {}

  async execute(filter?: { is_active?: boolean }): Promise<GetUserResponseDTO[]> {
    return this.userRepository.findAll(filter);
  }
}
//caso de uso no devolver void, devolver dtos
