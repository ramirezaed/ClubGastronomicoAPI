import { ResponseMenuDTO } from "@/modules/users/application/dtos/MenuItems/ResponseMenuDTO";
import { IMenuQueryRepository } from "@/modules/users/domain/repositories/MenuItems/IMenuQueryRepository";
import { MenuItemModel } from "@/modules/users/infrastructure/persistence/MenuItems/MenuItemsModel";

export class MenuItemsQueryRepository implements IMenuQueryRepository {
  private toDTO(doc: any): ResponseMenuDTO {
    return {
      id: doc.id.toString(),
      category: {
        id: doc.category_id._id?.toString() ?? doc.category_id.toString(),
        name: doc.category_id.name, // viene de populate
      },
      // company: doc.company_id.toString(),
      // branch: doc.branch_id?.toString() ?? null,
      name: doc.name,
      description: doc.description,
      price: doc.price,
      preparation_time_minutes: doc.preparation_time_minutes,
      stock: doc.stock,
      daily_stock: doc.daily_stock,
      image_url: doc.image_url,
      is_active: doc.is_active,
    };
  }
  async findByName(category_id: string, company_id: string, name: string): Promise<ResponseMenuDTO | null> {
    try {
      const doc = await MenuItemModel.findOne({ category_id: category_id, company_id: company_id, name: name, deleted_at: null });
      if (!doc) return null;
      return this.toDTO(doc);
    } catch (error) {
      throw new Error("error al buscar menuItems por nombre");
    }
  }
  async findById(id: string): Promise<ResponseMenuDTO | null> {
    try {
      const doc = await MenuItemModel.findOne({ _id: id, deleted_at: null });
      if (!doc) return null;
      return this.toDTO(doc);
    } catch (error) {
      throw new Error("error al buscar menuItems por id");
    }
  }
}
