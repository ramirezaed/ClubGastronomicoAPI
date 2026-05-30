import { OrderCancellation } from "@/modules/users/domain/entities/OrderCancellation";
import { IorderCancellationRepository } from "@/modules/users/domain/repositories/orderCancellation/IorderCancellationRepository";
import { IorderCancellationDocument } from "@/modules/users/infrastructure/persistence/orderCancellation/orderCancellationDocument";
import OrderCancellationModel from "@/modules/users/infrastructure/persistence/orderCancellation/orderCancellationModel";

export class orderCancellationRepository implements IorderCancellationRepository {
  private toEntity(doc: IorderCancellationDocument): OrderCancellation {
    return new OrderCancellation(
      doc._id.toString(),
      doc.order_id.toString(),
      doc.company_id.toString(),
      doc.reason,
      doc.custom_reason,
    );
  }
  async save(orderCancellation: OrderCancellation): Promise<OrderCancellation> {
    try {
      const doc = new OrderCancellationModel({
        order_id: orderCancellation.order_id,
        company_id: orderCancellation.company_id,
        reason: orderCancellation.reason,
        custom_reason: orderCancellation.custom_reason,
      });
      const saved = await doc.save();
      return this.toEntity(saved);
    } catch (error) {
      console.error("error al crear registro de cancelaciones", error);
      throw new Error("error al registrar cancelacion de ordern");
    }
  }
}
