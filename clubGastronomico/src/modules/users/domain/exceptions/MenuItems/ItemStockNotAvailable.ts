export class ItemStockNotAvailable extends Error {
  constructor(name: string) {
    super(`${name} no cuenta con  suficiente stock `);
    this.name = "ItemStockNotAvailable";
  }
}
