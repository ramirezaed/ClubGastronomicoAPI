import { categoryResponseDTO } from "@/modules/users/application/dtos/category/categoryResponseDTO";
import { IPaginatedResponseDTO, IPaginationDTO } from "@/modules/users/application/dtos/Pagination/paginationDTO";
import { IcategoryQueryRepository } from "@/modules/users/domain/repositories/Category/IcategoryQueryRepository";

export class getAllCategoryUseCase {
  constructor(private readonly icategoryrepository: IcategoryQueryRepository) {}
  async execute(
    company_id: string,
    filter?: { is_active?: boolean; name?: string },
    pagination?: IPaginationDTO,
  ): Promise<IPaginatedResponseDTO<categoryResponseDTO>> {
    const category = await this.icategoryrepository.getAll(company_id, filter, pagination);
    return category;
  }
}
