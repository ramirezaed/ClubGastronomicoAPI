import { MenuItems } from "@/modules/users/domain/entities/MenuItems";

export interface IMenuRepository {
  save(menuItems: MenuItems): Promise<MenuItems>;
  update(menuItems: MenuItems): Promise<MenuItems | null>;
  findById(id: string): Promise<MenuItems | null>;
  decreaseStock(menuItems: MenuItems): Promise<void>;
}
