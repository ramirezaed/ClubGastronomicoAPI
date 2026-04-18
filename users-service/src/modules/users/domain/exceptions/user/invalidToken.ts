export class InvalidtokenError extends Error {
  constructor() {
    super(`Token Invalido`);
    this.name = "InvalidTokenError";
  }
}
