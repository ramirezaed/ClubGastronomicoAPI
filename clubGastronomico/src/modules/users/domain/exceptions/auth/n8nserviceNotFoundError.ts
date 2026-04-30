export class N8nServiceNotFound extends Error {
  constructor() {
    super(`el servicio n8n no funciona en este momento`);
    this.name = "N8nServiceNotFound";
  }
}
