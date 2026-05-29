import { CompanyNotFoundError } from "@/modules/users/domain/exceptions/Company/CompanyNotFoundError";
import { OrderNotFoundError } from "@/modules/users/domain/exceptions/order/orderNotFoundError";
import { ICompanyQueryRepository } from "@/modules/users/domain/repositories/company/ICompanyQueryrepository";
import { IMenuRepository } from "@/modules/users/domain/repositories/MenuItems/IMenuRepository";
import { IorderRepository } from "@/modules/users/domain/repositories/order/IorderRepository";

export class softdeleteOrderUseCase {
  constructor(
    private readonly iorderRepository: IorderRepository,
    private readonly icompanyQuery: ICompanyQueryRepository,
    private readonly imenuItemRepository: IMenuRepository,
  ) {}

  async execute(id: string, company_id: string): Promise<void> {
    const company = await this.icompanyQuery.findById(company_id);
    if (!company) {
      throw new CompanyNotFoundError();
    }
    const order = await this.iorderRepository.findById(id, company_id);
    if (!order) {
      throw new OrderNotFoundError();
    }
    //cancela la orden deleted_ad = new Date()
    order.softdelete();
    //registra el cambio en la bd
    await this.iorderRepository.update(order, company_id);

    //suma stock que se habia descontado al confirmar la orden
    for (const item of order.items) {
      const menuItems = await this.imenuItemRepository.findById(item.menuItems_id);
      if (menuItems) {
        menuItems.increaseStock(item.quantity);
        await this.imenuItemRepository.increaseDecreaseStock(menuItems);
      }
    }
  }
}
