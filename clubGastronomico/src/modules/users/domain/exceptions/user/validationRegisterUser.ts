export class ValidationRegisterUserError extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = "validationRegisterUserError";
  }
}
