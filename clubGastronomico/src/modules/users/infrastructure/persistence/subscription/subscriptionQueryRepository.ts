import { subscriptionResponseDTO } from "@/modules/users/application/dtos/subscription/subscriptionResponseDTO";
import SubscriptionModel from "@/modules/users/infrastructure/persistence/subscription/subscriptionModel";

export class subscriptionQueryRepository {
  private toDTO(doc: any): subscriptionResponseDTO {
    return {
      id: doc.id.toString(),
      name: doc.name,
      price: doc.price,
      is_active: doc.is_active,
    };
  }
  async findByName(name: string): Promise<subscriptionResponseDTO | null> {
    const doc = await SubscriptionModel.findOne({ name: name, deleted_at: null });
    if (!doc) return null;
    return this.toDTO(doc);
  }
}
