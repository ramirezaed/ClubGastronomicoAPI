export class SubscriptionPlanInUseError extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = "SubscriptionPlanInUseError";
  }
}
