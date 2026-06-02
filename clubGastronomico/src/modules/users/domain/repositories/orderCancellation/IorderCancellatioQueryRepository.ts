import { ResponseOrderCancellationDTO } from "@/modules/users/application/dtos/orderCancellation/respondeOrderCancellationDTO";
import { IPaginatedResponseDTO, IPaginationDTO } from "@/modules/users/application/dtos/Pagination/paginationDTO";
import { Cancellation_Reason } from "@/modules/users/domain/entities/OrderCancellation";

export interface IorderCancellatioQueryRepository {
  getAll(
    company_id: string,
    filter?: { reason?: Cancellation_Reason; start_date?: Date; end_date?: Date },
    pagination?: IPaginationDTO,
  ): Promise<IPaginatedResponseDTO<ResponseOrderCancellationDTO>>;
  findById(id: string, company_id: string): Promise<ResponseOrderCancellationDTO | null>;
}
