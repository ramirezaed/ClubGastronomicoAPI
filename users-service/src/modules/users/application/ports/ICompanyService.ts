//los puertos son interfaces que definen como el dominio / aplicacion se comunica con el mundo exterior.
//son contratos.
import { BranchDTO } from "@/modules/users/application/dtos/CompanyBranchDTO/branchDTO";
import { CompanyDTO } from "@/modules/users/application/dtos/CompanyBranchDTO/companyDTO";
export interface ICompanyBranchService {
  getCompanyById(id: string): Promise<CompanyDTO | null>;
  getBranchById(id: string): Promise<BranchDTO | null>;
}
