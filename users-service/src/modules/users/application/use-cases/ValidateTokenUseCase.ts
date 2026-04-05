import jwt from "jsonwebtoken";
import { IJwtPayloadDTO } from "@/modules/users/application/dtos/IJwtPayloadDTO";
import { InvalidtokenError } from "@/modules/users/domain/exceptions/invalidToken";

export class ValidateTokenUseCase {
  async execute(token: string): Promise<IJwtPayloadDTO> {
    try {
      // verifica el token y expiracion del JWT usando la clave secreta
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET!,
      ) as IJwtPayloadDTO;
      //si es correcto devuelve la info del usuario del token
      return payload;
    } catch {
      //si el token no es valido o expiro devuelve error
      throw new InvalidtokenError();
    }
  }
}
