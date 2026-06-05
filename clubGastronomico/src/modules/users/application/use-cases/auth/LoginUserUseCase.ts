import { ILoginDTO } from "@/modules/users/application/dtos/user/LoginDTO.ts";
import { ILoginResponseDTO } from "@/modules/users/application/dtos/user/ILoginResponseDTO";
import { IUserRepository } from "@/modules/users/domain/repositories/user/IUserRepository";
import { IPasswordHash } from "@/modules/users/domain/ports/IpasswordHash";
import { ITokenService } from "@/modules/users/domain/ports/ItokenService";
import { InvalidCreedentialError } from "@/modules/users/domain/exceptions/user/InvalidCreedentialError";

export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHash: IPasswordHash,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(dto: ILoginDTO): Promise<ILoginResponseDTO> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) throw new InvalidCreedentialError();

    user.verifyIsActive();

    const isValid = await this.passwordHash.compare(dto.password, user.password);
    if (!isValid) throw new InvalidCreedentialError();

    const payload = {
      id: user.id,
      email: user.email,
      role_id: user.role_id,
      role_name: user.role_name,
      company_id: user.company_id,
      branch_id: user.branch_id,
    };

    return {
      accessToken: this.tokenService.generateAccessToken(payload),
      refreshToken: this.tokenService.generateRefreshToken(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role_id: user.role_id,
        role_name: user.role_name,
        company_id: user.company_id,
        branch_id: user.branch_id,
      },
    };
  }
}
