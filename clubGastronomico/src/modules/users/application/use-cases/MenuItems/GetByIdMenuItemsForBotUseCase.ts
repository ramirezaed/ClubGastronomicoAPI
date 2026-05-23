import { ResponseMenuDTO } from "@/modules/users/application/dtos/MenuItems/ResponseMenuDTO";
import { MenuItemsNotFoundError } from "@/modules/users/domain/exceptions/MenuItems/MenuItemsNotFoundError";
import { IMenuQueryRepository } from "@/modules/users/domain/repositories/MenuItems/IMenuQueryRepository";

export class getAllForBotUseCase {
  constructor(private readonly imenuQuery: IMenuQueryRepository) {}
  async execute(company_id: string): Promise<ResponseMenuDTO[]> {
    const items = await this.imenuQuery.getAllForBot(company_id);
    if (!items) {
      throw new MenuItemsNotFoundError();
    }
    return items;
  }
}
