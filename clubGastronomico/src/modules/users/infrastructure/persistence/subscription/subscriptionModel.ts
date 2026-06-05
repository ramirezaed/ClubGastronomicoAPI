import { Schema, model } from "mongoose";
import { IsubscriptionPlanDocument } from "@/modules/users/infrastructure/persistence/subscription/IsubscriptioDocument";

const SubscriptionPlanSchema = new Schema<IsubscriptionPlanDocument>(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    description: {
      type: String,
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

const SubscriptionModel = model<IsubscriptionPlanDocument>("SubscriptionPlan", SubscriptionPlanSchema);
export default SubscriptionModel;
