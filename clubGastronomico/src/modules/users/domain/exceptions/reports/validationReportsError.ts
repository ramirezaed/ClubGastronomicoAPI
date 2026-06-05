export class ValidationReportsError extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = "ValidationReportsError";
  }
}
