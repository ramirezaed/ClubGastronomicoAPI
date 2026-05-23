import { categoryResponseDTO } from "@/modules/users/application/dtos/category/categoryResponseDTO";
import { categoryNotFound } from "@/modules/users/domain/exceptions/category/categoryNotFound";
import { CategoryRepository } from "@/modules/users/infrastructure/persistence/categoryItems/categoryRepository";

export class activateCategoryUseCase {
  constructor(private readonly icategoryRepository: CategoryRepository) {}
  async execute(id: string): Promise<categoryResponseDTO> {
    const category = await this.icategoryRepository.findById(id);
    if (!category) {
      throw new categoryNotFound();
    }
    category.activate;
    await this.icategoryRepository.update(category);
    return {
      id: category.id,
      name: category.name,
      is_active: category.is_active,
    };
  }
}
