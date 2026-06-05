export interface TopDayHourDTO {
  label: string;
  total_orders: number;
}

export interface TopHoursReportDTO {
  top_hours: TopDayHourDTO[];
}
