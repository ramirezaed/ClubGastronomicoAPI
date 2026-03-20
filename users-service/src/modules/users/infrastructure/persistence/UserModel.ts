import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { IUserDocument } from "./IUserDocument";

const UsersSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Por favor ingrese un correo electrónico válido",
      ],
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["SuperAdmin", "owner", "employee"],
      default: "owner",
      required: true,
    },
    is_active: { type: Boolean, required: true, default: false },
    deleted_at: { type: Date, default: null },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

UsersSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  try {
    this.password = await bcrypt.hash(this.password ?? "", 10);
  } catch (error) {
    console.log("error al hashear");
  }
});

const UserModel = model<IUserDocument>("Users", UsersSchema);
export default UserModel;
