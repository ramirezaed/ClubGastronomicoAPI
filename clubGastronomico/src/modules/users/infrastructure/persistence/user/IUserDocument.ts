//es la unión entre tu entidad de negocio y Mongoose.
//con esto el schema sabe que this.password es un string y no una Date,

import { Document, Types } from "mongoose";
import { User } from "@domain/entities/User";

// export interface IUserDocument extends User, Document {}
export interface IUserDocument extends Omit<User, "id" | "role_id" | "company_id" | "branch_id">, Document {
  role_id: Types.ObjectId;
  company_id: Types.ObjectId | null;
  branch_id: Types.ObjectId | null;
}
