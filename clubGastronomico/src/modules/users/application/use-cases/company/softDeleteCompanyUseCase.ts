import { CompanyNotFoundError } from "@/modules/users/domain/exceptions/Company/CompanyNotFoundError";
import { ICompanyRepository } from "@/modules/users/domain/repositories/company/ICompanyRepository";

export class SoftDeleteCompanyUseCase {
  constructor(private readonly icompanyrepository: ICompanyRepository) {}
  async execute(id: string): Promise<void> {
    const company = await this.icompanyrepository.findById(id);
    if (!company) {
      throw new CompanyNotFoundError();
    }
    company.softdelete;
    await this.icompanyrepository.update(company); //eliminacion logica
  }
}
