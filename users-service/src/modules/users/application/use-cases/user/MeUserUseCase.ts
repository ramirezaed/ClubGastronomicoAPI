import { IUserRepository } from "@/modules/users/domain/repositories/user/IUserRepository";
import { UserNotExistError } from "@/modules/users/domain/exceptions/user/UserNotExistsError";
import { GetUserResponseDTO } from "@/modules/users/application/dtos/user/GetUserResponseDTO";
export class MeUserUseCase {
  constructor(private readonly iuserRepository: IUserRepository) {}

  async execute(id: string): Promise<GetUserResponseDTO> {
    const user = await this.iuserRepository.me(id);
    if (!user) {
      throw new UserNotExistError();
    }

    const role = user.role_id as any;
    const company = user.company_id as any;
    const branch = user.branch_id as any;
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
  }
}
