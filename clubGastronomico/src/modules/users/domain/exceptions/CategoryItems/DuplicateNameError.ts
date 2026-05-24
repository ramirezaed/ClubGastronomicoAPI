export class DuplicateNameMenuItemsError extends Error {
  constructor() {
    super(`ya existe un plato registrado con ese nombre`);
    this.name = "DuplicateNameError";
  }
}
