import { ResponseMenuDTO } from "@/modules/users/application/dtos/MenuItems/ResponseMenuDTO";

export interface IMenuQueryRepository {
  findByName(category_id: string, company_id: string, name: string): Promise<ResponseMenuDTO | null>;
}
