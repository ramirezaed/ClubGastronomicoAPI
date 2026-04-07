import { ChangeStatusUserDTO } from "@/modules/users/application/dtos/ChangeStatusUserDTO";
import { UserNotExistError } from "@/modules/users/domain/exceptions/UserNotExistsError";
import { IUserRepository } from "@/modules/users/domain/repositories/IUserRepository";
import { ResponseUserDTO } from "@/modules/users/application/dtos/ResponseUserDTO";

export class ChangeStatusUserUseCase {
  constructor(private readonly IuserRepository: IUserRepository) {}

  async execute(id: string, dto: ChangeStatusUserDTO): Promise<ResponseUserDTO> {
    const user = await this.IuserRepository.activateDesactivte(id, dto.is_active);
    if (!user) {
      throw new UserNotExistError(); //envia el msj "El usuario que buscas no existe o fue eliminado."
    }
    return user;
  }
}
