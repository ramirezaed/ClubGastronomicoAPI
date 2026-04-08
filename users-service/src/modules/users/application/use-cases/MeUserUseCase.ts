import { IUserRepository } from "@/modules/users/domain/repositories/IUserRepository";
import { UserNotExistError } from "@/modules/users/domain/exceptions/UserNotExistsError";
import { ICompanyBranchService } from "@/modules/users/application/ports/ICompanyService";
import { GetUserResponseDTO } from "@/modules/users/application/dtos/GetUserResponseDTO";
export class MeUserUseCase {
  constructor(
    private readonly iuserRepository: IUserRepository,
    private readonly companyBranchService: ICompanyBranchService,
  ) {}

  async execute(id: string): Promise<GetUserResponseDTO> {
    const user = await this.iuserRepository.me(id);
    if (!user) {
      throw new UserNotExistError();
    }

    //let, variable que puede cambiar
    let companyData = null; //iniciamos con null (cumple la relacion 0 -> 1)
    let branchData = null; //iniciamos con null (cumple la relacion 0 -> 1)

    //si tiene company pedimos los detalles en su microservicio. si no es null
    if (user.company_id) {
      companyData = await this.companyBranchService.getCompanyById(user.company_id);
    }
    //si tiene branch pedimos los detalles en su microservicio. si no es null
    if (user.branch_id) {
      branchData = await this.companyBranchService.getBranchById(user.branch_id);
    }
    // const companyBranch=user.company_id
    // return user;
    //
    const role = user.role_id as any; // ya viene populado
    return {
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      role: role ? { id: role._id.toString(), name: role.name } : null,
      is_active: user.is_active,
      company: companyData, // Objeto con {id, name} o null
      branch: branchData, // Objeto con {id, name} o null
    };
  }
}
