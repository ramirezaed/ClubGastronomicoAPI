import { Document, Types } from "mongoose";
import { MenuItems } from "@/modules/users/domain/entities/MenuItems";

export interface IMenuItemsDocument extends Omit<MenuItems, "id" | "category_id" | "company_id" | "branch_id">, Document {
  category_id: Types.ObjectId;
  company_id: Types.ObjectId;
  branch_id: Types.ObjectId;
}
