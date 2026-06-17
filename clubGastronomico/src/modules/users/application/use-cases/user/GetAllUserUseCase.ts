// import { IUserQueryRepository } from "@/modules/users/domain/repositories/user/IUserqueryRepository";
// import { GetUserResponseDTO } from "@/modules/users/application/dtos/user/GetUserResponseDTO";
// import { IPaginationDTO, IPaginatedResponseDTO } from "@/modules/users/application/dtos/Pagination/paginationDTO";
// import { CurrentUserDto } from "@/modules/users/application/dtos/user/CurrentUserDTO";
// import { IRoleRepository } from "@/modules/users/domain/repositories/role/IRoleRepository";
// import { UnauthorizedUserError } from "@/modules/users/domain/exceptions/user/UnauthorizedUserError";
// export class GetAllUsersUseCase {
//   constructor(
//     private readonly userRepository: IUserQueryRepository,
//     private readonly roleRepository: IRoleRepository,
//   ) {}

//   async execute(
//     user: CurrentUserDto,
//     filter?: { is_active?: boolean; roleName?: string },
//     pagination?: IPaginationDTO,
//   ): Promise<IPaginatedResponseDTO<GetUserResponseDTO>> {
//     const role = await this.roleRepository.findById(user.role_id);
//     if (role?.name === "SuperAdmin") {
//       return this.userRepository.findAll(filter, pagination); // puede usar todos los filtros de busqueda
//     }
//     if (role?.name === "owner") {
//       return this.userRepository.findUsersByComapny(user, filter, pagination); // muestra usuarios de la misma company o branch
//     }
//     throw new UnauthorizedUserError();
//   }
// }

import { IUserQueryRepository } from "@/modules/users/domain/repositories/user/IUserqueryRepository";
import { GetUserResponseDTO } from "@/modules/users/application/dtos/user/GetUserResponseDTO";
import { IPaginationDTO, IPaginatedResponseDTO } from "@/modules/users/application/dtos/Pagination/paginationDTO";
import { CurrentUserDto } from "@/modules/users/application/dtos/user/CurrentUserDTO";
import { IRoleRepository } from "@/modules/users/domain/repositories/role/IRoleRepository";
import { UnauthorizedUserError } from "@/modules/users/domain/exceptions/user/UnauthorizedUserError";
import { IRoleQueryRepository } from "@/modules/users/domain/repositories/role/IRoleQueryRepository";

export class GetAllUsersUseCase {
  constructor(
    private readonly userRepository: IUserQueryRepository,
    private readonly roleRepository: IRoleRepository,
    private readonly roleQueryRepository: IRoleQueryRepository,
  ) {}

  async execute(
    user: CurrentUserDto,
    filter?: { is_active?: boolean; roleName?: string },
    pagination?: IPaginationDTO,
  ): Promise<IPaginatedResponseDTO<GetUserResponseDTO>> {
    const role = await this.roleRepository.findById(user.role_id);

    // convierte roleName -> role_id antes de pasarlo al repositorio
    const resolvedFilter = await this.resolveRoleFilter(filter);

    if (role?.name === "SuperAdmin") {
      return this.userRepository.findAll(resolvedFilter, pagination);
    }
    if (role?.name === "owner") {
      return this.userRepository.findUsersByComapny(user, resolvedFilter, pagination);
    }
    throw new UnauthorizedUserError();
  }

  private async resolveRoleFilter(filter?: { is_active?: boolean; roleName?: string }) {
    if (!filter?.roleName) {
      return { is_active: filter?.is_active };
    }

    const role = await this.roleQueryRepository.findByName(filter.roleName);
    return {
      is_active: filter.is_active,
      role_id: role?.id ?? null,
    };
  }
}
