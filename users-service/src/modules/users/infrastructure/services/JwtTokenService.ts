import jwt from "jsonwebtoken";
import { ITokenService, TokenPayload } from "@/modules/users/domain/services/ItokenService";
import { InvalidtokenError } from "@/modules/users/domain/exceptions/user/invalidToken";

export class JwtTokenService implements ITokenService {
  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "15m" });
  }

  generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });
  }

  verifyRefreshToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as TokenPayload;
    } catch {
      throw new InvalidtokenError();
    }
  }
  verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    } catch {
      throw new InvalidtokenError();
    }
  }
}
