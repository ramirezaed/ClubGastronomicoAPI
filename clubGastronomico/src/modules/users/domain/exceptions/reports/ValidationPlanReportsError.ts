export class ValidationPlanReportsError extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = "ValidationPlanReportsError";
  }
}
