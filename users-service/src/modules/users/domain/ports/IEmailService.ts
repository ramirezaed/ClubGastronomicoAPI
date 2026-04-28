export interface IEmailService {
  sendPasswordReset(to: string, resetToken: string): Promise<void>;
}
