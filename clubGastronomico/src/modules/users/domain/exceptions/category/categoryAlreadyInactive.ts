export class categoryAlreadyInactiveError extends Error {
  constructor() {
    super(`la categoria ya se encuentra inactiva`);
    this.name = "categoryAlreadyInactiveError";
  }
}
