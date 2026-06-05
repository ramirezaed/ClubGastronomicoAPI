import { isActiveMenuResponseDTO } from "@/modules/users/application/dtos/MenuItems/isActiveMenuResponse";
import { MenuItemsNotFoundError } from "@/modules/users/domain/exceptions/MenuItems/MenuItemsNotFoundError";
import { IMenuRepository } from "@/modules/users/domain/repositories/MenuItems/IMenuRepository";

export class ActivateMenuItemsUseCase {
  constructor(private readonly ImenuRepository: IMenuRepository) {}
  async execute(id: string): Promise<isActiveMenuResponseDTO> {
    const items = await this.ImenuRepository.findById(id);
    if (!items) {
      throw new MenuItemsNotFoundError();
    }
    items.activate();
    await this.ImenuRepository.update(items);
    return {
      id: items.id,
      is_active: items.is_active,
    };
  }
}
