import { IorderCancellationDocument } from "@/modules/users/infrastructure/persistence/orderCancellation/orderCancellationDocument";
import { Schema, model } from "mongoose";

export enum CANCELLATION_REASON {
  FOOD_COLD = "El pedido llego frio",
  BAD_CONDITION = "El pedido no llego en condiciones",
  WRONG_ORDER = "No es lo que esperaba",
  DELAY = "Demora en la entrega",
  OTHER = "Otro",
}

const OrderCancellationSchema = new Schema<IorderCancellationDocument>(
  {
    order_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Order",
      unique: true,
    },

    company_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Company",
    },
    reason: {
      type: String,
      enum: Object.values(CANCELLATION_REASON),
      required: true,
    },
    custom_reason: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: false,
    },
  },
);

const OrderCancellationModel = model("OrderCancellation", OrderCancellationSchema);
export default OrderCancellationModel;
