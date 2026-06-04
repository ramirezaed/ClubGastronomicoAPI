export interface MonthlySalesDTO {
  month: string;
  total_orders: number;
  total_amount: number;
}

export interface SalesEvolutionReportDTO {
  months: MonthlySalesDTO[];
}
