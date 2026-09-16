import { Company } from "@/modules/users/domain/entities/Company";

export interface ICompanyRepository {
  save(company: Company): Promise<Company>;
  findByOwnerId(ownerID: string): Promise<Company | null>; //verifica si ya tiene compañias registradas
  findById(id: string): Promise<Company | null>;
  update(company: Company): Promise<Company | null>;

  existsBySubscriptionPlanId(planId: string): Promise<boolean>; //verifica el plan que tiene asignado
}
