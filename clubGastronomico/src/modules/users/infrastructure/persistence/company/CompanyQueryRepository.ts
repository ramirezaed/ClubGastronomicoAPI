import { ICompanyGetResponseDTO } from "@/modules/users/application/dtos/company/IcompanyGetReponseDTO";
import { IPaginatedResponseDTO, IPaginationDTO } from "@/modules/users/application/dtos/Pagination/paginationDTO";
import { ICompanyQueryRepository } from "@/modules/users/domain/repositories/company/ICompanyQueryrepository";
import CompanyModel from "@/modules/users/infrastructure/persistence/company/CompanyModel";

export class CompanyQueryRepository implements ICompanyQueryRepository {
  private toDTO(doc: any): ICompanyGetResponseDTO {
    return {
      id: doc._id.toString(),
      subscription_plan: {
        id: doc.subscription_plan_id?._id?.toString(),
        name: doc.subscription_plan_id?.name,
      },
      owner: {
        id: doc.owner_id?._id?.toString(),
        email: doc.owner_id?.email,
      },
      name: doc.name,
      phone: doc.phone,
      is_active: doc.is_active,
    };
  }

  async getAll(pagination?: IPaginationDTO): Promise<IPaginatedResponseDTO<ICompanyGetResponseDTO>> {
    try {
      const query = { deleted_at: null };

      const page = pagination?.page ?? 1;
      const limit = pagination?.limit ?? 10;
      const skip = (page - 1) * limit;

      const [docs, total] = await Promise.all([
        CompanyModel.find(query)
          .populate("subscription_plan_id", "name")
          .populate("owner_id", "email")
          .skip(skip)
          .limit(limit)
          .lean(),
        CompanyModel.countDocuments(query),
      ]);

      return {
        data: docs.map(this.toDTO),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error("error al mostrar lista de empresas", error);
      throw new Error("error en find all");
    }
  }

  async findById(id: string): Promise<ICompanyGetResponseDTO | null> {
    try {
      const doc = await CompanyModel.findOne({ _id: id, deleted_at: null })
        .populate("subscription_plan_id", "name")
        .populate("owner_id", "email")
        .lean();
      if (!doc) return null;
      return this.toDTO(doc);
    } catch (error) {
      // este error no se muestra al usujario final, se muestra con los logs del servidor
      throw new Error("error en la bd al obtener informacion de la empresa");
    }
  }
  async meCompany(id: string): Promise<ICompanyGetResponseDTO | null> {
    try {
      const doc = await CompanyModel.findOne({ _id: id, deleted_at: null })
        .populate("subscription_plan_id", "name")
        // .populate("branch_id", "name") //habilitar cuando este implementado branch
        .populate("owner_id", "email");

      if (!doc) return null;
      return this.toDTO(doc);
    } catch (error) {
      // este error no se muestra al usujario final, se muestra con los logs del servidor
      throw new Error("error en la bd al obtener datos de MeCompany");
    }
  }
  async findCompany(filter?: { name?: string }): Promise<ICompanyGetResponseDTO[]> {
    try {
      const query: any = { deleted_at: null };
      if (filter?.name?.trim()) {
        query.name = { $regex: filter.name, $options: "i" };
      }
      const docs = await CompanyModel.find(query).lean();
      return docs.map((doc) => this.toDTO(doc));
    } catch (error) {
      throw new Error("Error interno al buscar compañía");
    }
  }
}
