import { ResponseOrderDTO } from "@/modules/users/application/dtos/order/ResponseOrderDTO";

export interface IOrderQueryRepository {
  findById(order_id: string, company_id: string): Promise<ResponseOrderDTO | null>;
}
