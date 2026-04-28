//caso de uso registrar role
import { Role } from "@/modules/users/domain/entities/Role";
import { IRegisterRoleDTO } from "@/modules/users/application/dtos/role/RegisterRoleDTO";
import { IRoleRepository } from "@/modules/users/domain/repositories/role/IRoleRepository";
import { DuplicateNameError } from "@/modules/users/domain/exceptions/role/DuplicateNameError";
import { RoleResponseDto } from "@/modules/users/application/dtos/role/RoleResponseDTO";
import { IRoleQueryRepository } from "@/modules/users/domain/repositories/role/IRoleQueryRepository";

export class RegisterRole {
  constructor(
    private readonly roleRepository: IRoleRepository,
    private readonly roleQueryRepository: IRoleQueryRepository,
  ) {}

  async execute(dto: IRegisterRoleDTO): Promise<RoleResponseDto> {
    const exists = await this.roleQueryRepository.findByName(dto.name);
    if (exists) {
      throw new DuplicateNameError(dto.name);
    }
    const role = Role.create(dto.name, dto.description);
    const saved = await this.roleRepository.save(role);

    return {
      id: saved.id,
      name: saved.name,
      description: saved.description,
      is_active: saved.is_active,
    };
  }
}
