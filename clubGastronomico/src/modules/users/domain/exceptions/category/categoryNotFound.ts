export class categoryNotFound extends Error {
  constructor() {
    super(`Categoria no encontrada`);
    this.name = "categoryNotFound";
  }
}
