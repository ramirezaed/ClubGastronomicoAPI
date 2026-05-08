export class CompanyAlreadyActivateError extends Error {
  constructor() {
    super(`La compañia ya se encuetra activa`);
    this.name = "CompanyAlreadyActivateError";
  }
}
