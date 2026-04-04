export class UpdateRoleError extends Error {
  constructor() {
    super(`No se pudo modificar el rol`);
    this.name = "UpdateRoleError";
  }
}
