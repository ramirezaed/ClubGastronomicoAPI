export class MenuItemsNotFoundError extends Error {
  constructor() {
    super(`Items no encotrado`);
    this.name = "MenuItemsNotFoundError";
  }
}
