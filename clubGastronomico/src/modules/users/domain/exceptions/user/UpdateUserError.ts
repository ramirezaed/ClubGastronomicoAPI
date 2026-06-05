export class UpdateUserError extends Error {
  constructor() {
    super(`No se pudo actualizar los datos del usuario`);
    this.name = "UpdateUserError";
  }
}
