import { MenuItems } from "@/modules/users/domain/entities/MenuItems";

export interface IMenuRepository {
  save(menuItems: MenuItems): Promise<MenuItems>;
}
