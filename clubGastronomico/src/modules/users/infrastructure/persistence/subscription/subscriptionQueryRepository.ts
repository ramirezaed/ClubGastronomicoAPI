import { subscriptionResponseDTO } from "@/modules/users/application/dtos/subscription/subscriptionResponseDTO";
import { SubscriptionPlan } from "@/modules/users/domain/entities/SubscriptionPlan";
import { ISubscriptionQueryRepository } from "@/modules/users/domain/repositories/subscription/subscriptionQueryRepository";
import { IsubscriptionPlanDocument } from "@/modules/users/infrastructure/persistence/subscription/IsubscriptioDocument";
import SubscriptionModel from "@/modules/users/infrastructure/persistence/subscription/subscriptionModel";

export class subscriptionQueryRepository implements ISubscriptionQueryRepository {
  private toDTO(doc: any): subscriptionResponseDTO {
    return {
      id: doc.id.toString(),
      name: doc.name,
      price: doc.price,
      is_active: doc.is_active,
      // deleted_at: doc.deleted_at,
    };
  }
  async findByName(name: string): Promise<subscriptionResponseDTO | null> {
    try {
      const doc = await SubscriptionModel.findOne({ name: name, deleted_at: null });
      if (!doc) return null;
      return this.toDTO(doc);
    } catch (error) {
      throw new Error("error en db al buscar plan ");
    }
  }

  async findById(id: string): Promise<subscriptionResponseDTO | null> {
    try {
      const doc = await SubscriptionModel.findOne({ _id: id, deleted_at: null });
      if (!doc) return null;
      return this.toDTO(doc);
    } catch (error) {
      throw new Error(" error a buscar plan por id");
    }
  }
}
