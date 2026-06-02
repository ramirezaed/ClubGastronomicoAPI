export class ValidationCancellationError extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = "ValidationCancellationError";
  }
}
