export interface dailySalesReportsDTO {
  date: string;
  total_orders: number;
  total_amount: number;
}

export interface ProductRankingDTO {
  menuItems_id: string;
  item_name: string;
  category_name: string;
  total_quantity: number;
}

export interface ProductRankingReportDTO {
  top_sellers: ProductRankingDTO[];
  least_sellers: ProductRankingDTO[];
}
