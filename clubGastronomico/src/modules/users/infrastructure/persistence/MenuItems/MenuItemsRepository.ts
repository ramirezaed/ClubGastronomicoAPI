import { MenuItems } from "@/modules/users/domain/entities/MenuItems";
import { IMenuRepository } from "@/modules/users/domain/repositories/MenuItems/IMenuRepository";
import { MenuItemModel } from "@/modules/users/infrastructure/persistence/MenuItems/MenuItemsModel";

export class MenuItemsRepository implements IMenuRepository {
  private toEntity(doc: any): MenuItems {
    return new MenuItems(
      doc.id.toString(),
      doc.category_id.toString(),
      doc.company_id.toString(),
      doc.branch_id?.toString() ?? null,
      doc.name,
      doc.description,
      doc.price,
      doc.preparation_time_minutes,
      doc.stock,
      doc.daily_stock,
      doc.image_url,
      doc.is_active,
      doc.deleted_at,
    );
  }

  async save(menuItems: MenuItems): Promise<MenuItems> {
    try {
      const doc = new MenuItemModel({
        category_id: menuItems.category_id,
        company_id: menuItems.company_id,
        branch_id: menuItems.branch_id,
        name: menuItems.name,
        description: menuItems.description,
        price: menuItems.price,
        preparation_time_minutes: menuItems.preparation_time_minutes,
        stock: menuItems.stock,
        daily_stock: menuItems.daily_stock,
        image: menuItems.image_url,
        is_active: menuItems.is_active,
        deleted_at: menuItems.deleted_at,
      });
      const saved = await doc.save();
      return this.toEntity(saved);
    } catch (error) {
      throw new Error("error al registar MenuItems");
    }
  }
}
