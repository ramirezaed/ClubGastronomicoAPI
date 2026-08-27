export interface TopItemsDTO {
  // menuItems_id: string;
  item_name: string;
  category_name: string;
  total_quantity: number;
  total_amount: number;
}

export interface topItemsReportsDTO {
  date_from: string;
  date_to: string;
  topItems: TopItemsDTO[];
}
