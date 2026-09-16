import UserModel from "../user/UserModel";
import { IUserQueryRepository } from "@/modules/users/domain/repositories/user/IUserqueryRepository";
import { GetUserResponseDTO } from "@/modules/users/application/dtos/user/GetUserResponseDTO";
import { IPaginationDTO, IPaginatedResponseDTO } from "@/modules/users/application/dtos/Pagination/paginationDTO";
import { CurrentUserDto } from "@/modules/users/application/dtos/user/CurrentUserDTO";
import { findUserResponseDTO } from "@/modules/users/application/dtos/user/findResponseDTO";

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
    filter?: { is_active?: boolean; role_id?: string | null },
    pagination?: IPaginationDTO,
  ): Promise<IPaginatedResponseDTO<GetUserResponseDTO>> {
    try {
      const query: Record<string, unknown> = { deleted_at: null };

      if (filter?.is_active !== undefined) {
        query.is_active = filter.is_active;
      }
      if (filter?.role_id !== undefined) {
        query.role_id = filter.role_id;
      }

      const page = pagination?.page ?? 1;
      const limit = pagination?.limit ?? 10;
      const skip = (page - 1) * limit;

      const [docs, total] = await Promise.all([
        UserModel.find(query).populate("role_id", "name").populate("company_id", "name").skip(skip).limit(limit).lean(),
        UserModel.countDocuments(query),
      ]);

      return {
        data: docs.map(this.toDTO),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error("error al mostrar lista de usuarios", error);
      throw new Error("error en find all");
    }
  }

  async findUsersByComapny(
    user: CurrentUserDto,
    filter?: { is_active?: boolean; roleName?: string },
    pagination?: IPaginationDTO,
  ): Promise<IPaginatedResponseDTO<GetUserResponseDTO>> {
    try {
      const query: Record<string, unknown> = { deleted_at: null };

      if (filter?.is_active !== undefined) {
        query.is_active = filter.is_active;
      }

      const companyFilter = [
        user.company_id && { company_id: user.company_id },
        user.branch_id && { branch_id: user.branch_id },
      ].filter(Boolean);

      if (!companyFilter.length) {
        return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
      }

      query.$or = companyFilter;

      const page = pagination?.page ?? 1;
      const limit = pagination?.limit ?? 10;
      const skip = (page - 1) * limit;

      const docs = await UserModel.find(query)
        .populate({
          path: "role_id",
          select: "name",
          match: filter?.roleName ? { name: filter.roleName } : {},
        })
        .populate("company_id", "name")
        .skip(skip)
        .limit(limit)
        .lean();
      //elimina los que no matcheron en el populate, si no hay match populate devuelve rol null
      const filteredDocs = filter?.roleName ? docs.filter((doc: any) => doc.role_id !== null) : docs;

      const total = filteredDocs.length;

      return {
        data: filteredDocs.map(this.toDTO),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error("error en findUsersByComapny", error);
      throw new Error("error en findbyCOmpany");
    }
  }
  async findById(id: string): Promise<GetUserResponseDTO | null> {
    const doc = await UserModel.findOne({ _id: id, deleted_at: null })
      .populate("role_id", "name")
      //habilitar cuando este el modelo de branch y company
      .populate("company_id", "name")
      // .populate("branch_id", "name")
      .lean();

    if (!doc) return null;
    return this.toDTO(doc);
  }
  async findByName(name: string): Promise<GetUserResponseDTO | null> {
    const doc = await UserModel.findOne({ name });
    if (!doc) return null;
    return this.toDTO(doc);
  }
  async me(id: string): Promise<GetUserResponseDTO | null> {
    //lean devuelve objetos JS simples, no documentos de mongoose, es mas rapido y liviano
    try {
      const doc = await UserModel.findOne({ _id: id, delete_at: null })
        .populate("role_id", "name")
        .populate("company_id", "name")
        .lean();
      if (!doc) return null;
      return this.toDTO(doc);
    } catch (error) {
      console.error(error);
      throw new Error("error en persisntecia metodo me");
    }
  }

  async findUser(filter?: { name?: string; email?: string; company_id?: string }): Promise<GetUserResponseDTO[]> {
    try {
      const query: any = { deleted_at: null };
      // Construir condición OR para buscar por nombre O email
      if (filter?.name || filter?.email) {
        const orConditions = [];
        if (filter?.name) {
          orConditions.push({ name: { $regex: filter.name, $options: "i" } });
        }
        if (filter?.email) {
          orConditions.push({ email: { $regex: filter.email, $options: "i" } });
        }
        query.$or = orConditions;
      }
      const docs = await UserModel.find(query).populate("role_id", "name").populate("company_id", "name").lean();
      return docs.map((doc) => this.toDTO(doc));
    } catch (error) {
      throw error;
    }
  }
}
