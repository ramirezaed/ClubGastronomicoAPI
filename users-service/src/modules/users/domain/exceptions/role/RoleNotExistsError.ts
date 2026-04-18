export class RoleNotExistsError extends Error {
  constructor() {
    super(`el rol que buscas no se encuentra`);
    this.name = "RoleNotExistsError";
  }
}
