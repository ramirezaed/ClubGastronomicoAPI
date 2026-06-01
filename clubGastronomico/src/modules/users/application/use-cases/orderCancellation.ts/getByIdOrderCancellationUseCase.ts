import { ResponseOrderCancellationDTO } from "@/modules/users/application/dtos/orderCancellation/respondeOrderCancellationDTO";
import { ValidationCancellationError } from "@/modules/users/domain/exceptions/cancellationOrder/validationCancellation";
import { CompanyNotFoundError } from "@/modules/users/domain/exceptions/Company/CompanyNotFoundError";
import { ICompanyQueryRepository } from "@/modules/users/domain/repositories/company/ICompanyQueryrepository";
import { IorderCancellatioQueryRepository } from "@/modules/users/domain/repositories/orderCancellation/IorderCancellatioQueryRepository";

export class getByIdOrdercancellationUseCase {
  constructor(
    private readonly iorderCancellationQueryRepository: IorderCancellatioQueryRepository,
    private readonly icompanyQueryRepository: ICompanyQueryRepository,
  ) {}
  async execute(order_id: string, company_id: string): Promise<ResponseOrderCancellationDTO> {
    const company = await this.icompanyQueryRepository.findById(company_id);
    if (!company) {
      throw new CompanyNotFoundError();
    }
    const order = await this.iorderCancellationQueryRepository.findById(order_id, company_id);
    if (!order) {
      throw new ValidationCancellationError(`orden no encontrada`);
    }
    return order;
  }
}
