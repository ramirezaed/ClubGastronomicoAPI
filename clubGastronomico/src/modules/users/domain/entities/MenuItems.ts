import { RegisterMenuError } from "@/modules/users/domain/exceptions/MenuItems/RegisterMenuError";

export class MenuItems {
  constructor(
    public readonly id: string,
    public category_id: string,
    public company_id: string,
    public name: string,
    public description: string,
    public price: number,
    public preparation_time_minutes: number,
    public stock: number,
    public daily_stock: number,
    public image_url: string | null,
    public is_active: boolean,
    public deleted_at: Date | null,
  ) {}

  static create(
    category_id: string,
    company_id: string,
    name: string,
    description: string,
    price: number,
    preparation_time_minutes: number,
    stock: number,
    daily_stock: number,
    image_url: string | null,
  ): MenuItems {
    if (!category_id || !company_id || !name || !description || !price || !preparation_time_minutes || !stock || !daily_stock) {
      throw new RegisterMenuError();
    }
    return new MenuItems("", category_id, company_id, name, description, price, 15, stock, 100, image_url, true, null);
  }
}
