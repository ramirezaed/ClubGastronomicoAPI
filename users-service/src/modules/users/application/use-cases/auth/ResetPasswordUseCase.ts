import { IUserRepository } from "@/modules/users/domain/repositories/user/IUserRepository";
import { ITokenService } from "@/modules/users/domain/services/ItokenService";
import { IPasswordHash } from "@/modules/users/domain/services/IpasswordHash";
import { UserNotExistError } from "@/modules/users/domain/exceptions/user/UserNotExistsError";

export class ResetPasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenService: ITokenService,
    private readonly passwordHash: IPasswordHash,
  ) {}

  async execute(token: string, newPassword: string): Promise<void> {
    const payload = this.tokenService.verifyResetToken(token); // lanza InvalidTokenError si expiró

    const user = await this.userRepository.findById(payload.id);
    if (!user) throw new UserNotExistError();

    user.verifyIsActive();

    const hashedPassword = await this.passwordHash.hash(newPassword);
    user.resetPassword(hashedPassword);
    await this.userRepository.update(user);
  }
}
