import { UserRegisterNotifier } from "@/modules/users/domain/ports/UserResgisterNotifier";
import { N8nServiceNotFound } from "@/modules/users/domain/exceptions/auth/n8nserviceNotFoundError";

export class n8nRegisterNotifier implements UserRegisterNotifier {
  async notify(data: { id: string; name: string; lastname: string; email: string }): Promise<void> {
    const url = process.env.N8N_WEBHOOK_URL;

    if (!url) {
      throw new Error("N8N_WEBHOOK_URL is not defined");
    }
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event: "user.registered",
          data,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Error al llamar al servicio de n8n (user.registered):", {
          status: response.status,
          body: text,
        });
        throw new N8nServiceNotFound();
      }
    } catch (error) {
      throw new N8nServiceNotFound();
    }
  }
}
