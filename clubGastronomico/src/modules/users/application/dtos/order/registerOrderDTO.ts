export interface registerOrderDTO {
  customer: {
    name: string;
    address: string;
    phone?: string;
    telegram_username?: string;
  };
  items: {
    menuItems_id: string;
    quantity: number;
  }[];
}
