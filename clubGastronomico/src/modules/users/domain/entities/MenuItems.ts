export class MenuItems {
  constructor(
    public readonly id: string,
    public category_id: string,
    public company_id: string,
    public branch_id: string | null,
    public name: string,
    public descriptio: string,
    public price: number,
    public preparation_time_minutes: number,
    public stock: number,
    public daily_stock: number,
    public image_url: string,
    public is_active: boolean,
    public deleted_at: Date | null,
  ) {}
}
