import { Schema, model } from "mongoose";
import { IRoleDocument } from "@infra/persistence/IRoleDocument";

const RoleSchema = new Schema<IRoleDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    permissions: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

const RoleModel = model<IRoleDocument>("Role", RoleSchema);
export default RoleModel;
