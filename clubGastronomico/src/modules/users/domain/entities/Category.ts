import { categoryAlreadyActiveError } from "@/modules/users/domain/exceptions/category/categoryAlreadyActive";
import { categoryAlreadyInactiveError } from "@/modules/users/domain/exceptions/category/categoryAlreadyInactive";
import { categoryDuplicateNameError } from "@/modules/users/domain/exceptions/category/categoryDuplicateNameError";
import { categoryNotFound } from "@/modules/users/domain/exceptions/category/categoryNotFound";
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
  activate(): void {
    if (this.is_active) {
      throw new categoryAlreadyActiveError();
    }
    this.is_active = true;
  }
  deactivate(): void {
    if (!this.is_active) {
      throw new categoryAlreadyInactiveError();
    }
    this.is_active = false;
  }
  softdelete(): void {
    if (this.deleted_at) {
      throw new categoryNotFound();
    }
    this.deleted_at = new Date();
    this.is_active = false;
  }
}
