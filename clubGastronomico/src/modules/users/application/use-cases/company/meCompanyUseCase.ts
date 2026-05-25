import { ICompanyGetResponseDTO } from "@/modules/users/application/dtos/company/IcompanyGetReponseDTO";
import { CompanyNotFoundError } from "@/modules/users/domain/exceptions/Company/CompanyNotFoundError";
import { ICompanyQueryRepository } from "@/modules/users/domain/repositories/company/ICompanyQueryrepository";

export class meCompanyUseCase {
  constructor(private readonly icompanyQueryRepository: ICompanyQueryRepository) {}
  async excute(id: string): Promise<ICompanyGetResponseDTO> {
    const company = await this.icompanyQueryRepository.meCompany(id);
    if (!company) {
      throw new CompanyNotFoundError();
    }
    return company;
  }
}
