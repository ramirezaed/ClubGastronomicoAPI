export class SubscriptionPlanRegisterError extends Error {
  constructor() {
    super(`Todos los campos son necesrios`);
    this.name = "SubscriptionPlanRegisterError";
  }
}
