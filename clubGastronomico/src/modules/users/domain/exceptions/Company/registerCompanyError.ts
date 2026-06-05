export class RegisterCompanyError extends Error {
  constructor() {
    super(`No se pudo completar el registro de la Compañía`);
    this.name = "RegisterCompanyError";
  }
}
