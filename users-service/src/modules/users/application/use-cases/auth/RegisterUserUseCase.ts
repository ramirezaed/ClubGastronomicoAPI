//caso de uso Registar Usuario

import { IRegisterUserDTO } from "@/modules/users/application/dtos/user/RegisterUserDTO";
import { IUserRepository } from "@/modules/users/domain/repositories/user/IUserRepository"; //importo los metodos para registrar el usuario
import { User } from "@domain/entities/User";
import { RegisterUserError } from "@/modules/users/domain/exceptions/user/RegisterUserError"; //importo error perzonalizado
import { DuplicateEmailError } from "@/modules/users/domain/exceptions/user/DuplicateEmailError"; //importo error perzonalizado

export class RegisterUser {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: IRegisterUserDTO): Promise<Omit<User, "password">> {
    //verifica si el email ya esta registrado
    const existe = await this.userRepository.findByEmail(dto.email);
    //el email debe ser unico
    if (existe) {
      throw new DuplicateEmailError(dto.email);
    }

    //crea la entidad de dominio user
    const user = new User(
      "",
      dto.company_id ?? null,
      dto.branch_id ?? null,
      dto.name,
      dto.lastname,
      dto.email,
      dto.password,
      dto.role_id,
      false,
      null,
    );

    //se guarda el usuario mediente el repositorio
    const guardar = await this.userRepository.save(user);
    //valida que se guardo
    if (!guardar) {
      throw new RegisterUserError();
    }
    //no devuelve el password del usuario
    const { password, ...userSinpassword } = guardar;

    return userSinpassword;
  }
}
