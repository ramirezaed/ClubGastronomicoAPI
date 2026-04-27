export interface ITokenService {
  generateAccessToken(payload: TokenPayload): string;
  generateRefreshToken(payload: TokenPayload): string;
  verifyRefreshToken(token: string): TokenPayload;
  verifyAccessToken(token: string): TokenPayload;
  generateResetToken(payload: ResetTokenPayload): string;
  verifyResetToken(token: string): ResetTokenPayload; // ← nuevo
}

export interface TokenPayload {
  id: string;
  email: string;
  role_id: string;
  role_name: string;
  company_id: string | null;
  branch_id: string | null;
}
export interface ResetTokenPayload {
  id: string;
  email: string;
}
