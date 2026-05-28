import { OrderStatus } from "@/modules/users/domain/entities/Order";

export interface ResponseOrderDTO {
  id: string;
  status: string;
  customer: {
    name: string;
    address: string;
    phone?: string;
    telegram_id?: string;
    telegram_username?: string;
  };
  items: {
    items_name: string;
    category_name: string;
    quantity: number;
    unit_price: number;
    time?: number;
  }[];
  total_amount: number;
  created_at: Date;
}
