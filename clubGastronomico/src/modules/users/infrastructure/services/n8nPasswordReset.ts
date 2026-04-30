import { N8nServiceInactiveError } from "@/modules/users/domain/exceptions/auth/n8nserviceInactiveError";
import { PasswordResetNotifier } from "@/modules/users/domain/ports/IEmailService";
export class n8nPasswordReset implements PasswordResetNotifier {
  async notify(data: { email: string; resetToken: string }): Promise<void> {
    const url = process.env.N8N_WEBHOOK_URL;

    if (!url) {
      throw new N8nServiceInactiveError();
    }
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event: "user.forgotPassword",
          data,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error calling n8n webhook: ${response.status} - ${text}`);
      }
    } catch (error) {
      throw new N8nServiceInactiveError(); //el error aca para que no llegue al caso de uso, el caso de uso no devuelve el token
    }
  }
}
