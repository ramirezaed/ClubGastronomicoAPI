export class categoryDuplicateNameError extends Error {
  constructor() {
    super(`ya existe una categoria registrada con ese nombre`);
    this.name = "categoryDuplicateNameError";
  }
}
