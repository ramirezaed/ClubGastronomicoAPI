import { categoryResponseDTO } from "@/modules/users/application/dtos/category/categoryResponseDTO";
import { Category } from "@/modules/users/domain/entities/Category";
import { categoryDuplicateNameError } from "@/modules/users/domain/exceptions/category/categoryDuplicateNameError";
import { CategoryQueryRepository } from "@/modules/users/infrastructure/persistence/categoryItems/categoryQueryRepository";
import { CategoryRepository } from "@/modules/users/infrastructure/persistence/categoryItems/categoryRepository";

export class RegisterCategoryUseCase {
  constructor(
    private readonly icategoryRepository: CategoryRepository,
    private readonly icategoryQueryReository: CategoryQueryRepository,
  ) {}
  async execute(name: string): Promise<categoryResponseDTO> {
    //verifica que no exista una categoria con el mismo nombre
    const verify = await this.icategoryQueryReository.findByName(name);
    if (verify) {
      throw new categoryDuplicateNameError();
    }
    const category = Category.create(name);
    const saved = await this.icategoryRepository.save(category);
    return {
      id: saved.id,
      name: saved.name,
      is_active: saved.is_active,
    };
  }
}
