export class InvalidCreedentialError extends Error {
  constructor() {
    super(`Credenciales Invalidas`);
    this.name = "InvalidCreedentialError";
  }
}
