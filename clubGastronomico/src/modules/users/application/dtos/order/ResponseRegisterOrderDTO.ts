export interface ResponseRegisterOrderDTO {
  id: string;
  // company_id: string;
  status: string;
  customer: {
    name: string;
    address: string;
    phone?: string;
    telegram_id?: string;
    telegram_username?: string;
  };
  items: {
    // menuItems_id: string;
    // category_id: string;
    items_name: string;
    category_name: string;
    quantity: number;
    unit_price: number;
    time?: number;
  }[];
  total_amount: number;
  created_at: Date;
}
