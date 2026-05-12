import { Schema, model } from "mongoose";
import { ICompanyDocument } from "@/modules/users/infrastructure/persistence/company/IcompanyDocument";
const CompanySchema = new Schema<ICompanyDocument>(
  {
    owner_id: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    subscription_plan_id: {
      type: Schema.Types.ObjectId,
      ref: "SubscriptionPlan",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
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

const CompanyModel = model<ICompanyDocument>("Company", CompanySchema);
export default CompanyModel;
