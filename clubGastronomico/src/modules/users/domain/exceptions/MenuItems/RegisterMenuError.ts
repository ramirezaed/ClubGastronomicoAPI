export class RegisterMenuError extends Error {
  constructor() {
    super(`Todos los campos son necesarios`);
    this.name = "RegisterMenuError";
  }
}
