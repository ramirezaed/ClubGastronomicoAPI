export class CategoryNotFound extends Error {
  constructor() {
    super(`No contamos con datos de la categoria`);
    this.name = "CategoryNotFound";
  }
}
