import { ResponseMenuDTO } from "@/modules/users/application/dtos/MenuItems/ResponseMenuDTO";
import { CategoryNotFound } from "@/modules/users/domain/exceptions/CategoryItems/CategoryItemsNoyFoundError";
import { MenuItemsNotFoundError } from "@/modules/users/domain/exceptions/MenuItems/MenuItemsNotFoundError";
import { MenuItemsQueryRepository } from "@/modules/users/infrastructure/persistence/MenuItems/MenuItemsQueryRepository";

export class getByIdMenuItemsUseCase {
  constructor(
    private readonly imenuQueryrepository: MenuItemsQueryRepository,
    // private readonly IcategoryRepository: CategoryItemsRepository,
  ) {}
  async execute(id: string): Promise<ResponseMenuDTO> {
    const items = await this.imenuQueryrepository.findById(id);
    if (!items) {
      throw new MenuItemsNotFoundError();
    }
    // const category = await this.IcategoryRepository.findById(id);
    // if (!category) {
    //   throw new CategoryNotFound();
    // }
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
