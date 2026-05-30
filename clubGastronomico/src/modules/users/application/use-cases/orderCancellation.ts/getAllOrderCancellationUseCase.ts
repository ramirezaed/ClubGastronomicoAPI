import { ResponseOrderCancellationDTO } from "@/modules/users/application/dtos/orderCancellation/respondeOrderCancellationDTO";
import { IPaginatedResponseDTO, IPaginationDTO } from "@/modules/users/application/dtos/Pagination/paginationDTO";
import { Cancellation_Reason } from "@/modules/users/domain/entities/OrderCancellation";
import { CompanyNotFoundError } from "@/modules/users/domain/exceptions/Company/CompanyNotFoundError";
import { ICompanyQueryRepository } from "@/modules/users/domain/repositories/company/ICompanyQueryrepository";
import { IorderCancellatioRepository } from "@/modules/users/domain/repositories/orderCancellation/IorderCancellatioQueryRepository";

export class getAllOrderCancellationUseCase {
  constructor(
    private readonly iorderCacelationQueryRepository: IorderCancellatioRepository,
    private readonly icompanyQueryRepository: ICompanyQueryRepository,
  ) {}
  async execute(
    company_id: string,
    filter?: { reason?: Cancellation_Reason; start_date?: Date; end_date?: Date },
    pagination?: IPaginationDTO,
  ): Promise<IPaginatedResponseDTO<ResponseOrderCancellationDTO>> {
    const company = await this.icompanyQueryRepository.findById(company_id);
    if (!company) {
      throw new CompanyNotFoundError();
    }
    const orders = await this.iorderCacelationQueryRepository.getAll(company_id, filter, pagination);
    return orders;
  }
}
