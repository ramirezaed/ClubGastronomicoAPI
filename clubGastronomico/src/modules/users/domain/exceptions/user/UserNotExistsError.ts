export class UserNotExistError extends Error {
  constructor() {
    super(`El usuario que buscas no existe.`);
    this.name = "UserNotExistError";
  }
}
