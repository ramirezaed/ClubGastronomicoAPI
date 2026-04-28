export class UpdateRoleError extends Error {
  constructor() {
    super("No pudimos actualizar el rol. Intentalo nuevamente.");
    this.name = "UpdateRoleError";
  }
}
