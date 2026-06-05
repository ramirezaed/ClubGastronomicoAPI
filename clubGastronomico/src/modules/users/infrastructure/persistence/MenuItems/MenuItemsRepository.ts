import { MenuItems } from "@/modules/users/domain/entities/MenuItems";
import { IMenuRepository } from "@/modules/users/domain/repositories/MenuItems/IMenuRepository";
import { MenuItemModel } from "@/modules/users/infrastructure/persistence/MenuItems/MenuItemsModel";
import { transcode } from "node:buffer";

export class MenuItemsRepository implements IMenuRepository {
  private toEntity(doc: any): MenuItems {
    return new MenuItems(
      doc.id.toString(),
      doc.category_id.toString(),
      doc.company_id.toString(),
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
  async findById(id: string): Promise<MenuItems | null> {
    try {
      const doc = await MenuItemModel.findOne({ _id: id, deleted_at: null }).populate("category_id", "name");
      if (!doc) return null;
      return this.toEntity(doc);
    } catch (error) {
      throw new Error("error al buscar menuItems por id");
    }
  }
  async save(menuItems: MenuItems): Promise<MenuItems> {
    try {
      const doc = new MenuItemModel({
        category_id: menuItems.category_id,
        company_id: menuItems.company_id,
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
      console.error(error);
      throw new Error("error al registar MenuItems");
    }
  }
  async update(menuItems: MenuItems): Promise<MenuItems | null> {
    try {
      const doc = await MenuItemModel.findOneAndUpdate(
        { _id: menuItems.id, deletet_at: null },
        {
          $set: {
            name: menuItems.name,
            description: menuItems.description,
            price: menuItems.price,
            preparation_time_minutes: menuItems.preparation_time_minutes,
            stock: menuItems.stock,
            daily_stock: menuItems.daily_stock,

            is_active: menuItems.is_active, //para activate deactivate
            deleted_at: menuItems.deleted_at, // para soft delete
          },
        },
      );
      if (!doc) return null;
      return this.toEntity(doc);
    } catch (error) {
      throw new Error("Error al actualizar datos del items");
    }
  }
  async increaseDecreaseStock(menuItems: MenuItems): Promise<void> {
    try {
      const doc = await MenuItemModel.findOneAndUpdate(
        { _id: menuItems.id, deleted_at: null },
        {
          $set: {
            stock: menuItems.stock,
            daily_stock: menuItems.daily_stock,
          },
        },
      );
      return;
    } catch (error) {
      console.error(error);
      throw new Error("error al descontar stock");
    }
  }
}
