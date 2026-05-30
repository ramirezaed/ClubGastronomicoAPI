import { IorderCancellationDocument } from "@/modules/users/infrastructure/persistence/orderCancellation/orderCancellationDocument";
import { Schema, model } from "mongoose";

export enum Cancellation_Reason {
  WRONG_ORDER = "No es lo que pedí (Plato equivocado)",
  INCOMPLETE_ORDER = "Faltan productos en el pedido",
  FOOD_COLD = "La comida llegó fría",
  BAD_QUALITY = "La comida está quemada, cruda o en mal estado",
  SPILL_OR_DAMAGED = "El pedido llegó volcado o roto",
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
