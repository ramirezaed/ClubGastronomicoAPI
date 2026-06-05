import { Order } from "@/modules/users/domain/entities/Order";
import { IorderRepository } from "@/modules/users/domain/repositories/order/IorderRepository";
import { IorderDocument } from "@/modules/users/infrastructure/persistence/order/IorderDocument";
import OrderModel from "@/modules/users/infrastructure/persistence/order/OrderModel";
import { Types } from "mongoose";
export class OrderRepository implements IorderRepository {
  private toEntity(doc: IorderDocument): Order {
    return new Order(
      doc._id.toString(),
      doc.company_id.toString(),
      //   doc.branch_id.toString(),
      doc.status,
      doc.order_number,
      {
        name: doc.customer.name,
        address: doc.customer.address,
        phone: doc.customer.phone,
        telegram_id: doc.customer.telegram_id,
        telegram_username: doc.customer.telegram_username,
      },
      doc.items.map((item) => ({
        menuItems_id: item.menuItems_id.toString(),
        category_id: item.category_id.toString(),
        item_name: item.item_name,
        category_name: item.category_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        time: item.time,
      })),
      doc.total_amount,
      doc.deleted_at,
      doc.created_at,
      doc.updated_at,
    );
  }
  private async getNextOrderNumber(company_id: string): Promise<number> {
    const lastOrder = await OrderModel.findOne(
      { company_id: new Types.ObjectId(company_id) },
      { order_number: 1 },
      { sort: { order_number: -1 } }, // el más alto
    );

    return (lastOrder?.order_number ?? 0) + 1;
  }

  async findById(id: string, company_id: string): Promise<Order | null> {
    try {
      const doc = await OrderModel.findOne({ _id: id, deleted_at: null, company_id: company_id });
      if (!doc) return null;
      return this.toEntity(doc);
    } catch (error) {
      console.error(error);
      throw new Error("error al buscar orden por id");
    }
  }

  async save(order: Order): Promise<Order> {
    try {
      //busca el siguiente numero de la ultima orden antes de guardar
      const numberOrder = await this.getNextOrderNumber(order.company_id);
      const doc = new OrderModel({
        company_id: order.company_id,
        status: order.status,
        order_number: numberOrder,
        customer: {
          name: order.customer.name,
          address: order.customer.address,
          phone: order.customer.phone,
          telegram_id: order.customer.telegram_id,
          telegram_username: order.customer.telegram_username,
        },

        items: order.items.map((item) => ({
          menuItems_id: item.menuItems_id,
          category_id: item.category_id,
          item_name: item.item_name,
          category_name: item.category_name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          time: item.time,
        })),

        total_amount: order.total_amount,
        deleted_at: order.deleted_at,
      });
      const saved = await doc.save();
      return this.toEntity(saved);
    } catch (error) {
      console.error(error);
      throw new Error("error al registrar un nuevo pedido");
    }
  }
  async update(order: Order, company_id: string): Promise<Order | null> {
    try {
      const doc = await OrderModel.findOneAndUpdate(
        { _id: order.id, deleted_at: null, company_id: company_id },
        {
          $set: {
            status: order.status,
            deleted_at: order.deleted_at,
          },
        },
        { returnDocument: "after" },
      );
      if (!doc) return null;
      return this.toEntity(doc);
    } catch (error) {
      console.error(error);
      throw new Error("error al cambiar de estado la orden");
    }
  }
}
