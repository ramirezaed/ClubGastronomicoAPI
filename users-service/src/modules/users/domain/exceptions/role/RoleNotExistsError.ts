export class RoleNotExistsError extends Error {
  constructor() {
    super(`el rol que buscas no se encuentra registrado, o fue eliminado`);
    this.name = "RoleNotExistsError";
  }
}
