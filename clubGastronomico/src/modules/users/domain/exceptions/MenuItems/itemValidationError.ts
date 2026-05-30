export class itemValidationError extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = "itemValidationError";
  }
}
