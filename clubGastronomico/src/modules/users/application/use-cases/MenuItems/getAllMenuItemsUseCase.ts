import { ResponseMenuDTO } from "@/modules/users/application/dtos/MenuItems/ResponseMenuDTO";
import { IPaginatedResponseDTO, IPaginationDTO } from "@/modules/users/application/dtos/Pagination/paginationDTO";
import { IMenuQueryRepository } from "@/modules/users/domain/repositories/MenuItems/IMenuQueryRepository";

export class getAllMenuItemsUseCase {
  constructor(private readonly imenurepository: IMenuQueryRepository) {}
  async execute(
    filter?: { is_active?: boolean; name?: string },
    pagination?: IPaginationDTO,
  ): Promise<IPaginatedResponseDTO<ResponseMenuDTO>> {
    const items = await this.imenurepository.getAll(filter, pagination);
    return items;
  }
}
