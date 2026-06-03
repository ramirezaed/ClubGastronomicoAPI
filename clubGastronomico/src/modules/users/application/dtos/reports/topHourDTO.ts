export interface TopDayHourDTO {
  day_of_week: string;
  hour_from: number;
  hour_to: number;
  label: string;
  total_orders: number;
}

export interface TopHoursReportDTO {
  date_from: string;
  date_to: string;
  top_hours: TopDayHourDTO[];
}
