import { CompanyNotFoundError } from "@/modules/users/domain/exceptions/Company/CompanyNotFoundError";
import { orderValidationError } from "@/modules/users/domain/exceptions/order/orderValidationError";
import orderRouter from "@/modules/users/infrastructure/http/orderRouter";

//interface parte del dominio
export enum OrderStatus {
  PENDING = "Pendiente",
  IN_PROGRESS = "En Progreso",
  COMPLETED = "Completo",
}
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
    public status: string,
    public customer: Customer,
    public items: OrderItem[],
    public total_amount: number,
    public deleted_at: Date | null,
    public created_at: Date,
    public updated_at?: Date,
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
  changeStatus(status: OrderStatus): void {
    //verifica el estado actual con el nuevo estado
    if (this.status === status) {
      throw new orderValidationError(`el orden ya se encentra en estado ${status} `);
    }
    //una orden con estado pendiente solo puede pasar a en progreso
    if (this.status === OrderStatus.PENDING && status === OrderStatus.COMPLETED) {
      throw new orderValidationError(`No se puede pasar de ${this.status} a ${status}`);
    }
    //una orden con estado en progreso solo puede pasar a finalizado
    if (this.status === OrderStatus.IN_PROGRESS && status === OrderStatus.PENDING) {
      throw new orderValidationError(`No se puede pasar de ${this.status} a ${status}`);
    }
    //si ya esta finalizada no puede cambiar de estado
    if (this.status === OrderStatus.COMPLETED) {
      throw new orderValidationError(`La orden ya se encuentra finalizada`);
    }
    this.status = status;
  }

  softdelete(): void {
    if (this.deleted_at) {
      throw new orderValidationError(`la orden ya fue cancelada`);
    }
    if (this.status === OrderStatus.COMPLETED) {
      throw new orderValidationError("la orden ya está completa");
    }
    const now = new Date();
    if (this.created_at < new Date(now.setDate(now.getDate() - 1))) {
      throw new orderValidationError("no se pueden cancelar ordenes de dias anteriores");
    }

    this.deleted_at = new Date();
  }
}
