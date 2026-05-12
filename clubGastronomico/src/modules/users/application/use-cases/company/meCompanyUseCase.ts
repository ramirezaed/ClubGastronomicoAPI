import { ICompanyGetResponseDTO } from "@/modules/users/application/dtos/company/IcompanyGetReponseDTO";
import { CompanyNotFoundError } from "@/modules/users/domain/exceptions/Company/CompanyNotFoundError";
import { CompanyQueryRepository } from "@/modules/users/infrastructure/persistence/company/CompanyQueryRepository";

export class meCompanyUseCase {
  constructor(private readonly icompanyQueryRepository: CompanyQueryRepository) {}
  async excute(id: string): Promise<ICompanyGetResponseDTO> {
    const company = await this.icompanyQueryRepository.meCompany(id);
    if (!company) {
      throw new CompanyNotFoundError();
    }
    return company;
  }
}
