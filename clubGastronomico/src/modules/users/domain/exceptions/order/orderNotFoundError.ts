export class OrderNotFoundError extends Error {
  constructor() {
    super(`orden de compra no encontrada`);
    this.name = "OrderNotFoundError";
  }
}
