import { ICompanyRepository } from "@/modules/users/domain/repositories/company/ICompanyRepository";
import { IRegisterCompanyDTO } from "@/modules/users/application/dtos/company/registerCompanyDTO";
import { IResponseCompanyDTO } from "@/modules/users/application/dtos/company/IresponseCompanyDTO";
import { Company } from "@/modules/users/domain/entities/Company";
import { CompanyAlreadyExistsError } from "@/modules/users/domain/exceptions/Company/CompanyAlreadyExistsError";
import { SubscriptionPlanNotFoundError } from "@/modules/users/domain/exceptions/subscription/SubscriptionPlanNotFoundError";
import { subscriptionQueryRepository } from "@/modules/users/infrastructure/persistence/subscription/subscriptionQueryRepository";
import { IUserRepository } from "@/modules/users/domain/repositories/user/IUserRepository";
import { UserNotExistError } from "@/modules/users/domain/exceptions/user/UserNotExistsError";

export class RegisterCompanyUseCase {
  constructor(
    private readonly icompanyRepository: ICompanyRepository,
    private readonly isubscriptionRepository: subscriptionQueryRepository,
    private readonly iuserRepository: IUserRepository,
  ) {}

  async execute(owner_id: string, dto: IRegisterCompanyDTO): Promise<IResponseCompanyDTO> {
    const user = await this.iuserRepository.findById(owner_id);
    if (!user) {
      throw new UserNotExistError();
    }
    //el owner solo puede tener una compañia
    const existing = await this.icompanyRepository.findByOwnerId(owner_id);
    if (existing) {
      throw new CompanyAlreadyExistsError();
    }
    //plan free por defecto al crear
    const freePlan = await this.isubscriptionRepository.findByName("Free");
    if (!freePlan) {
      throw new SubscriptionPlanNotFoundError();
    }

    const company = Company.create(owner_id, freePlan.id, dto.name, dto.phone);

    const saved = await this.icompanyRepository.save(company);

    user.assingCompany(saved.id);
    await this.iuserRepository.update(user);

    return {
      id: saved.id,
      owner_id: saved.owner_id,
      subscription_plan: freePlan.name,
      name: saved.name,
      phone: saved.phone,
      is_active: saved.is_active,
    };
  }
}
