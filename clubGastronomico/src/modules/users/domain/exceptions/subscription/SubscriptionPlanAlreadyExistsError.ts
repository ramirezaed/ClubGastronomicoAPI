import { error } from "node:console";

export class SubscriptionPlanAlreadyExistsError extends Error {
  constructor() {
    super(`ya existe un plan registrado con ese nombre`);
    this.name = "SubscriptionPlanAlreadyExistsError";
  }
}
