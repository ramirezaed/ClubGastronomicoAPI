import { isActiveMenuResponseDTO } from "@/modules/users/application/dtos/MenuItems/isActiveMenuResponse";
import { MenuAlreadyDeactivateError } from "@/modules/users/domain/exceptions/MenuItems/MenuAlreadyDeactivateError";
import { MenuItemsNotFoundError } from "@/modules/users/domain/exceptions/MenuItems/MenuItemsNotFoundError";
import { IMenuRepository } from "@/modules/users/domain/repositories/MenuItems/IMenuRepository";

export class deactivaMenuItemsUseCase {
  constructor(private readonly imenuRepository: IMenuRepository) {}
  async execute(id: string): Promise<isActiveMenuResponseDTO> {
    const items = await this.imenuRepository.findById(id);
    if (!items) {
      throw new MenuItemsNotFoundError();
    }
    items.deactivate();
    await this.imenuRepository.update(items);
    return {
      id: items.id,
      is_active: items.is_active,
    };
  }
}
