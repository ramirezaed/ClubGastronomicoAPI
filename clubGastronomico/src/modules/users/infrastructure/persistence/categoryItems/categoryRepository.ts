import { Category } from "@/modules/users/domain/entities/Category";
import { IcategoryRepository } from "@/modules/users/domain/repositories/Category/IcategoryRepository";
import CategoryModel from "@/modules/users/infrastructure/persistence/categoryItems/categoryModel";
import { deleteModel } from "mongoose";

export class CategoryRepository implements IcategoryRepository {
  private toEntity(doc: any): Category {
    return new Category(doc._id.toString(), doc.name, doc.is_active, doc.deleted_at);
  }
  async findById(id: string): Promise<Category | null> {
    try {
      const doc = await CategoryModel.findOne({ _id: id, deleted_at: null });
      if (!doc) return null;
      return this.toEntity(doc);
    } catch (error) {
      console.error(error);
      throw new Error("error al busar categoria por id");
    }
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
      console.error(error);
      throw new Error("error al crear una nueva categoria");
    }
  }
  async update(category: Category): Promise<Category> {
    try {
      const doc = await CategoryModel.findOneAndUpdate(
        { _id: category.id, deleted_at: null },
        {
          $set: {
            name: category.name,
            is_active: category.is_active,
            deleted_at: category.deleted_at,
          },
        },
        { returnDocument: "after" },
      );
      return this.toEntity(doc);
    } catch (error) {
      console.error(error);
      throw new Error("error al actualizar categoria");
    }
  }
}
