import { RoleResponseDto } from "@/modules/users/application/dtos/role/RoleResponseDTO";

export interface IRoleQueryRepository {
  findById(id: string): Promise<RoleResponseDto | null>;
  findByName(name: string): Promise<RoleResponseDto | null>;
  findAll(): Promise<RoleResponseDto[] | null>;
}
