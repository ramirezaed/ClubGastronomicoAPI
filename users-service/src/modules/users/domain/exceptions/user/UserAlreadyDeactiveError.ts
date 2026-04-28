export class UserAlreadyDeactiveError extends Error {
  constructor() {
    super("El usuario ya se encuentra inactivo");
    this.name = "UserAlreadyDeactiveError";
  }
}
