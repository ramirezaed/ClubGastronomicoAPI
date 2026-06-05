export class orderValidationError extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = "orderValidationError";
  }
}
