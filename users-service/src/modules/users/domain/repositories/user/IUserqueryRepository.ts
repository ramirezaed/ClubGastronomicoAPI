//son lo metodos en donde hay mas de una coleccion involucrada, devuelve dtos

import { GetUserResponseDTO } from "@/modules/users/application/dtos/user/GetUserResponseDTO";
export interface IUserQueryRepository {
  findById(id: string): Promise<GetUserResponseDTO | null>;
  findAll(filter?: { is_active?: boolean }): Promise<GetUserResponseDTO[]>;
  me(id: string): Promise<GetUserResponseDTO | null>;
}
