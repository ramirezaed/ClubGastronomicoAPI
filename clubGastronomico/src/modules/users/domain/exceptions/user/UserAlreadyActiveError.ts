export class UserAlreadyActiveError extends Error {
  constructor() {
    super("El usuario ya se encuentra activo");
    this.name = "UserAlreadyActiveError";
  }
}
