export class CompanyAlreadyExistsError extends Error {
  constructor() {
    super("Ya tenés una compañía registrada");
    this.name = "CompanyAlreadyExistsError";
  }
}
