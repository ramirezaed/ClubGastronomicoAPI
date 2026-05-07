import { Company } from "@/modules/users/domain/entities/Company";
import { Document, Types } from "mongoose";

export interface ICompanyDocument extends Omit<Company, "id" | "owner_id" | "subscription_plan_id">, Document {
  owner_id: Types.ObjectId;
  subscription_plan_id: Types.ObjectId;
}
