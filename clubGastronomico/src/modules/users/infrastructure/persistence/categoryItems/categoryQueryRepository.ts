import { categoryResponseDTO } from "@/modules/users/application/dtos/category/categoryResponseDTO";
import { IPaginationDTO, IPaginatedResponseDTO } from "@/modules/users/application/dtos/Pagination/paginationDTO";
import { IcategoryQueryRepository } from "@/modules/users/domain/repositories/Category/IcategoryQueryRepository";
import { IcategoryDocument } from "@/modules/users/infrastructure/persistence/categoryItems/categoryDocument";
import CategoryModel from "@/modules/users/infrastructure/persistence/categoryItems/categoryModel";
import { QueryFilter } from "mongoose";

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
      console.error(error);
      throw new Error("error al buscar categoria por nombre");
    }
  }
  async findById(id: string): Promise<categoryResponseDTO | null> {
    try {
      const doc = await CategoryModel.findOne({ _id: id, deleted_at: null });
      if (!doc) return null;
      return this.toDTO(doc);
    } catch (error) {
      console.error(error);
      throw new Error("error al buscar categoria por id");
    }
  }
  async getAll(
    company_id: string,
    filter?: { is_active?: boolean; name: string },
    pagination?: IPaginationDTO,
  ): Promise<IPaginatedResponseDTO<categoryResponseDTO>> {
    try {
      const query: QueryFilter<IcategoryDocument> = { deleted_at: null };
      //si no es indefinido el filtro es is_active
      if (filter?.is_active !== undefined) query.is_active = filter.is_active;
      //si no es indefinido el filtro es name
      //regex para busquedas parciales, "i" para busqueda insensitiva (mayusculas o minusculas)
      if (filter?.name) query.name = { $regex: filter.name, $options: "i" };
      //obtiene el numero de paginas enviadas, por defecto usa 1
      const page = pagination?.page ?? 1;
      // lmite de registros por pagina, por defecto son 10
      const limit = pagination?.limit ?? 10;
      //calcula los registros que debe saltar
      // ejemplo pag 1 skip 0, pag 2 skip 10, pag3 skip 20
      const skip = (page - 1) * limit;

      const [docs, total] = await Promise.all([
        //busca los registros aplicando los filtros
        CategoryModel.find(query).skip(skip).limit(limit).lean(),
        //cuenta el total de registros que cumplen los filtros
        CategoryModel.countDocuments(query),
      ]);
      return {
        data: docs.map(this.toDTO),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error(error);
      throw new Error("error al buscar categorias");
    }
  }
}
