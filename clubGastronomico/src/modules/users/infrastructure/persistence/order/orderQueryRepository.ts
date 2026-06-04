import { ResponseOrderDTO } from "@/modules/users/application/dtos/order/ResponseOrderDTO";
import { IPaginatedResponseDTO, IPaginationDTO } from "@/modules/users/application/dtos/Pagination/paginationDTO";
import { IOrderQueryRepository } from "@/modules/users/domain/repositories/order/IorderQueryRepository";
import { IorderDocument } from "@/modules/users/infrastructure/persistence/order/IorderDocument";
import OrderModel from "@/modules/users/infrastructure/persistence/order/OrderModel";
import { QueryFilter } from "mongoose";

export class OrderQueryRepository implements IOrderQueryRepository {
  private toDTO(doc: IorderDocument): ResponseOrderDTO {
    return {
      id: doc._id.toString(),
      status: doc.status,
      customer: {
        name: doc.customer.name,
        address: doc.customer.address,
        phone: doc.customer.phone,
        telegram_id: doc.customer.telegram_id,
        telegram_username: doc.customer.telegram_username,
      },
      items: doc.items.map((item) => ({
        items_name: item.item_name,
        category_name: item.category_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        time: item.time,
      })),
      total_amount: doc.total_amount,
      created_at: doc.created_at,
    };
  }
  async findById(order_id: string, company_id: string): Promise<ResponseOrderDTO | null> {
    try {
      const doc = await OrderModel.findOne({ _id: order_id, deleted_at: null, company_id: company_id });
      if (!doc) return null;
      return this.toDTO(doc);
    } catch (error) {
      console.error(error);
      throw new Error("error al buscar orden por id");
    }
  }

  async getAll(
    company_id: string,
    filter?: { status?: string },
    pagination?: IPaginationDTO,
  ): Promise<IPaginatedResponseDTO<ResponseOrderDTO>> {
    try {
      const query: QueryFilter<IorderDocument> = { company_id, deleted_at: null };

      //si no es indefinido el filtro es status
      if (filter?.status) query.status = filter.status;
      //obtiene el numero de paginas enviadas, por defecto usa 1
      const page = pagination?.page ?? 1;
      // lmite de registros por pagina, por defecto son 10
      const limit = pagination?.limit ?? 10;
      //calcula los registros que debe saltar
      // ejemplo pag 1 skip 0, pag 2 skip 10, pag3 skip 20
      const skip = (page - 1) * limit;

      const [docs, total] = await Promise.all([
        //busca los registros aplicando los filtros
        OrderModel.find(query).skip(skip).limit(limit).lean(),
        //cuenta el total de registros que cumplen los filtros
        OrderModel.countDocuments(query),
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
}
