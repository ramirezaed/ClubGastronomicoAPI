import { ValidationCancellationError } from "@/modules/users/domain/exceptions/cancellationOrder/validationCancellation";
import { CompanyNotFoundError } from "@/modules/users/domain/exceptions/Company/CompanyNotFoundError";
import { OrderNotFoundError } from "@/modules/users/domain/exceptions/order/orderNotFoundError";

export enum Cancellation_Reason {
  LONG_WAIT_TIME = "El tiempo de espera es demasiado largo",
  WRONG_ADDRESS = "Me equivoqué en la dirección de entrega",
  MISTAKE_IN_ITEMS = "Pedí los productos equivocados",
  FORGOT_DISCOUNT = "Olvidé aplicar un cupón o descuento",
  DUPLICATED_ORDER = "Hice el pedido dos veces sin querer",
  BUDGET_EXCEEDED = "El costo final superó mi presupuesto",
  NO_LONGER_WANTED = "Ya no quiero el pedido / Cambié de opinión",
  OTHER = "Otro motivo",
}

export class OrderCancellation {
  constructor(
    public readonly id: string,
    public readonly order_id: string,
    public readonly company_id: string,
    public reason: string,
    public custom_reason?: string,
  ) {}

  static create(order_id: string, company_id: string, reason: Cancellation_Reason, custom_reason?: string) {
    if (!company_id) {
      throw new CompanyNotFoundError();
    }
    if (!order_id) {
      throw new OrderNotFoundError();
    }
    if (!reason) {
      throw new ValidationCancellationError(
        `Por favor, indícanos el motivo de la cancelación para poder mejorar nuestro servicio`,
      );
    }
    if (reason === Cancellation_Reason.OTHER && !custom_reason?.trim()) {
      throw new ValidationCancellationError("Debe especificar el motivo cuando selecciona 'Otro motivo'");
    }
    return new OrderCancellation("", order_id, company_id, reason, custom_reason);
  }
}
