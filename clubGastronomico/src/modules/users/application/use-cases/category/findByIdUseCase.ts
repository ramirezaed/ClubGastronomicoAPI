import { categoryResponseDTO } from "@/modules/users/application/dtos/category/categoryResponseDTO";
import { categoryNotFound } from "@/modules/users/domain/exceptions/category/categoryNotFound";
import { CategoryQueryRepository } from "@/modules/users/infrastructure/persistence/categoryItems/categoryQueryRepository";

export class findByIdCategoryUseCase {
  constructor(private readonly categoryQueryRepository: CategoryQueryRepository) {}
  async execute(id: string): Promise<categoryResponseDTO | null> {
    const category = await this.categoryQueryRepository.findById(id);
    if (!category) {
      throw new categoryNotFound();
    }
    return {
      id: category.id,
      name: category.name,
      is_active: category.is_active,
    };
  }
}
