import { ResponseMenuDTO } from "@/modules/users/application/dtos/MenuItems/ResponseMenuDTO";
import { MenuItemsNotFoundError } from "@/modules/users/domain/exceptions/MenuItems/MenuItemsNotFoundError";
import { IMenuQueryRepository } from "@/modules/users/domain/repositories/MenuItems/IMenuQueryRepository";

export class getByIdMenuItemsUseCase {
  constructor(private readonly imenuQueryrepository: IMenuQueryRepository) {}
  async execute(id: string): Promise<ResponseMenuDTO> {
    const items = await this.imenuQueryrepository.findById(id);
    if (!items) {
      throw new MenuItemsNotFoundError();
    }
    return {
      id: items.id,
      category: {
        id: items.id,
        name: items.name,
      },
      name: items.name,
      description: items.description,
      price: items.price,
      preparation_time_minutes: items.preparation_time_minutes,
      stock: items.stock,
      daily_stock: items.daily_stock,
      is_active: items.is_active,
      image_url: items.image_url,
    };
  }
}
