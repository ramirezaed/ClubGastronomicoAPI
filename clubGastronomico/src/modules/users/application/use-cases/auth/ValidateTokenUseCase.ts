import { ITokenService, TokenPayload } from "@/modules/users/domain/ports/ItokenService";

export class ValidateTokenUseCase {
  constructor(private readonly tokenService: ITokenService) {}

  async execute(token: string): Promise<TokenPayload> {
    return this.tokenService.verifyAccessToken(token);
  }
}
