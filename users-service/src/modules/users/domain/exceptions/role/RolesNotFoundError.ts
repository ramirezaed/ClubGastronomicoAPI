//clase con error perzonalizado para evitar el duplicado de roles
export class RolesNotFoundError extends Error {
  constructor() {
    super(`No se encontro el rol`);
    this.name = "RolesNotFoundError";
  }
}
