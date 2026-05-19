export interface RegisterMenuDTO {
  category_id: string;
  name: string;
  description: string;
  price: number;
  preparation_time_minutes: number;
  stock: number;
  daily_stock: number;
  image_url: string | null;
}
