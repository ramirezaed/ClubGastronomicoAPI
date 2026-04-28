export class RegisterRoleError extends Error {
  constructor() {
    super("No pudimos registrar el rol. Intentalo nuevamente.");
    this.name = "RegisterRoleError";
  }
}
