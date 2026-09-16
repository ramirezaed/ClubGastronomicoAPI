import { ICompanyGetResponseDTO } from "@/modules/users/application/dtos/company/IcompanyGetReponseDTO";
import { IPaginatedResponseDTO, IPaginationDTO } from "@/modules/users/application/dtos/Pagination/paginationDTO";
export interface ICompanyQueryRepository {
  getAll(pagination: IPaginationDTO): Promise<IPaginatedResponseDTO<ICompanyGetResponseDTO>>;
  findById(id: string): Promise<ICompanyGetResponseDTO | null>;
  meCompany(id: string): Promise<ICompanyGetResponseDTO | null>;
  findCompany(filter?: { name?: string }): Promise<ICompanyGetResponseDTO[]>;
}
