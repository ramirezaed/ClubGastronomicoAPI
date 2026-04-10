import { IUserRepository } from "@/modules/users/domain/repositories/user/IUserRepository";
import { GetUserResponseDTO } from "@/modules/users/application/dtos/user/GetUserResponseDTO";
import { ICompanyBranchService } from "@/modules/users/application/ports/ICompanyService";

export class GetAllUsersUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly companyBranchService: ICompanyBranchService,
  ) {}

  async execute(filter?: { is_active?: boolean }): Promise<GetUserResponseDTO[]> {
    const users = await this.userRepository.findAll(filter);

    const result = await Promise.all(
      users.map(async (user) => {
        const [company, branch] = await Promise.all([
          user.company_id ? this.companyBranchService.getCompanyById(user.company_id.toString()) : null,
          user.branch_id ? this.companyBranchService.getBranchById(user.branch_id.toString()) : null,
        ]);
        const role = user.role_id as any; // ya viene populado
        return {
          company_id: user.company_id,
          branch_id: user.branch_id,
          id: (user.id as any).toString(),
          name: user.name,
          lastname: user.lastname,
          email: user.email,
          is_active: user.is_active,
          role: role ? { id: role._id.toString(), name: role.name } : null,
        } satisfies GetUserResponseDTO;
      }),
    );

    return result;
  }
}
