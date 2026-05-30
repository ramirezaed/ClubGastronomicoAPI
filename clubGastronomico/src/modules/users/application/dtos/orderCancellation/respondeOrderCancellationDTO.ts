export interface ResponseOrderCancellationDTO {
  id: string;
  order_id: string;
  reason: string;
  custom_reason?: string;
}
