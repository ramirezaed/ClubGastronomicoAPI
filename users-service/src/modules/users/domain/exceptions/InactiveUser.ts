export class InactiveUserError extends Error {
  constructor() {
    super(`Tu cuenta se encuentra inactiva. Contactá al administrador`);
    this.name = "InactiveUserError";
  }
}
