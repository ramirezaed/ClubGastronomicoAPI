import { categoryResponseDTO } from "@/modules/users/application/dtos/category/categoryResponseDTO";
import { IPaginatedResponseDTO, IPaginationDTO } from "@/modules/users/application/dtos/Pagination/paginationDTO";

export interface IcategoryQueryRepository {
  findByName(name: string): Promise<categoryResponseDTO | null>;
  getAll(
    company_id: string,
    filter?: { is_active?: boolean; name: string },
    pagination?: IPaginationDTO,
  ): Promise<IPaginatedResponseDTO<categoryResponseDTO>>;
  findById(id: string): Promise<categoryResponseDTO | null>;
}
