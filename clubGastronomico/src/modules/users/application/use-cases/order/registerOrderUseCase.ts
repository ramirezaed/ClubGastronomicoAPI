import { registerOrderDTO } from "@/modules/users/application/dtos/order/registerOrderDTO";
import { ResponseOrderDTO } from "@/modules/users/application/dtos/order/ResponseOrderDTO";
import { Order } from "@/modules/users/domain/entities/Order";
import { CompanyNotFoundError } from "@/modules/users/domain/exceptions/Company/CompanyNotFoundError";
import { orderValidationError } from "@/modules/users/domain/exceptions/order/orderValidationError";
import { ICompanyQueryRepository } from "@/modules/users/domain/repositories/company/ICompanyQueryrepository";
import { IMenuQueryRepository } from "@/modules/users/domain/repositories/MenuItems/IMenuQueryRepository";
import { IMenuRepository } from "@/modules/users/domain/repositories/MenuItems/IMenuRepository";
import { IorderRepository } from "@/modules/users/domain/repositories/order/IorderRepository";

export class registerOrderUseCase {
  constructor(
    private readonly iregisterOrder: IorderRepository,
    private readonly ICompanyRepository: ICompanyQueryRepository,
    private readonly ImenuItemsQueryRepository: IMenuQueryRepository,
    private readonly imenuItemRepository: IMenuRepository,
  ) {}

  async execute(company_id: string, dto: registerOrderDTO): Promise<ResponseOrderDTO> {
    const orderItems = [];
    const company = await this.ICompanyRepository.findById(company_id);
    //verifica que la compania exista y si existe que este activa
    if (!company || !company.is_active) {
      throw new CompanyNotFoundError();
    }

    for (const item of dto.items) {
      const menuItems = await this.ImenuItemsQueryRepository.findById(item.menuItems_id);
      //verifica que exista el items y que este activado
      if (!menuItems || !menuItems.is_active) {
        throw new orderValidationError(`el items ${menuItems?.name} no esta disponible`);
      }
      //verifica stock disponible, que la orden no supere el stock disponible
      if (menuItems.stock === 0 || menuItems.stock < item.quantity) {
        throw new orderValidationError(`Stock insuficiente para ${menuItems.name}, solo contamos con ${menuItems.stock}`);
      }

      //push agrega un nuevo elemento al final del array
      //agrega el item a la order
      orderItems.push({
        menuItems_id: menuItems.id,
        category_id: menuItems.category.id,
        item_name: menuItems.name,
        category_name: menuItems.category.name,
        quantity: item.quantity,
        unit_price: menuItems.price,
      });
    }

    // genera la orden con validaciones de negocio
    const order = Order.create(company_id, dto.customer, orderItems);

    //registra en la bd
    const saved = await this.iregisterOrder.save(order);
    //la orden se registro con existo, luego
    //se hace un update de los prodcutos para descontar stock

    //una vez que se registro la orden de descuenta el stock de cada item
    for (const item of dto.items) {
      const menuItems = await this.imenuItemRepository.findById(item.menuItems_id);
      if (menuItems) {
        menuItems.decreaseStock(item.quantity);
        await this.imenuItemRepository.increaseDecreaseStock(menuItems);
      }
    }

    return {
      id: saved.id,
      status: saved.status,
      customer: {
        name: saved.customer.name,
        address: saved.customer.address,
        phone: saved.customer.phone,
        telegram_id: saved.customer.telegram_id,
        telegram_username: saved.customer.telegram_username,
      },
      items: saved.items.map((item) => ({
        items_name: item.item_name,
        category_name: item.category_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
      })),
      total_amount: saved.total_amount,
      created_at: new Date(),
    };
  }
}
