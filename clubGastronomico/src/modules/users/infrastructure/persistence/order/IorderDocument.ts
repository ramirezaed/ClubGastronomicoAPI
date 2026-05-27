// import { Document, Types } from "mongoose";
// import { Order } from "@/modules/users/domain/entities/Order";

// export interface IorderDocument
//   extends Omit<Order, "id" | "company_id" | "branch_id" | "category_id" | "menuItems_id">, Document {
//   company_id: Types.ObjectId;
//   category_id: Types.ObjectId;
//   branch_id: Types.ObjectId;
//   menuItems_id: Types.ObjectId;
// }

import { Document, Types } from "mongoose";
import { Order } from "@/modules/users/domain/entities/Order";

export interface IorderDocument extends Omit<Order, "id" | "company_id" | "branch_id">, Document {
  company_id: Types.ObjectId;
  branch_id: Types.ObjectId;
}
