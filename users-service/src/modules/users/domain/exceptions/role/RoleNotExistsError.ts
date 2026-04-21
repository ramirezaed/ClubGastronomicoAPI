export class RoleNotExistsError extends Error {
  constructor() {
    super("El rol que intentás consultar no existe.");
    this.name = "RoleNotExistsError";
  }
}
