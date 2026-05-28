import { CompanyNotFoundError } from "@/modules/users/domain/exceptions/Company/CompanyNotFoundError";
import { orderValidationError } from "@/modules/users/domain/exceptions/order/orderValidationError";

//inteface parte del dominio, no respresenta entrada ni salids, por eso no va en dto
export interface OrderItem {
  menuItems_id: string;
  category_id: string;
  item_name: string;
  category_name: string;
  quantity: number;
  unit_price: number;
  time?: number;
}
//inteface parte del dominio, no respresentan entrada ni salida, por eso no va en dto
export interface Customer {
  name: string;
  address: string;
  phone?: string;
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
    public readonly deleted_at: Date | null,
    public readonly created_at?: Date,
    public readonly updated_at?: Date,
  ) {}

  static create(company_id: string, customer: Customer, orderItems: OrderItem[]): Order {
    //verifca el id de la compañia
    if (!company_id) {
      throw new CompanyNotFoundError();
    }
    //verificar nombre y telefono del cliente
    //cuando se hace de forma presencial el pedido, direccion de envio es opcional
    if (!customer.name || !customer.phone) {
    }
    //si la orden no tiene ningun items, es la longitud del array es 0
    if (!orderItems.length) {
      throw new orderValidationError(`No has seleccionado ningun item`);
    }
    //reccorre toda la orden y los revisa uno por uno
    for (const item of orderItems) {
      //verifica que la cantidad de cada item sea mayor que 0
      if (item.quantity <= 0) {
        throw new orderValidationError(`la cantidad seleccionada para el item ${item.item_name}, no es correcta`);
      }
      //verifica que el precio de cada item sea mayor que 0
      if (item.unit_price <= 0) {
        throw new orderValidationError(`El precio de ${item.item_name} es incorrecto`);
      }
    }
    //.reduce convierte un arreglo entero en unico valor
    // 0 al final indica el inicio del total y el acumulador
    const total_amount = orderItems.reduce((total, item) => total + item.quantity * item.unit_price, 0);
    return new Order("", company_id, "Pendiente", customer, orderItems, total_amount, null, new Date(), new Date());
  }
}
