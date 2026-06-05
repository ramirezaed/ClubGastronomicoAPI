import { User } from "@/modules/users/domain/entities/User";
import { IUserRepository } from "@/modules/users/domain/repositories/user/IUserRepository";
import { IPasswordHash } from "@/modules/users/domain/ports/IpasswordHash";
import { IRegisterUserDTO } from "@/modules/users/application/dtos/user/RegisterUserDTO";
import { DuplicateEmailError } from "@/modules/users/domain/exceptions/user/DuplicateEmailError";
import { ResponseUserDTO } from "@/modules/users/application/dtos/user/ResponseUserDTO";
import { IRoleQueryRepository } from "@/modules/users/domain/repositories/role/IRoleQueryRepository";
import { RolesNotFoundError } from "@/modules/users/domain/exceptions/role/RolesNotFoundError";
import { ValidationRegisterUserError } from "@/modules/users/domain/exceptions/user/validationRegisterUser";
import { UserNotExistError } from "@/modules/users/domain/exceptions/user/UserNotExistsError";

export class RegisterEmployeeUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHash: IPasswordHash,
    private readonly roleRepository: IRoleQueryRepository,
  ) {}

  async execute(owner_id: string, dto: IRegisterUserDTO): Promise<ResponseUserDTO> {
    const owner = await this.userRepository.findById(owner_id);
    if (!owner || !owner.is_active) {
      throw new UserNotExistError();
    }
    if (owner.role_name !== "owner") {
      throw new ValidationRegisterUserError("no estas autorizado para realizar esta accion1");
    }
    const exists = await this.userRepository.findByEmail(dto.email);
    if (exists) {
      throw new DuplicateEmailError(dto.email);
    }
    const EmployeRole = await this.roleRepository.findByName("employee");
    if (!EmployeRole) throw new RolesNotFoundError();

    const hashedPassword = await this.passwordHash.hash(dto.password);

    const user = User.createEmployee(
      dto.name,
      dto.lastname,
      dto.email,
      hashedPassword,
      EmployeRole.id,
      EmployeRole.name,
      owner.company_id,
      dto.branch_id ?? null,
    );

    const saved = await this.userRepository.save(user);

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
