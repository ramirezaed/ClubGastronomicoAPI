//son lo metodos en donde hay mas de una coleccion involucrada, devuelve dtos

import { IPaginationDTO, IPaginatedResponseDTO } from "@/modules/users/application/dtos/Pagination/paginationDTO";
import { GetUserResponseDTO } from "@/modules/users/application/dtos/user/GetUserResponseDTO";
export interface IUserQueryRepository {
  findById(id: string): Promise<GetUserResponseDTO | null>;
  findAll(
    filter?: { is_active?: boolean },
    pagination?: IPaginationDTO,
  ): Promise<IPaginatedResponseDTO<GetUserResponseDTO>>;
  me(id: string): Promise<GetUserResponseDTO | null>;
}
