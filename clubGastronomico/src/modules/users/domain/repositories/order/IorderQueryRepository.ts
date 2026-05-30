import { ResponseOrderDTO } from "@/modules/users/application/dtos/order/ResponseOrderDTO";
import { IPaginatedResponseDTO, IPaginationDTO } from "@/modules/users/application/dtos/Pagination/paginationDTO";
import { OrderStatus } from "@/modules/users/domain/entities/Order";

export interface IOrderQueryRepository {
  findById(order_id: string, company_id: string): Promise<ResponseOrderDTO | null>;
  getAll(
    company_id: string,
    filter?: { status?: OrderStatus },
    pagination?: IPaginationDTO,
  ): Promise<IPaginatedResponseDTO<ResponseOrderDTO>>;
}
