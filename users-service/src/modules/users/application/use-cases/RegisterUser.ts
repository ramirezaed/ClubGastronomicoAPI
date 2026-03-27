import { IRegisterUserDTO } from "@application/dtos/RegisterUserDTO";
import { IUserRepository } from "@domain/repositories/IUserRepository"; //importo los metodos para registrar el usuario
import { User } from "@domain/entities/User";
import { RegisterUserError } from "@domain/exceptions/RegisterUserError"; //importo error perzonalizado
import { DuplicateEmailError } from "@domain/exceptions/DuplicateEmailError"; //importo error perzonalizado

export class RegisterUser {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: IRegisterUserDTO): Promise<Omit<User, "password">> {
    const existe = await this.userRepository.findByEmail(dto.email);
    if (existe) {
      throw new DuplicateEmailError(dto.email);
    }

    const user = new User(
      "",
      dto.company_id ?? null,
      dto.branch_id ?? null,
      dto.name,
      dto.lastname,
      dto.email,
      dto.password,
      dto.role,
      false,
      null,
    );
    const guardar = await this.userRepository.save(user);
    if (!guardar) {
      throw new RegisterUserError();
    }
    const { password, ...userSinpassword } = guardar;
    return userSinpassword;
  }
}
