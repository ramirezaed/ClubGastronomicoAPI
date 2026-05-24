import { isActiveMenuResponseDTO } from "@/modules/users/application/dtos/MenuItems/isActiveMenuResponse";
import { MenuItemsNotFoundError } from "@/modules/users/domain/exceptions/MenuItems/MenuItemsNotFoundError";
import { MenuItemsRepository } from "@/modules/users/infrastructure/persistence/MenuItems/MenuItemsRepository";

export class ActivateMenuItemsUseCase {
  constructor(private readonly ImenuRepository: MenuItemsRepository) {}
  async execute(id: string): Promise<isActiveMenuResponseDTO> {
    const items = await this.ImenuRepository.findById(id);
    if (!items) {
      throw new MenuItemsNotFoundError();
    }
    items.activate;
    await this.ImenuRepository.update(items);
    return {
      id: items.id,
      is_active: items.is_active,
    };
  }
}
