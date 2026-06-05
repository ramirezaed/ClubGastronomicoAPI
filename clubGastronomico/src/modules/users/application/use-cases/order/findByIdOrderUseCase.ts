import { ResponseOrderDTO } from "@/modules/users/application/dtos/order/ResponseOrderDTO";
import { CompanyNotFoundError } from "@/modules/users/domain/exceptions/Company/CompanyNotFoundError";
import { OrderNotFoundError } from "@/modules/users/domain/exceptions/order/orderNotFoundError";
import { ICompanyQueryRepository } from "@/modules/users/domain/repositories/company/ICompanyQueryrepository";
import { IOrderQueryRepository } from "@/modules/users/domain/repositories/order/IorderQueryRepository";

export class findByIdOrderUseCase {
  constructor(
    private readonly iorderQueryRepository: IOrderQueryRepository,
    private readonly icompanyQueryRepository: ICompanyQueryRepository,
  ) {}
  async execute(order_id: string, company_id: string): Promise<ResponseOrderDTO> {
    const company = await this.icompanyQueryRepository.findById(company_id);
    if (!company) {
      throw new CompanyNotFoundError();
    }
    const order = await this.iorderQueryRepository.findById(order_id, company_id);
    if (!order) {
      throw new OrderNotFoundError();
    }
    return order;
  }
}
