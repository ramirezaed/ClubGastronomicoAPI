import UserModel from "../user/UserModel";
import { IUserQueryRepository } from "@/modules/users/domain/repositories/user/IUserqueryRepository";
import { GetUserResponseDTO } from "@/modules/users/application/dtos/user/GetUserResponseDTO";

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

  async findAll(filter?: { is_active?: boolean }): Promise<GetUserResponseDTO[]> {
    const query: Record<string, unknown> = { deleted_at: null };
    if (filter?.is_active !== undefined) {
      query.is_active = filter.is_active;
    }

    const docs = await UserModel.find(query)
      .populate("role_id", "name")
      // .populate("company_id", "name")   ← descomentar cuando exista el modelo
      // .populate("branch_id", "name")    ← descomentar cuando exista el modelo
      .lean();

    return docs.map(this.toDTO);
  }
  async findById(id: string): Promise<GetUserResponseDTO | null> {
    const doc = await UserModel.findOne({ _id: id, deleted_at: null })
      .populate("role_id", "name")
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
