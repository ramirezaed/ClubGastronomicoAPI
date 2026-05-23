export class MenuAlreadyActivateError extends Error {
  constructor() {
    super(`El items seleccionado ya se encuentra activado`);
    this.name = "MenuAlreadyActivateError";
  }
}
