export class RegisterRoleError extends Error {
  constructor() {
    super(`No se pudo registrar el rol`);
    this.name = "RegisterRoleError";
  }
}
