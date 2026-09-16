import { ICompanyGetResponseDTO } from "@/modules/users/application/dtos/company/IcompanyGetReponseDTO";
import { ICompanyQueryRepository } from "@/modules/users/domain/repositories/company/ICompanyQueryrepository";

export class findCompanyUseCase {
  constructor(private readonly IcompanyQueyRepository: ICompanyQueryRepository) {}

  async execute(filter: { name?: string }): Promise<ICompanyGetResponseDTO[]> {
    const company = await this.IcompanyQueyRepository.findCompany(filter);
    return company;
  }
}
