import { Document } from "mongoose";
import { SubscriptionPlan } from "@/modules/users/domain/entities/SubscriptionPlan";

export interface IsubscriptionPlanDocument extends SubscriptionPlan, Document {}
