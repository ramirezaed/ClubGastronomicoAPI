export interface PasswordResetNotifier {
  notify(data: { email: string; resetToken: string }): Promise<void>;
}
