import { ResponseMenuDTO } from "@/modules/users/application/dtos/MenuItems/ResponseMenuDTO";
import { ResponseMenuForBotDTO } from "@/modules/users/application/dtos/MenuItems/ResponseMenuForBotDTO";
import { IPaginatedResponseDTO, IPaginationDTO } from "@/modules/users/application/dtos/Pagination/paginationDTO";

export interface IMenuQueryRepository {
  findByName(category_id: string, company_id: string, name: string): Promise<ResponseMenuDTO | null>;
  findById(id: string): Promise<ResponseMenuDTO | null>;
  getAll(
    company_id: string,
    filter?: { is_active?: boolean; name?: string },
    pagination?: IPaginationDTO,
  ): Promise<IPaginatedResponseDTO<ResponseMenuDTO>>;

  getAllForBot(company_id: string): Promise<ResponseMenuForBotDTO[]>;
}
