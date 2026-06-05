export class RoleAlreadyDeactivateError extends Error {
  constructor() {
    super("el rol ya se encuentra desactivado");
    this.name = "RoleAlreadyDeactivateError";
  }
}
