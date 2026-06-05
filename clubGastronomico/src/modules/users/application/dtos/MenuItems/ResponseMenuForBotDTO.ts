export interface ResponseMenuForBotDTO {
  id: string;
  category: {
    name: string;
  };
  name: string;
  description: string;
  price: number;
  image_url: string | null;
}
