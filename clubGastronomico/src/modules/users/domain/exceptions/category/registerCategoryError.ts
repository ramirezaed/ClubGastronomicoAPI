export class RegisterCategoryError extends Error {
  constructor() {
    super(`Todos los campos son necesario`);
    this.name = "RegisterCategoryError";
  }
}
