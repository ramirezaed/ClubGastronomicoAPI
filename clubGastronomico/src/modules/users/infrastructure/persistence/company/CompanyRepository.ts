import { Company } from "@/modules/users/domain/entities/Company";
import { ICompanyRepository } from "@/modules/users/domain/repositories/company/ICompanyRepository";
import CompanyModel from "@/modules/users/infrastructure/persistence/company/CompanyModel";

export class CompanyRepository implements ICompanyRepository {
  private toEntity(doc: any): Company {
    return new Company(
      doc.id.toString(),
      doc.owner_id.toString(),
      doc.subscription_plan_id.toString(),
      doc.name,
      doc.phone,
      doc.is_active,
      doc.deleted_at,
    );
  }
  //registra la nueva compania,
  async save(company: Company): Promise<Company> {
    const doc = new CompanyModel({
      owner_id: company.owner_id,
      subscription_plan_id: company.subscription_plan_id,
      name: company.name,
      phone: company.phone,
      is_active: company.is_active,
    });
    const saved = await doc.save();
    return this.toEntity(saved);
  }
  async findById(id: string): Promise<Company | null> {
    try {
      const doc = await CompanyModel.findOne({ _id: id, deleted_at: null });
      if (!doc) return null;
      return this.toEntity(doc);
    } catch (error) {
      // este error no se muestra al usujario final, se muestra con los logs del servidor
      throw new Error("error en la bd al buscar la compañia");
    }
  }
  async findByOwnerId(ownerID: string): Promise<Company | null> {
    const doc = await CompanyModel.findOne({ owner_id: ownerID, deleted_at: null });
    if (!doc) return null;
    return this.toEntity(doc);
  }
  async update(company: Company): Promise<Company | null> {
    try {
      const doc = await CompanyModel.findOneAndUpdate(
        { _id: company.id, deleted_at: null }, //filtro
        {
          $set: {
            //datos que se peuden modificar
            name: company.name,
            phone: company.phone,
            deleted_at: company.deleted_at, //para el softdelete
            is_active: company.is_active, // para el activte/deactivate
          },
        },
        { returnDocument: "after" }, //devvuelve el documento actualizado {new:true}
      );
      if (!doc) return null;
      return this.toEntity(doc);
    } catch (error) {
      // este error no se muestra al usujario final, se muestra con los logs del servidor
      throw new Error("error en la bd al modificar la compañia");
    }
  }
  // async softDelete(id: string): Promise<void> {
  //   try {
  //     const doc = CompanyModel.findOneAndDelete({ _id: id, deleted_at: null });
  //   } catch (error) {
  //     // este error no se muestra al usujario final, se muestra con los logs del servidor
  //     throw new Error("error en la bd al modificar la compañia");
  //   }
  // }
}
