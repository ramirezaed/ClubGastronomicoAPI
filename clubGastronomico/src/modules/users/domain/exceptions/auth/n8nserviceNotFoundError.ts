export class N8nServiceNotFound extends Error {
  constructor() {
    super(`el servicio en este momento`);
    this.name = "N8nServiceNotFound";
  }
}
