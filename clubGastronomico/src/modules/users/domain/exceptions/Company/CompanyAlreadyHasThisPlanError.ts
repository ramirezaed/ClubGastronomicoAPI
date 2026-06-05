export class CompanyAlreadyHasThisPlanError extends Error {
  constructor() {
    super(`La empresa ya se encuentra en el plan seleccionado`);
    this.name = "CompanyAlreadyHasThisPlanError";
  }
}
