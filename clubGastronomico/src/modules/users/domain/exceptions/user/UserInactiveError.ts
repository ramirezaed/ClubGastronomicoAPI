export class UserInactiveError extends Error {
  constructor() {
    super(`El usuario se encuentra inactivo`);
    this.name = "UserInactiveError";
  }
}
