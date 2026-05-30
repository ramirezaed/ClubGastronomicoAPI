import { OrderStatus } from "@/modules/users/domain/entities/Order";
import { CompanyNotFoundError } from "@/modules/users/domain/exceptions/Company/CompanyNotFoundError";
import { OrderNotFoundError } from "@/modules/users/domain/exceptions/order/orderNotFoundError";
import { ICompanyQueryRepository } from "@/modules/users/domain/repositories/company/ICompanyQueryrepository";
import { IMenuRepository } from "@/modules/users/domain/repositories/MenuItems/IMenuRepository";
import { IorderRepository } from "@/modules/users/domain/repositories/order/IorderRepository";
import { IorderCancellationRepository } from "@/modules/users/domain/repositories/orderCancellation/IorderCancellationRepository";
import { Cancellation_Reason, OrderCancellation } from "@/modules/users/domain/entities/OrderCancellation";
import { ValidationCancellationError } from "@/modules/users/domain/exceptions/cancellationOrder/validationCancellation";

export class cancelOrderUseCase {
  constructor(
    private readonly iorderRepository: IorderRepository,
    private readonly icompanyQuery: ICompanyQueryRepository,
    private readonly imenuItemRepository: IMenuRepository,
    private readonly Icancellation: IorderCancellationRepository,
  ) {}

  async execute(id: string, company_id: string, reason: Cancellation_Reason, custom_reason?: string): Promise<void> {
    const company = await this.icompanyQuery.findById(company_id);
    if (!company) {
      throw new CompanyNotFoundError();
    }
    const order = await this.iorderRepository.findById(id, company_id);
    if (!order) {
      throw new OrderNotFoundError();
    }
    //guarda stado de la orden antes de ser cancelada
    const status = order.status;

    //cancela la orden deleted_ad = new Date()
    order.cancelOrder();
    //registra el cambio en la bd
    await this.iorderRepository.update(order, company_id);

    //devuelve stock si el estado antes de cancelar la orden era pendiente o en progreso
    if (status === OrderStatus.PENDING || status === OrderStatus.IN_PROGRESS) {
      for (const item of order.items) {
        const menuItems = await this.imenuItemRepository.findById(item.menuItems_id);
        if (menuItems) {
          menuItems.increaseStock(item.quantity);
          await this.imenuItemRepository.increaseDecreaseStock(menuItems);
        }
      }
    }
    // registra la orden cancelada
    const orderCancellation = OrderCancellation.create(order.id, company.id, reason, custom_reason);
    await this.Icancellation.save(orderCancellation);
  }
}
