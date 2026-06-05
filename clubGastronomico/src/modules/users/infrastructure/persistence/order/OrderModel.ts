import { IorderDocument } from "@/modules/users/infrastructure/persistence/order/IorderDocument";
import { Schema, model } from "mongoose";

export enum ORDER_STATUS {
  PENDING = "Pendiente",
  IN_PROGRESS = "En Progreso",
  COMPLETED = "Completo",
  CANCEL = "Cancelada",
}

const OrderSchema = new Schema<IorderDocument>(
  {
    company_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Company",
    },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
      required: true,
    },
    order_number: {
      type: Number,
      requiered: false,
    },
    customer: {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      address: {
        type: String,
        required: false,
        trim: true,
      },
      phone: {
        type: String,
        required: false,
      },

      telegram_id: {
        type: String,
        required: false,
      },

      telegram_username: {
        type: String,
        required: false,
      },
    },

    items: [
      {
        menuItems_id: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "MenuItem",
        },

        category_id: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Category",
        },

        item_name: {
          type: String,
          required: true,
        },

        category_name: {
          type: String,
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },

        unit_price: {
          type: Number,
          required: true,
          min: 0,
        },

        time: {
          type: Number,
          //   required: true,
          min: 0,
        },
      },
    ],

    total_amount: {
      type: Number,
      required: true,
      min: 0,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);
OrderSchema.index({ company_id: 1, order_number: 1 }, { unique: true, sparse: true });
//indice para mejorar el rendimiento de las consultas en los reportes
OrderSchema.index({ company_id: 1, created_at: 1, status: 1 });
const OrderModel = model("Order", OrderSchema);
export default OrderModel;
