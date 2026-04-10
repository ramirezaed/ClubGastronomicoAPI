import { IUserRepository } from "@/modules/users/domain/repositories/user/IUserRepository";
import { GetUserResponseDTO } from "@/modules/users/application/dtos/user/GetUserResponseDTO";
import { BranchDTO } from "@/modules/users/application/dtos/CompanyBranchDTO/branchDTO";
import { CompanyDTO } from "@/modules/users/application/dtos/CompanyBranchDTO/companyDTO";
import { RoleDTO } from "@/modules/users/application/dtos/role/RoleDTO";
export class GetAllUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(filter?: { is_active?: boolean }): Promise<GetUserResponseDTO[]> {
    const users = await this.userRepository.findAll(filter);

    return users.map((user) => {
      const role = user.role_id as unknown as RoleDTO;
      const company = user.company_id as unknown as CompanyDTO | null;
      const branch = user.branch_id as unknown as BranchDTO | null;

      return {
        id: user.id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        role: role ? { id: role._id.toString(), name: role.name } : null,
        company: company ? { id: company._id.toString(), name: company.name } : null,
        branch: branch ? { id: branch._id.toString(), name: branch.name } : null,
        is_active: user.is_active,
      };
    });
  }
}
