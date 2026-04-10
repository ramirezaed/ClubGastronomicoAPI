export class UpdateUserError extends Error {
  constructor() {
    super(`No se puedo actualizar los datos del usuario`);
    this.name = "UpdateUserError";
  }
}
