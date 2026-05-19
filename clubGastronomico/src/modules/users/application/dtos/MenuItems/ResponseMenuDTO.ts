export interface ResponseMenuDTO {
  id: string;
  category: {
    id: string;
    name: string;
  };

  // company: {
  //   id: string;
  //   name: string;
  // };

  // branch: {
  //   id: string;
  //   name: string;
  // } | null;

  name: string;
  description: string;
  price: number;
  preparation_time_minutes: number;
  stock: number;
  daily_stock: number;
  image_url: string | null;
  is_active: boolean;
}
