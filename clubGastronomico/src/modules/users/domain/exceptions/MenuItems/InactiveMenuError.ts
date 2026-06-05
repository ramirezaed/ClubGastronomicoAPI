export class InactiveMenuItems extends Error {
  constructor() {
    super(`El items se encuentra desactivado`);
    this.name = "InactiveMenuItemsError";
  }
}
