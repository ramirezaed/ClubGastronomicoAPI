import { ICompanyGetResponseDTO } from "@/modules/users/application/dtos/company/IcompanyGetReponseDTO";
import { CompanyNotFoundError } from "@/modules/users/domain/exceptions/Company/CompanyNotFoundError";
import { ICompanyQueryRepository } from "@/modules/users/domain/repositories/company/ICompanyQueryrepository";

export class findByIdCompanyUseCase {
  constructor(private readonly icomapanyQueryRepository: ICompanyQueryRepository) {}
  async execute(id: string): Promise<ICompanyGetResponseDTO> {
    const company = await this.icomapanyQueryRepository.findById(id);
    if (!company) {
      //si no existe la compañia devuelve error
      throw new CompanyNotFoundError();
    }
    return company;
  }
}
