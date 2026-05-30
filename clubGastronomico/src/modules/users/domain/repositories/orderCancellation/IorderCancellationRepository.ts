import { OrderCancellation } from "@/modules/users/domain/entities/OrderCancellation";

export interface IorderCancellationRepository {
  save(orderCancellation: OrderCancellation): Promise<OrderCancellation>;
}
