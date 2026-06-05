export class CompanyNotFoundError extends Error {
  constructor() {
    super(`No contamos con datos de la compañia`);
    this.name = "CompanyNotFoundError";
  }
}
