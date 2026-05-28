import { ResponseOrderDTO } from "@/modules/users/application/dtos/order/ResponseOrderDTO";
import { IOrderQueryRepository } from "@/modules/users/domain/repositories/order/IorderQueryRepository";
import { IorderDocument } from "@/modules/users/infrastructure/persistence/order/IorderDocument";
import OrderModel from "@/modules/users/infrastructure/persistence/order/OrderModel";

export class OrderQueryRepository implements IOrderQueryRepository {
  private toDTO(doc: IorderDocument): ResponseOrderDTO {
    return {
      id: doc._id.toString(),
      status: doc.status,
      customer: {
        name: doc.customer.name,
        address: doc.customer.address,
        phone: doc.customer.phone,
        telegram_id: doc.customer.telegram_id,
        telegram_username: doc.customer.telegram_username,
      },
      items: doc.items.map((item) => ({
        items_name: item.item_name,
        category_name: item.category_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        time: item.time,
      })),
      total_amount: doc.total_amount,
      created_at: new Date(),
    };
  }

  async findById(order_id: string, company_id: string): Promise<ResponseOrderDTO | null> {
    try {
      const doc = await OrderModel.findOne({ _id: order_id, deleted_at: null, company_id: company_id });
      if (!doc) return null;
      return this.toDTO(doc);
    } catch (error) {
      console.error(error);
      throw new Error("error al buscar orden por id");
    }
  }
}
