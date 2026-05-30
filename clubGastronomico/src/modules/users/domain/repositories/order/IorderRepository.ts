import { Order } from "@/modules/users/domain/entities/Order";

export interface IorderRepository {
  findById(id: string, company_id: string): Promise<Order | null>;
  save(order: Order): Promise<Order>;
  update(order: Order, company_id: string): Promise<Order | null>;
}
