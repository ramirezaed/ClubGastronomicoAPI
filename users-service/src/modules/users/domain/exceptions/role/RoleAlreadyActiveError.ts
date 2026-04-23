export class RoleAlreadyActivateError extends Error {
  constructor() {
    super("el rol ya se encuentra activado");
    this.name = "RoleAlreadyActivateError";
  }
}
