import { Schema, model, Types } from "mongoose";

const MenuItemSchema = new Schema(
  {
    category_id: {
      type: Types.ObjectId,
      ref: "Category",
      required: true,
    },
    company_id: {
      type: Types.ObjectId,
      ref: "Company",
      required: true,
    },
    branch_id: {
      type: Types.ObjectId,
      ref: "Branch",
      default: null, // null = disponible en todas las sucursales
    },
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    preparation_time_minutes: {
      type: Number,
      required: true,
      default: 15,
      min: 0,
    },
    stock: {
      type: Number,
      default: null,
      required: false,
      min: 0,
    },

    daily_stock: {
      type: Number,
      default: null,
      min: 0,
    },

    image_url: {
      type: String,
      default: null,
    },

    is_active: {
      type: Boolean,
      default: true,
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

export const MenuItemModel = model("MenuItems", MenuItemSchema);
