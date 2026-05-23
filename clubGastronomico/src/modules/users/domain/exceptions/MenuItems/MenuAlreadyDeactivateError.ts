export class MenuAlreadyDeactivateError extends Error {
  constructor() {
    super(`El items seleccionado ya se encuentra desactivado`);
    this.name = "MenuAlreadyDeactivateError";
  }
}
