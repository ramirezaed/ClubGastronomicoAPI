import UserModel from "../user/UserModel";
import { IUserQueryRepository } from "@/modules/users/domain/repositories/user/IUserqueryRepository";
import { GetUserResponseDTO } from "@/modules/users/application/dtos/user/GetUserResponseDTO";
import { IPaginationDTO, IPaginatedResponseDTO } from "@/modules/users/application/dtos/Pagination/paginationDTO";

export class MongooseUserQueryRepository implements IUserQueryRepository {
  private toDTO(doc: any): GetUserResponseDTO {
    return {
      id: doc._id.toString(),
      name: doc.name,
      lastname: doc.lastname,
      email: doc.email,
      is_active: doc.is_active,
      role: {
        id: doc.role_id._id.toString(),
        name: doc.role_id.name,
      },
      company: doc.company_id
        ? {
            id: doc.company_id._id.toString(),
            name: doc.company_id.name,
          }
        : null,
      branch: doc.branch_id
        ? {
            id: doc.branch_id._id.toString(),
            name: doc.branch_id.name,
          }
        : null,
    };
  }

  async findAll(
    filter?: { is_active?: boolean },
    pagination?: IPaginationDTO,
  ): Promise<IPaginatedResponseDTO<GetUserResponseDTO>> {
    const query: Record<string, unknown> = { deleted_at: null };
    if (filter?.is_active !== undefined) {
      query.is_active = filter.is_active;
    }
    const page = pagination?.page ?? 1; //por defecto empieza a mostrar desde la pag 1
    const limit = pagination?.limit ?? 10; //cant de doc que se muestran por pag
    const skip = (page - 1) * limit;

    const [docs, total] = await Promise.all([
      UserModel.find(query)
        .populate("role_id", "name")
        //  .populate("company_id", "name") //  <- descomentar cuando exista el modelo
        //  .populate("branch_id", "name") //  <- descomentar cuando exista el modelo
        .skip(skip)
        .limit(limit)
        .lean(),
      UserModel.countDocuments(query),
    ]);
    return {
      data: docs.map(this.toDTO),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<GetUserResponseDTO | null> {
    const doc = await UserModel.findOne({ _id: id, deleted_at: null })
      .populate("role_id", "name")
      //habilitar cuando este el modelo de branch y company
      // .populate("company_id", "name")
      // .populate("branch_id", "name")
      .lean();

    if (!doc) return null;
    return this.toDTO(doc);
  }
  async me(id: string): Promise<GetUserResponseDTO | null> {
    //lean devuelve objetos JS simples, no documentos de mongoose, es mas rapido y liviano
    const doc = await UserModel.findOne({ _id: id, delete_at: null })
      .populate("role_id", "name")
      //habiliar los populate companu y branch id cuando esten sus modelos
      // .populate("company_id")
      // .populate("branch_id")
      .lean();
    if (!doc) return null;
    return this.toDTO(doc);
  }
}
