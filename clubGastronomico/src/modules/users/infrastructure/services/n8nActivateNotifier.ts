import { N8nServiceNotFound } from "@/modules/users/domain/exceptions/auth/n8nserviceNotFoundError";
import { UserActivateNotifier } from "@/modules/users/domain/ports/UserAcivateNotifier";

export class n8nActivateNotifier implements UserActivateNotifier {
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
          event: "user.activate",
          data,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error calling n8n webhook: ${response.status} - ${text}`);
      }
    } catch (error) {
      throw new N8nServiceNotFound();
    }
  }
}
