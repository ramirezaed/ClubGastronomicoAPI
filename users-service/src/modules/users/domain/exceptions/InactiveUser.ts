export class InactiveUserError extends Error {
  constructor() {
    super(`Usuario Inactivo`);
    this.name = "InactiveUserError";
  }
}
