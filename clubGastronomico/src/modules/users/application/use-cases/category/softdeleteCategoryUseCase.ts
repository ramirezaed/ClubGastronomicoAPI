import { categoryNotFound } from "@/modules/users/domain/exceptions/category/categoryNotFound";
import { IcategoryRepository } from "@/modules/users/domain/repositories/Category/IcategoryRepository";

export class softdeleteCategoryUseCase {
  constructor(private readonly categoryRepository: IcategoryRepository) {}

  async execute(id: string): Promise<void> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new categoryNotFound();
    }
    category.softdelete();
    await this.categoryRepository.update(category);
    return;
  }
}
