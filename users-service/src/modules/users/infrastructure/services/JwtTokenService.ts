import jwt from "jsonwebtoken";
import { ITokenService, TokenPayload } from "@/modules/users/domain/services/ItokenService";

export class JwtTokenService implements ITokenService {
  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "15m" });
  }

  generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });
  }
}
