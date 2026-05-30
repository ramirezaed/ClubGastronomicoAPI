import { MenuItemsNotFoundError } from "@/modules/users/domain/exceptions/MenuItems/MenuItemsNotFoundError";
import { IMenuRepository } from "@/modules/users/domain/repositories/MenuItems/IMenuRepository";
import { MenuItemsRepository } from "@/modules/users/infrastructure/persistence/MenuItems/MenuItemsRepository";
import { privateDecrypt } from "node:crypto";

export class softDeleteMenuItemsUseCase {
  constructor(private readonly imenuRepository: IMenuRepository) {}
  async execute(id: string): Promise<void> {
    const items = await this.imenuRepository.findById(id);
    if (!items) {
      throw new MenuItemsNotFoundError();
    }
    items.softDelete();
    //llama al metodo update en el repositorio para que actualice la fecha de null a new Date
    await this.imenuRepository.update(items);
  }
}
