//clase con error perzonalizado para evitar el duplicado de roles
export class RolesNotFoundError extends Error {
  constructor() {
    super(`El rol  registrado con ese nombre`);
    this.name = "DuplicateNameError";
  }
}
