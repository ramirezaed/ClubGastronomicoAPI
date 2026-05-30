import { InactiveMenuItems } from "@/modules/users/domain/exceptions/MenuItems/InactiveMenuError";
import { itemValidationError } from "@/modules/users/domain/exceptions/MenuItems/itemValidationError";
import { MenuAlreadyActivateError } from "@/modules/users/domain/exceptions/MenuItems/MenuAlreadyActiveError";
import { MenuAlreadyDeactivateError } from "@/modules/users/domain/exceptions/MenuItems/MenuAlreadyDeactivateError";
import { MenuItemsNotFoundError } from "@/modules/users/domain/exceptions/MenuItems/MenuItemsNotFoundError";

export class MenuItems {
  constructor(
    public readonly id: string,
    public category_id: string,
    public company_id: string,
    public name: string,
    public description: string,
    public price: number,
    public preparation_time_minutes: number,
    public stock: number,
    public image_url: string | null,
    public is_active: boolean,
    public deleted_at: Date | null,
  ) {}

  static create(
    category_id: string,
    company_id: string,
    name: string,
    description: string,
    price: number,
    preparation_time_minutes: number,
    stock: number,

    image_url: string | null,
  ): MenuItems {
    if (!category_id || !company_id || !name || !description || !price || stock) {
      throw new itemValidationError(`Todos los campos son necesarios`);
    }
    //al registrar un producot debe ser mayo a 0
    if (stock <= 0) {
      throw new itemValidationError(`el stock debe ser mayor`);
    }

    return new MenuItems(
      "",
      category_id,
      company_id,
      name,
      description,
      price,
      preparation_time_minutes,
      stock,
      image_url,
      true,
      null,
    );
  }

  update(name: string, description: string, price: number, preparation_time_minutes: number, stock: number): void {
    if (!this.is_active) {
      throw new InactiveMenuItems();
    }
    if (stock <= 0) {
      throw new itemValidationError(`el stock debe ser mayor a 0`);
    }
    this.name = name ?? this.name;
    this.description = description ?? this.description;
    this.price = price ?? this.price;
    this.preparation_time_minutes = preparation_time_minutes ?? this.preparation_time_minutes;
    this.stock = stock ?? this.stock;
  }
  activate(): void {
    if (this.is_active) {
      throw new MenuAlreadyActivateError();
    }
    this.is_active = true;
  }
  deactivate(): void {
    if (!this.is_active) {
      throw new MenuAlreadyDeactivateError();
    }
    this.is_active = false;
  }

  softDelete(): void {
    if (this.deleted_at) {
      throw new MenuItemsNotFoundError();
    }
    this.deleted_at = new Date();
    this.is_active = false;
  }

  decreaseStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error("La cantidad debe ser mayor a 0");
    }
    if (this.stock < quantity) {
      throw new Error("Stock insuficiente");
    }
    this.stock -= quantity;
  }

  increaseStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error("La cantidad debe ser mayor a 0");
    }
    this.stock += quantity;
  }
}
