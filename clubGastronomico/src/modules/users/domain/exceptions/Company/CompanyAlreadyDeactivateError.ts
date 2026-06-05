export class CompanyAlreadyDeactivateError extends Error {
  constructor() {
    super(`La compañia ya se encuetra Inactiva`);
    this.name = "CompanyAlreadyActivateError";
  }
}
