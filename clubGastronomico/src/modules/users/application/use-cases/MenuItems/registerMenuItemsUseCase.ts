import { RegisterMenuDTO } from "@/modules/users/application/dtos/MenuItems/RegisterMenuDTO";
import { ResponseMenuDTO } from "@/modules/users/application/dtos/MenuItems/ResponseMenuDTO";
import { MenuItems } from "@/modules/users/domain/entities/MenuItems";
import { CategoryNotFound } from "@/modules/users/domain/exceptions/CategoryItems/CategoryItemsNoyFoundError";
import { DuplicateNameMenuItemsError } from "@/modules/users/domain/exceptions/CategoryItems/DuplicateNameError";
import { itemValidationError } from "@/modules/users/domain/exceptions/MenuItems/itemValidationError";
import { IcategoryRepository } from "@/modules/users/domain/repositories/Category/IcategoryRepository";
import { IMenuQueryRepository } from "@/modules/users/domain/repositories/MenuItems/IMenuQueryRepository";
import { IMenuRepository } from "@/modules/users/domain/repositories/MenuItems/IMenuRepository";

export class RegisterMenuItemsUseCase {
  constructor(
    private readonly ImenuRepository: IMenuRepository,
    private readonly ImenuQuery: IMenuQueryRepository,
    private readonly IcategoryRepository: IcategoryRepository,
  ) {}
  async execute(company_id: string, dto: RegisterMenuDTO): Promise<ResponseMenuDTO> {
    //verifica que exista la categoria
    const category = await this.IcategoryRepository.findById(dto.category_id);
    if (!category) {
      throw new CategoryNotFound();
    }

    //verifica que no exista el mismo nombre en una misma categoria en una misma compañia
    const verifyMenuItems = await this.ImenuQuery.findByName(dto.category_id, company_id, dto.name);
    if (verifyMenuItems) {
      throw new DuplicateNameMenuItemsError();
    }

    const newItems = MenuItems.create(
      dto.category_id,
      company_id,
      dto.name,
      dto.description,
      dto.price,
      dto.preparation_time_minutes,
      dto.stock,
      dto.daily_stock,
      dto.image_url ?? null,
    );

    const saved = await this.ImenuRepository.save(newItems);

    return {
      id: saved.id,
      category: {
        id: saved.category_id,
        name: saved.name,
      },
      name: saved.name,
      description: saved.description,
      price: saved.price,
      preparation_time_minutes: saved.preparation_time_minutes,
      stock: saved.stock,
      daily_stock: saved.daily_stock,
      image_url: saved.image_url,
      is_active: saved.is_active,
    };
  }
}
