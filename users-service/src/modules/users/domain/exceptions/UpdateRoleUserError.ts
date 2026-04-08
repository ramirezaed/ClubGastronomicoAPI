export class UpdateRoleUserError extends Error {
  constructor() {
    super(`Ocurrio un error al cambiar el rol del usuario.`);
    this.name = "ChangeRoleUserError";
  }
}
