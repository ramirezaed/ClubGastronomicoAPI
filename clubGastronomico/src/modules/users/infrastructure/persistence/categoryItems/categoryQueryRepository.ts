import { categoryResponseDTO } from "@/modules/users/application/dtos/category/categoryResponseDTO";
import { IPaginationDTO, IPaginatedResponseDTO } from "@/modules/users/application/dtos/Pagination/paginationDTO";
import { IcategoryQueryRepository } from "@/modules/users/domain/repositories/Category/IcategoryQueryRepository";
import CategoryModel from "@/modules/users/infrastructure/persistence/categoryItems/categoryModel";
import { todo } from "node:test";

export class CategoryQueryRepository implements IcategoryQueryRepository {
  private toDTO(doc: any): categoryResponseDTO {
    return {
      id: doc._id.toString(),
      name: doc.name,
      is_active: doc.is_active,
    };
  }
  async findByName(name: string): Promise<categoryResponseDTO | null> {
    try {
      const doc = await CategoryModel.findOne({ name: name, deleted_at: null });
      if (!doc) return null;
      return this.toDTO(doc);
    } catch (error) {
      throw new Error("error al buscar categoria por nombre");
    }
  }
  async findById(id: string): Promise<categoryResponseDTO | null> {
    try {
      const doc = await CategoryModel.findOne({ _id: id, deleted_at: null });
      if (!doc) return null;
      return this.toDTO(doc);
    } catch (error) {
      throw new Error("error al buscar categoria por id");
    }
  }
}
