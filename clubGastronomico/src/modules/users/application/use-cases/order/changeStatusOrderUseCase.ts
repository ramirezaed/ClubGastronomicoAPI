import { responseOrderStatusDTO } from "@/modules/users/application/dtos/order/ResponseOrderStatusDTO";
import { OrderStatus } from "@/modules/users/domain/entities/Order";
import { CompanyNotFoundError } from "@/modules/users/domain/exceptions/Company/CompanyNotFoundError";
import { OrderNotFoundError } from "@/modules/users/domain/exceptions/order/orderNotFoundError";
import { orderValidationError } from "@/modules/users/domain/exceptions/order/orderValidationError";
import { ICompanyQueryRepository } from "@/modules/users/domain/repositories/company/ICompanyQueryrepository";
import { IorderRepository } from "@/modules/users/domain/repositories/order/IorderRepository";

export class changeStatusOrderUsecase {
  constructor(
    private readonly iorderRepository: IorderRepository,
    private readonly icompanyQueryRepository: ICompanyQueryRepository,
  ) {}
  async execute(order_id: string, status: OrderStatus, company_id: string): Promise<responseOrderStatusDTO> {
    //verifica que exista la compania
    const company = await this.icompanyQueryRepository.findById(company_id);
    if (!company) {
      throw new CompanyNotFoundError();
    }
    //verfifica que exista la orde en la compania (Pendiente , En Progreso Completo)
    const order = await this.iorderRepository.findById(order_id, company_id);
    if (!order) {
      throw new OrderNotFoundError();
    }
    //verifica que el estado que se ingresa exista
    if (!Object.values(OrderStatus).includes(status)) {
      throw new orderValidationError(`Estado incorrecto`);
    }
    //genera el cambio de estado en la orden
    order.changeStatus(status);

    //registra en la bd el cambio de estado
    await this.iorderRepository.update(order, company_id);

    return {
      id: order.id,
      status: order.status,
    };
  }
}
