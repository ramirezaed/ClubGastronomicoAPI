export class categoryAlreadyActiveError extends Error {
  constructor() {
    super(`la categoria ya se encuentra activa`);
    this.name = "categoryAlreadyActiveError";
  }
}
