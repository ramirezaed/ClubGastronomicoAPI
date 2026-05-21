import { RegisterCategoryError } from "@/modules/users/domain/exceptions/category/registerCategoryError";

export class Category {
  constructor(
    public readonly id: string,
    public name: string,
    public is_active: boolean,
    public deleted_at: Date | null,
  ) {}

  static create(name: string): Category {
    if (!name) {
      throw new RegisterCategoryError();
    }
    return new Category("", name, true, null); // is_active true por default, deleted_at null por defecto
  }
}
