export interface canceledSalesDTO {
  date: string;
  total_orders: number;
}
export interface CancellationReasonDTO {
  reason: string;
  total: number;
  percentage_of_cancellations: number;
}

export interface CancellationReportDTO {
  date_from: string;
  date_to: string;
  total_orders: number;
  total_cancellations: number;
  cancellation_percentage: number;
  reasons: CancellationReasonDTO[];
}
