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
      id: doc._id.toString(),
      category: {
        id: doc.category_id._id?.toString() ?? doc.category_id.toString(),
        name: doc.category_id.name, // viene de populate
      },
      name: doc.name,
      description: doc.description,
      price: doc.price,
      preparation_time_minutes: doc.preparation_time_minutes,
      stock: doc.stock,
      image_url: doc.image_url,
      is_active: doc.is_active,
    };
  }
  private toBotDTO(doc: any): ResponseMenuForBotDTO {
    return {
      id: doc._id.toString(),
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
      const doc = await MenuItemModel.findOne({
        category_id,
        company_id,
        name,
        deleted_at: null,
      })
        .populate("category_id")
        .lean();
      if (!doc) return null;
      return this.toDTO(doc);
    } catch (error) {
      throw new Error("error al buscar menuItems por nombre");
    }
  }
  async findById(id: string): Promise<ResponseMenuDTO | null> {
    try {
      const doc = await MenuItemModel.findOne({
        _id: id,
        deleted_at: null,
      })
        .populate("category_id")
        .lean();
      if (!doc) return null;

      return this.toDTO(doc);
    } catch (error) {
      throw new Error("error al buscar menuItems por idbot");
    }
  }

  async getAll(
    company_id: string,
    filter?: { is_active?: boolean; name?: string },
    pagination?: IPaginationDTO,
  ): Promise<IPaginatedResponseDTO<ResponseMenuDTO>> {
    try {
      const query: QueryFilter<IMenuItemsDocument> = { company_id, deleted_at: null };

      if (filter?.is_active !== undefined) query.is_active = filter.is_active;
      if (filter?.name) query.name = { $regex: filter.name, $options: "i" };

      const page = pagination?.page ?? 1;
      const limit = pagination?.limit ?? 10;
      const skip = (page - 1) * limit;

      const [docs, total] = await Promise.all([
        MenuItemModel.find(query).populate("category_id").skip(skip).limit(limit).lean(),
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
      console.error(error);
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
