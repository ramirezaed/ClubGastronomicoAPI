export class RoleAlreadyActivateError extends Error {
  constructor() {
    super("el rol ya se encuentra activado");
    this.name = "RoleAlreadyActivateError";
  }
}

export class RegisterRoleError extends Error {
  constructor() {
    super("No pudimos registrar el rol. Intentalo nuevamente.");
    this.name = "RegisterRoleError";
  }
}
