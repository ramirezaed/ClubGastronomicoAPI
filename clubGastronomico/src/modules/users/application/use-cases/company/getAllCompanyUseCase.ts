import { ICompanyGetResponseDTO } from "@/modules/users/application/dtos/company/IcompanyGetReponseDTO";
import { IPaginatedResponseDTO, IPaginationDTO } from "@/modules/users/application/dtos/Pagination/paginationDTO";
import { ICompanyQueryRepository } from "@/modules/users/domain/repositories/company/ICompanyQueryrepository";

export class GetAllCompanyUseCase {
  constructor(private readonly icompanyQueryRepository: ICompanyQueryRepository) {}

  async execute(pagination: IPaginationDTO): Promise<IPaginatedResponseDTO<ICompanyGetResponseDTO>> {
    return this.icompanyQueryRepository.getAll(pagination);
  }
}
