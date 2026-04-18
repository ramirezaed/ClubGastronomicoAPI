//clase con error perzonalizado para evitar el duplicado de roles
export class RolesNotFoundError extends Error {
  constructor() {
    super(`No contamos con datos del roll`);
    this.name = "RolesNotFoundError";
  }
}
