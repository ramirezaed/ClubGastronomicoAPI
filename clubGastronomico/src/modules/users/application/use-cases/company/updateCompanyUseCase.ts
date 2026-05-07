import { UpdateCompanyDTO } from "@/modules/users/application/dtos/company/updateCompanyDTO";
import { UpdateCompanyResponseDTO } from "@/modules/users/application/dtos/company/updateCompanyResponseDTO";
import { CompanyNotFoundError } from "@/modules/users/domain/exceptions/Company/CompanyNotFoundError";
import { ICompanyRepository } from "@/modules/users/domain/repositories/company/ICompanyRepository";

export class UpdateCompanyUseCase {
  constructor(private readonly icompanyRepository: ICompanyRepository) {}
  async execute(id: string, dto: UpdateCompanyDTO): Promise<UpdateCompanyResponseDTO> {
    const company = await this.icompanyRepository.findById(id);
    if (!company) {
      throw new CompanyNotFoundError();
    }
    company.update(dto.name, dto.phone);
    await this.icompanyRepository.update(company);
    return {
      name: company.name,
      phone: company.phone,
    };
  }
}
