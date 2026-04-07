import { UserNotExistError } from "@/modules/users/domain/exceptions/UserNotExistsError";
import { IUserRepository } from "@/modules/users/domain/repositories/IUserRepository";
import { ResponseUserDTO } from "@/modules/users/application/dtos/ResponseUserDTO";

export class ChangeStatusUserUseCase {
  constructor(private readonly IuserRepository: IUserRepository) {}

  async execute(id: string): Promise<ResponseUserDTO> {
    const user = await this.IuserRepository.findById(id);
    if (!user) {
      throw new UserNotExistError(); //si no encuentra el usuario con el id devuelve el error
    }
    //dto.is_active es el opuesto a al estado que tiene el usuario
    const is_active = !user?.is_active;
    const userActualizado = await this.IuserRepository.activateDesactivte(id, is_active);

    if (!userActualizado) {
      throw new UserNotExistError(); //envia el msj "El usuario que buscas no existe o fue eliminado."
    }
    return userActualizado;
  }
}
