// recibe el LoginRequest.ts , llama a UserRepository (la interface),
//busca al usuario y compara la contraseña, genera el token
import { ILoginDTO } from "@/modules/users/application/dtos/LoginDTO.ts";
import { IUserRepository } from "@/modules/users/domain/repositories/IUserRepository";
import { ILoginResponseDTO } from "@/modules/users/application/dtos/ILoginResponseDTO";
import { InvalidCreedentialError } from "@/modules/users/domain/exceptions/InvalidCreedentialError";
import { InactiveUserError } from "@/modules/users/domain/exceptions/InactiveUser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class LoginUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: ILoginDTO): Promise<ILoginResponseDTO> {
    //verifica que el mail este registrado
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new InvalidCreedentialError();
    }
    //verifica que el usuario se encuentre activo
    if (!user.is_active) {
      throw new InactiveUserError();
    }
    //verifica la contraseña ingresada con la hasheada
    const password = await bcrypt.compare(dto.password, user.password);
    if (!password) {
      throw new InvalidCreedentialError();
    }

    //Payload separado y reutilizado en ambos tokens
    // const payload: IJwtPayloadDTO = {
    const payload = {
      id: user.id,
      company: user.company_id,
      branch: user.branch_id,
      email: user.email,
      role_id: user.role_id,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: "7d",
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        company_id: user.company_id,
        branch_id: user.branch_id,
        name: user.name,
        email: user.email,
        role_id: user.role_id,
      },
    };
  }
}
