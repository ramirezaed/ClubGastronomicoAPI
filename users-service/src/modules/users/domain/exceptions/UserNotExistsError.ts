export class UserNotExistError extends Error {
  constructor() {
    super(`El usuario que buscas no existe o fue eliminado.`);
    this.name = "UserNotExistError";
  }
}
