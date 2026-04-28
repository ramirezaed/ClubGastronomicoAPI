import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { IUserDocument } from "@/modules/users/infrastructure/persistence/user/IUserDocument";

const UsersSchema = new Schema<IUserDocument>(
  {
    company_id: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: false,
      default: null,
    },
    branch_id: {
      type: Schema.Types.ObjectId,
      ref: "Branch",
      required: false,
      default: null,
    },
    name: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Por favor ingrese un correo electrónico válido"],
    },
    password: {
      type: String,
      required: true,
    },
    role_id: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    is_active: {
      type: Boolean,
      required: true,
      default: false,
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

const UserModel = model<IUserDocument>("Users", UsersSchema);
export default UserModel;
