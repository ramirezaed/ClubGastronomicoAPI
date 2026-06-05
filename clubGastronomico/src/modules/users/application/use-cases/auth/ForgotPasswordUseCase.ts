import { IUserRepository } from "@/modules/users/domain/repositories/user/IUserRepository";
import { ITokenService } from "@/modules/users/domain/ports/ItokenService";
import { n8nPasswordReset } from "@/modules/users/infrastructure/services/n8nPasswordReset";

export class ForgotPasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenService: ITokenService,
    private readonly n8nPasswordReset: n8nPasswordReset,
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) return;

    user.verifyIsActive();

    const resetToken = this.tokenService.generateResetToken({
      id: user.id,
      email: user.email,
    });

    await this.n8nPasswordReset.notify({ email: user.email, resetToken });
  }
}
