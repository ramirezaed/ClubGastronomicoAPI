import { ITokenService } from "@/modules/users/domain/ports/ItokenService";

export class RefreshTokenUseCase {
  constructor(private readonly tokenService: ITokenService) {}

  async execute(refreshToken: string): Promise<{ accessToken: string }> {
    const payload = this.tokenService.verifyRefreshToken(refreshToken);
    return {
      accessToken: this.tokenService.generateAccessToken(payload),
    };
  }
}
