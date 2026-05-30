export enum CANCELLATION_REASON {
  FOOD_COLD = "El pedido llego frio",
  BAD_CONDITION = "El pedido no llego en condiciones",
  WRONG_ORDER = "No es lo que esperaba",
  DELAY = "Demora en la entrega",
  OTHER = "Otro",
}

export class OrderCancellation {
  constructor(
    public readonly id: string,
    public readonly order_id: string,
    public readonly company_id: string,
    public readonly reason: string,
    public readonly custom_reason?: string,
  ) {}
}
