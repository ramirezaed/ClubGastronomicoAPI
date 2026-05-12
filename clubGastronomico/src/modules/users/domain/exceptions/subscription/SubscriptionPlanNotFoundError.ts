export class SubscriptionPlanNotFoundError extends Error {
  constructor() {
    super("El plan de subscripción no fue encontrado.");
    this.name = "SubscriptionPlanNotFoundError";
  }
}
