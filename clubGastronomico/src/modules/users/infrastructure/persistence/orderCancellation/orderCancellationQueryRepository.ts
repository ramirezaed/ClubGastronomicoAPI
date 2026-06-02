import { ResponseOrderCancellationDTO } from "@/modules/users/application/dtos/orderCancellation/respondeOrderCancellationDTO";
import { IPaginationDTO, IPaginatedResponseDTO } from "@/modules/users/application/dtos/Pagination/paginationDTO";
import { Cancellation_Reason } from "@/modules/users/domain/entities/OrderCancellation";
import { IorderCancellationDocument } from "@/modules/users/infrastructure/persistence/orderCancellation/orderCancellationDocument";
import OrderCancellationModel from "@/modules/users/infrastructure/persistence/orderCancellation/orderCancellationModel";
import { QueryFilter } from "mongoose";
import { IorderCancellatioQueryRepository } from "@/modules/users/domain/repositories/orderCancellation/IorderCancellatioQueryRepository";

export class orderCancellationQueryRepository implements IorderCancellatioQueryRepository {
  private toDTO(doc: any): ResponseOrderCancellationDTO {
    return {
      id: doc._id.toString(),
      // order_id: doc.order_id.toString(),
      order_id: doc.order_id,
      reason: doc.reason,
      custom_reason: doc.custom_reason,
      created_at: doc.created_at,
    };
  }
  async getAll(
    company_id: string,
    filter?: { reason: Cancellation_Reason; start_date?: Date; end_date?: Date },
    pagination?: IPaginationDTO,
  ): Promise<IPaginatedResponseDTO<ResponseOrderCancellationDTO>> {
    try {
      const query: QueryFilter<IorderCancellationDocument> = { company_id, deleted_at: null };

      //si no es indefinido, el filtro es reason

      if (filter?.reason) query.reason = filter.reason;
      if (filter?.start_date) query.start_date = filter.start_date;
      if (filter?.end_date) query.end_date = filter.end_date;
      //obtiene el numero de paginas enviadas, por defecto usa 1
      const page = pagination?.page ?? 1;
      // lmite de registros por pagina, por defecto son 10
      const limit = pagination?.limit ?? 10;
      //calcula los registros que debe saltar
      // ejemplo pag 1 skip 0, pag 2 skip 10, pag3 skip 20
      const skip = (page - 1) * limit;

      const [docs, total] = await Promise.all([
        //busca los registros aplicando los filtros
        OrderCancellationModel.find(query).skip(skip).limit(limit).lean(),
        //cuenta el total de registros que cumplen los filtros
        OrderCancellationModel.countDocuments(query),
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

  async findById(id: string, company_id: string): Promise<ResponseOrderCancellationDTO | null> {
    try {
      const doc = await OrderCancellationModel.findOne({ _id: id, company_id: company_id, deleted_at: null }).populate(
        "order_id",
      );
      if (!doc) return null;
      return this.toDTO(doc);
    } catch (error) {
      console.error(error);
      throw new Error("error al buscar orden cancelada");
    }
  }
}
