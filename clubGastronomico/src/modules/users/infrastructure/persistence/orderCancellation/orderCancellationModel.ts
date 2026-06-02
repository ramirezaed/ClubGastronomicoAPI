import { IorderCancellationDocument } from "@/modules/users/infrastructure/persistence/orderCancellation/orderCancellationDocument";
import { Schema, model } from "mongoose";

export enum Cancellation_Reason {
  LONG_WAIT_TIME = "El tiempo de espera es demasiado largo",
  WRONG_ADDRESS = "Me equivoqué en la dirección de entrega",
  MISTAKE_IN_ITEMS = "Pedí los productos equivocados",
  FORGOT_DISCOUNT = "Olvidé aplicar un cupón o descuento",
  DUPLICATED_ORDER = "Hice el pedido dos veces sin querer",
  BUDGET_EXCEEDED = "El costo final superó mi presupuesto",
  NO_LONGER_WANTED = "Ya no quiero el pedido / Cambié de opinión",
  OTHER = "Otro motivo",
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
      enum: Object.values(Cancellation_Reason),
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
