import { categoryUpdateResponseDTO } from "@/modules/users/application/dtos/category/updateCategoryReponseDTO";
import { categoryNotFound } from "@/modules/users/domain/exceptions/category/categoryNotFound";
import { IcategoryRepository } from "@/modules/users/domain/repositories/Category/IcategoryRepository";

export class deactivateCategoryUseCase {
  constructor(private readonly icategoryRepository: IcategoryRepository) {}
  async execute(id: string): Promise<categoryUpdateResponseDTO> {
    const category = await this.icategoryRepository.findById(id);
    if (!category) {
      throw new categoryNotFound();
    }
    category.deactivate();
    await this.icategoryRepository.update(category);
    return {
      name: category.name,
      is_active: category.is_active,
    };
  }
}
