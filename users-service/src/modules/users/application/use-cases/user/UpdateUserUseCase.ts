import { IUpdateUserDTO } from "@/modules/users/application/dtos/user/UpdateUserDTO";
import { IUpdateUserResponseDTO } from "@/modules/users/application/dtos/user/UpdateUserResponseDTO";
import { IUserRepository } from "@/modules/users/domain/repositories/user/IUserRepository";
import { UserNotExistError } from "@/modules/users/domain/exceptions/user/UserNotExistsError";

export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string, dto: IUpdateUserDTO): Promise<IUpdateUserResponseDTO> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotExistError();
    }
    user.update(dto.name, dto.lastname); //logica en la entidad
    await this.userRepository.update(user);
    return {
      id: user.id,
      name: user.name,
      lastname: user.lastname,
    };
  }
}
