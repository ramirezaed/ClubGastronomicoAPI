import { ResponseMenuDTO } from "@/modules/users/application/dtos/MenuItems/ResponseMenuDTO";
import { ResponseMenuForBotDTO } from "@/modules/users/application/dtos/MenuItems/ResponseMenuForBotDTO";
import { IPaginationDTO, IPaginatedResponseDTO } from "@/modules/users/application/dtos/Pagination/paginationDTO";
import { IMenuQueryRepository } from "@/modules/users/domain/repositories/MenuItems/IMenuQueryRepository";
import { IMenuItemsDocument } from "@/modules/users/infrastructure/persistence/MenuItems/MenuDocuments";
import { MenuItemModel } from "@/modules/users/infrastructure/persistence/MenuItems/MenuItemsModel";
import { QueryFilter } from "mongoose";

export class MenuItemsQueryRepository implements IMenuQueryRepository {
  private toDTO(doc: any): ResponseMenuDTO {
    return {
      id: doc.id.toString(),
      category: {
        id: doc.category_id._id?.toString() ?? doc.category_id.toString(),
        name: doc.category_id.name, // viene de populate
      },
      // company: doc.company_id.toString(),
      // branch: doc.branch_id?.toString() ?? null,
      name: doc.name,
      description: doc.description,
      price: doc.price,
      preparation_time_minutes: doc.preparation_time_minutes,
      stock: doc.stock,
      daily_stock: doc.daily_stock,
      image_url: doc.image_url,
      is_active: doc.is_active,
    };
  }
  private toBotDTO(doc: any): ResponseMenuForBotDTO {
    return {
      category: {
        name: doc.category_id.name,
      },
      name: doc.name,
      description: doc.description,
      price: doc.price,
      image_url: doc.image_url,
    };
  }
  async findByName(category_id: string, company_id: string, name: string): Promise<ResponseMenuDTO | null> {
    try {
      const doc = await MenuItemModel.findOne({ category_id: category_id, company_id: company_id, name: name, deleted_at: null });
      if (!doc) return null;
      return this.toDTO(doc);
    } catch (error) {
      throw new Error("error al buscar menuItems por nombre");
    }
  }
  async findById(id: string): Promise<ResponseMenuDTO | null> {
    try {
      const doc = await MenuItemModel.findOne({ _id: id, deleted_at: null });
      if (!doc) return null;
      return this.toDTO(doc);
    } catch (error) {
      throw new Error("error al buscar menuItems por id");
    }
  }
  async getAll(
    company_id: string,
    filter?: { is_active?: boolean; name?: string },
    pagination?: IPaginationDTO,
  ): Promise<IPaginatedResponseDTO<ResponseMenuDTO>> {
    try {
      const query: QueryFilter<IMenuItemsDocument> = { deleted_at: null };

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
        MenuItemModel.find({ company_id, query }).skip(skip).limit(limit).lean(),
        //cuenta el total de registros que cumplen los filtros
        MenuItemModel.countDocuments(query),
      ]);

      return {
        data: docs.map(this.toDTO),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new Error("error al buscar items");
    }
  }
  async getAllForBot(company_id: string): Promise<ResponseMenuForBotDTO[]> {
    try {
      const query: QueryFilter<IMenuItemsDocument> = {
        company_id,
        deleted_at: null, //que no esten eliminados
        is_active: true, // que se encuentren activos
        $or: [{ stock: null }, { stock: { $gt: 0 } }], //que su stock sea ilimitado o mayor a 0
      };

      const docs = await MenuItemModel.find(query)
        .populate({
          path: "category_id",
          match: { is_active: true }, //que su categoria este activa
        })
        .lean();

      return docs.map((doc) => this.toBotDTO(doc));
    } catch (error) {
      throw new Error("error al buscar items para el bot");
    }
  }
}
