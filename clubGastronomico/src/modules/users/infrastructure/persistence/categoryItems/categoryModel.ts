import { Schema, model } from "mongoose";
import { IcategoryDocument } from "@/modules/users/infrastructure/persistence/categoryItems/categoryDocument";
const categorySchema = new Schema<IcategoryDocument>(
  {
    name: {
      type: String,
      required: true,
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

const CategoryModel = model<IcategoryDocument>("Category", categorySchema);
export default CategoryModel;
