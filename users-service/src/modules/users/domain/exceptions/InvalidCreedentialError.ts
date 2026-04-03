export class InvalidCreedentialError extends Error {
  constructor() {
    super(`Correo o contraseña incorrectos.`);
    this.name = "InvalidCreedentialError";
  }
}
