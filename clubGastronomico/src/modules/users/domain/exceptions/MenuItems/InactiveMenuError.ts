export class InactiveMenuItems extends Error {
  constructor() {
    super(`El items se encuentra desactivcado`);
    this.name = "InactiveMenuItemsError";
  }
}
