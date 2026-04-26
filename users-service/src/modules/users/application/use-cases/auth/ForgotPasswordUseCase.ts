import { IUserRepository } from "@/modules/users/domain/repositories/user/IUserRepository";
import { ITokenService } from "@/modules/users/domain/services/ItokenService";
import { IEmailService } from "@/modules/users/domain/services/IEmailService";

export class ForgotPasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenService: ITokenService,
    private readonly emailService: IEmailService,
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) return;

    user.verifyIsActive();

    const resetToken = this.tokenService.generateResetToken({
      id: user.id,
      email: user.email,
    });

    await this.emailService.sendPasswordReset(user.email, resetToken);
  }
}
