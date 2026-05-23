import { categoryNotFound } from "@/modules/users/domain/exceptions/category/categoryNotFound";
import { CategoryRepository } from "@/modules/users/infrastructure/persistence/categoryItems/categoryRepository";

export class softdeleteCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(id: string): Promise<void> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new categoryNotFound();
    }
    category.softdelete;
    await this.categoryRepository.update(category);
    return;
  }
}
