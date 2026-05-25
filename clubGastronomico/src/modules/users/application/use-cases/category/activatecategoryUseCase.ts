import { categoryResponseDTO } from "@/modules/users/application/dtos/category/categoryResponseDTO";
import { categoryNotFound } from "@/modules/users/domain/exceptions/category/categoryNotFound";
import { IcategoryRepository } from "@/modules/users/domain/repositories/Category/IcategoryRepository";

export class activateCategoryUseCase {
  constructor(private readonly icategoryRepository: IcategoryRepository) {}
  async execute(id: string): Promise<categoryResponseDTO> {
    const category = await this.icategoryRepository.findById(id);
    if (!category) {
      throw new categoryNotFound();
    }
    category.activate();
    await this.icategoryRepository.update(category);
    return {
      id: category.id,
      name: category.name,
      is_active: category.is_active,
    };
  }
}
