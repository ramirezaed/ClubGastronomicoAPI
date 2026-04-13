import { IUserQueryRepository } from "@/modules/users/domain/repositories/user/IUserqueryRepository";
import { GetUserResponseDTO } from "@/modules/users/application/dtos/user/GetUserResponseDTO";
import { IPaginationDTO, IPaginatedResponseDTO } from "@/modules/users/application/dtos/Pagination/paginationDTO";

export class GetAllUsersUseCase {
  constructor(private readonly userRepository: IUserQueryRepository) {}

  async execute(
    filter?: { is_active?: boolean },
    pagination?: IPaginationDTO,
  ): Promise<IPaginatedResponseDTO<GetUserResponseDTO>> {
    return this.userRepository.findAll(filter, pagination);
  }
}
