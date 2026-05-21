import { Category } from "@/modules/users/domain/entities/Category";
import { IcategoryRepository } from "@/modules/users/domain/repositories/Category/IcategoryRepository";
import CategoryModel from "@/modules/users/infrastructure/persistence/categoryItems/categoryModel";

export class CategoryRepository implements IcategoryRepository {
  private toEntity(doc: any): Category {
    return new Category(doc._id.toString(), doc.name, doc.is_active, doc.deleted_at);
  }
  async save(category: Category): Promise<Category> {
    try {
      const doc = new CategoryModel({
        name: category.name,
        is_active: category.is_active,
        deleted_at: category.deleted_at,
      });
      const saved = await doc.save();
      return this.toEntity(saved);
    } catch (error) {
      throw new Error("error al crear una nueva categoria");
    }
  }
}
