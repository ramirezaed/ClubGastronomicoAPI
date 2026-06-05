import { ResponseOrderDTO } from "@/modules/users/application/dtos/order/ResponseOrderDTO";
import { IPaginatedResponseDTO, IPaginationDTO } from "@/modules/users/application/dtos/Pagination/paginationDTO";
import { OrderStatus } from "@/modules/users/domain/entities/Order";
import { CompanyNotFoundError } from "@/modules/users/domain/exceptions/Company/CompanyNotFoundError";
import { ICompanyQueryRepository } from "@/modules/users/domain/repositories/company/ICompanyQueryrepository";
import { IOrderQueryRepository } from "@/modules/users/domain/repositories/order/IorderQueryRepository";

export class getAllOrderUsecase {
  constructor(
    private readonly iorderQueryRepository: IOrderQueryRepository,
    private readonly icompanyQueryRepository: ICompanyQueryRepository,
  ) {}
  async execute(
    company_id: string,
    filter?: { status?: OrderStatus },
    pagination?: IPaginationDTO,
  ): Promise<IPaginatedResponseDTO<ResponseOrderDTO>> {
    const company = await this.icompanyQueryRepository.findById(company_id);
    if (!company) {
      throw new CompanyNotFoundError();
    }
    const order = await this.iorderQueryRepository.getAll(company_id, filter, pagination);
    return order;
  }
}
