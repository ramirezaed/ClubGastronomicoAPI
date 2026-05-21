import { Category } from "@/modules/users/domain/entities/Category";

export interface IcategoryRepository {
  save(category: Category): Promise<Category | null>;
}
