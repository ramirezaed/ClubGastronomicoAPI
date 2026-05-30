import { OrderCancellation } from "@/modules/users/domain/entities/OrderCancellation";
import { Document, Types } from "mongoose";

export interface IorderCancellationDocument extends Omit<OrderCancellation, "id" | "order_id" | "company_id">, Document {
  order_id: Types.ObjectId;
  company_id: Types.ObjectId;
}
