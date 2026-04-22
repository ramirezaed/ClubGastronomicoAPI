export interface ITokenService {
  generateAccessToken(payload: TokenPayload): string;
  generateRefreshToken(payload: TokenPayload): string;
}

export interface TokenPayload {
  id: string;
  email: string;
  role_id: string;
  company_id: string | null;
  branch_id: string | null;
}
