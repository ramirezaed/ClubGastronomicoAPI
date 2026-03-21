import { IRegisterUserDTO } from "../dtos/RegisterUserDTO"; //importo la interface
import { IUserRepository } from "../../domain/repositories/IUserRepository"; //importo los metodos para registrar el usuario
import { User } from "../../domain/entities/User"; //importo la clase usuario

export class RegisterUser {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: IRegisterUserDTO): Promise<Omit<User, "password">> {
    const existe = await this.userRepository.findByEmail(dto.email);
    if (existe) {
      throw new Error("El correo ya esta registrado");
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
    const { password, ...userSinpassword } = guardar;

    return userSinpassword;
  }
}
