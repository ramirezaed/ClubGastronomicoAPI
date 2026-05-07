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
  async findByOwnerId(ownerID: string): Promise<Company | null> {
    const doc = await CompanyModel.findOne({ owner_id: ownerID, deleted_at: null });
    if (!doc) return null;
    return this.toEntity(doc);
  }
}
