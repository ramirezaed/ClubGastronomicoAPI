// application/use-cases/RefreshTokenUseCase.ts
import jwt from "jsonwebtoken";
import { IJwtPayloadDTO } from "@/modules/users/application/dtos/IJwtPayloadDTO";

export class RefreshTokenUseCase {
  //no necesita constructor, no necesita el repositorio, solo trabaj con jwt
  async execute(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      //verifica que el refresh token sea valido
      const payload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!,
      ) as IJwtPayloadDTO;
      //genera nuevo access token
      const accessToken = jwt.sign(
        {
          id: payload.id,
          company: payload.company,
          branch: payload.branch,
          email: payload.email,
          role_id: payload.role_id,
        },
        process.env.JWT_SECRET!,
        { expiresIn: "15m" },
      );
      return { accessToken };
    } catch {
      throw new Error("Refresh token invalido o expirado");
    }
  }
}
