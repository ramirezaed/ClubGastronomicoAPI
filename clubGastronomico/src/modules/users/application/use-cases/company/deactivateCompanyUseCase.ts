import { deactivateCompanyResponseDTO } from "@/modules/users/application/dtos/company/deactivateCompanyResponseDTO";
import { CompanyNotFoundError } from "@/modules/users/domain/exceptions/Company/CompanyNotFoundError";
import { ICompanyRepository } from "@/modules/users/domain/repositories/company/ICompanyRepository";

export class DeactivateCompanyUseCase {
  constructor(private readonly icompanyRepository: ICompanyRepository) {}
  async execute(id: string): Promise<deactivateCompanyResponseDTO> {
    const company = await this.icompanyRepository.findById(id);
    if (!company) {
      throw new CompanyNotFoundError();
    }
    company.deactivate;
    await this.icompanyRepository.update(company);
    return {
      id: company.id,
      is_active: company.is_active,
    };
  }
}
