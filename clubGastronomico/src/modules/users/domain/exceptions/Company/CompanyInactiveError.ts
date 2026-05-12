export class CompanyInactiveError extends Error {
  constructor() {
    super(`La compañia no se encuentra activa`);
    this.name = "CompanyInactiveError";
  }
}
