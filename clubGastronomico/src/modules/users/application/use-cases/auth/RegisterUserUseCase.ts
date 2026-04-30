import { User } from "@/modules/users/domain/entities/User";
import { IUserRepository } from "@/modules/users/domain/repositories/user/IUserRepository";
import { IPasswordHash } from "@/modules/users/domain/ports/IpasswordHash";
import { IRegisterUserDTO } from "@/modules/users/application/dtos/user/RegisterUserDTO";
import { DuplicateEmailError } from "@/modules/users/domain/exceptions/user/DuplicateEmailError";
import { ResponseUserDTO } from "@/modules/users/application/dtos/user/ResponseUserDTO";
import { IRoleQueryRepository } from "@/modules/users/domain/repositories/role/IRoleQueryRepository";
import { RolesNotFoundError } from "@/modules/users/domain/exceptions/role/RolesNotFoundError";
import { UserRegisterNotifier } from "@/modules/users/domain/ports/UserResgisterNotifier";

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHash: IPasswordHash,
    private readonly roleRepository: IRoleQueryRepository,
    private readonly registerNotifier: UserRegisterNotifier,
  ) {}

  async execute(dto: IRegisterUserDTO): Promise<ResponseUserDTO> {
    const exists = await this.userRepository.findByEmail(dto.email);
    if (exists) {
      throw new DuplicateEmailError(dto.email);
    }
    const ownerRole = await this.roleRepository.findByName("owner");
    if (!ownerRole) throw new RolesNotFoundError();

    const hashedPassword = await this.passwordHash.hash(dto.password);

    const user = User.create(
      dto.name,
      dto.lastname,
      dto.email,
      hashedPassword,
      ownerRole.id, // rol owner por defecto
      ownerRole.name,
      dto.company_id ?? null,
      dto.branch_id ?? null,
    );

    const saved = await this.userRepository.save(user);
    //llama al evento externo "n8n"
    try {
      await this.registerNotifier.notify({
        id: user.id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
      });
    } catch (error) {
      console.error(error);
    }

    return {
      id: saved.id,
      name: saved.name,
      lastname: saved.lastname,
      email: saved.email,
      role_id: saved.role_id,
      role_name: saved.role_name,
      company_id: saved.company_id,
      branch_id: saved.branch_id,
      is_active: saved.is_active,
    };
  }
}
