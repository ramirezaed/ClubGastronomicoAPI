import { SubscriptionPlan } from "@/modules/users/domain/entities/SubscriptionPlan";
import { ISubscriptionRepository } from "@/modules/users/domain/repositories/subscription/subscriptionRepository";
import SubscriptionModel from "@/modules/users/infrastructure/persistence/subscription/subscriptionModel";

export class SubscriptionPlanRepository implements ISubscriptionRepository {
  private toEntity(doc: any): SubscriptionPlan {
    return new SubscriptionPlan(doc._id.toString(), doc.name, doc.price, doc.description, doc.is_active, doc.deleted_at);
  }
  async findById(id: string): Promise<SubscriptionPlan | null> {
    try {
      const doc = await SubscriptionModel.findOne({ _id: id, deleted_at: null });
      if (!doc) return null;
      return this.toEntity(doc);
    } catch (error) {
      throw new Error("error al obtner plan por id");
    }
  }
  async findByName(planName: string): Promise<SubscriptionPlan | null> {
    try {
      const doc = await SubscriptionModel.findOne({ name: planName });
      if (!doc) return null;
      return this.toEntity(doc);
    } catch (error) {
      throw new Error("error al buscar plan por nombre");
    }
  }
  async save(plan: SubscriptionPlan): Promise<SubscriptionPlan> {
    try {
      const doc = new SubscriptionModel({
        name: plan.name,
        price: plan.price,
        description: plan.description,
        is_active: plan.is_active,
        deleted_at: plan.deleted_at,
      });
      const saved = await doc.save();
      return this.toEntity(saved);
    } catch (error) {
      console.error(error);
      throw new Error("error al crear un nuevo plan");
    }
  }
  async update(plan: SubscriptionPlan): Promise<SubscriptionPlan | null> {
    try {
      const doc = await SubscriptionModel.findByIdAndUpdate(
        { _id: plan.id, deleted_at: null },
        {
          $set: {
            name: plan.name,
            price: plan.price,
            description: plan.description,
            is_active: plan.is_active, // para cambiar el estado
            deleted_at: plan.deleted_at, //para softdelete
          },
        },
        { returnDocument: "after" },
      );
      if (!doc) return null;
      return this.toEntity(doc);
    } catch (error) {
      throw new Error("error al intentar actualizar el plan");
    }
  }
}
