export class UnauthorizedUserError extends Error {
  constructor() {
    super(`Usuario No autorizado`);
    this.name = "UnauthorizedUserError";
  }
}
