import { UpdateMenuItemsDTO } from "@/modules/users/application/dtos/MenuItems/UpdateMenuDTO";
import { UpdateResponseMenuDTO } from "@/modules/users/application/dtos/MenuItems/updateResponseMenuDTO";
import { MenuItemsNotFoundError } from "@/modules/users/domain/exceptions/MenuItems/MenuItemsNotFoundError";

import { MenuItemsRepository } from "@/modules/users/infrastructure/persistence/MenuItems/MenuItemsRepository";

export class UpdateMenuItemsUseCase {
  constructor(private readonly ImenuItemsRepository: MenuItemsRepository) {}
  async execute(id: string, dto: UpdateMenuItemsDTO): Promise<UpdateResponseMenuDTO> {
    const items = await this.ImenuItemsRepository.findById(id);
    if (!items) {
      throw new MenuItemsNotFoundError();
    }

    items.update(dto.name, dto.description, dto.price, dto.preparation_time_minutes, dto.stock, dto.daily_stock);
    await this.ImenuItemsRepository.update(items);
    return {
      id: items.id,
      name: items.name,
      description: items.description,
      price: items.price,
      preparation_time_minutes: items.preparation_time_minutes,
      stock: items.stock,
      daily_stock: items.daily_stock,
      is_active: items.is_active,
    };
  }
}
