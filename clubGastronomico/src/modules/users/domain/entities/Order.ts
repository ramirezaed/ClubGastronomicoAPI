//inteface parte del dominio, no respresenta entrada ni salids, por eso no va en dto
export interface OrderItem {
  product_id: string;
  category_id: string;
  product_name: string;
  category_name: string;
  quantity: number;
  unit_price: number;
  time?: number;
}
//inteface parte del dominio, no respresentan entrada ni salida, por eso no va en dto
export interface Customer {
  name: string;
  address: string;
  telegram_id?: string;
  telegram_username?: string;
}

export class Order {
  constructor(
    public readonly id: string,
    public readonly company_id: string,
    // public readonly branch_id: string,
    public readonly status: string,
    public readonly customer: Customer,
    public readonly items: OrderItem[],
    public readonly total_amount: number,
    public readonly created_at?: Date,
    public readonly updated_at?: Date,
  ) {}
}
