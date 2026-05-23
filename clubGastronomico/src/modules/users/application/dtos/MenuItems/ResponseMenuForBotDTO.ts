export interface ResponseMenuForBotDTO {
  category: {
    name: string;
  };
  name: string;
  description: string;
  price: number;
  image_url: string | null;
}
