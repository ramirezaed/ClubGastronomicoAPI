import { Category } from "@/modules/users/domain/entities/Category";

export interface IcategoryRepository {
  save(category: Category): Promise<Category>;
  update(category: Category): Promise<Category>;
  findById(id: string): Promise<Category | null>;
}
