import { Document, Types } from "mongoose";
import { Order } from "@/modules/users/domain/entities/Order";

export interface IorderDocument extends Omit<Order, "id" | "company_id" | "branch_id">, Document {
  company_id: Types.ObjectId;
  branch_id: Types.ObjectId;
}

export interface IPopulatedOrder {
  _id: Types.ObjectId;
  items: {
    item_name: string;
    category_name: string;
    quantity: number;
    unit_price: number;
    time?: number;
  }[];
  created_at: Date;
}

export interface IorderCancellationPopulatedDocument extends Omit<IorderCancellationDocument, "order_id"> {
  order_id: IPopulatedOrder;
}
