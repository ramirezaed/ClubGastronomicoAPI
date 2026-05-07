import { ICompanyGetResponseDTO } from "@/modules/users/application/dtos/company/IcompanyGetReponseDTO";
import { IPaginatedResponseDTO, IPaginationDTO } from "@/modules/users/application/dtos/Pagination/paginationDTO";
import CompanyModel from "@/modules/users/infrastructure/persistence/company/CompanyModel";
import { error } from "node:console";

export class CompanyQueryRepository {
  private toDTO(doc: any): ICompanyGetResponseDTO {
    return {
      id: doc._id.toString(),
      subscription_plan: {
        id: doc.subscription_plan_id._id.toString(),
        name: doc.subscription_plan_id.name,
      },
      owner: {
        id: doc.owner_id._id.toString(),
        email: doc.owner_id.email,
      },
      //  owner_id: doc._id.toString(),
      name: doc.name,
      phone: doc.phone,
      is_active: doc.is_active,
    };
  }

  async getAll(pagination: IPaginationDTO): Promise<IPaginatedResponseDTO<ICompanyGetResponseDTO>> {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 10;
    const skip = (page - 1) * limit;

    const docs = await CompanyModel.find({ deleted_at: null })
      .populate("subscription_plan_id", "name")
      .populate("owner_id", "email")
      .skip(skip)
      .limit(limit)
      .lean();
    const total = await CompanyModel.countDocuments({ deleted_at: null });
    // console.error(error);
    return {
      data: docs.map(this.toDTO),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
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
      throw new Error("error en la bd al obtener datos de MeCompany");
    }
  }
}
