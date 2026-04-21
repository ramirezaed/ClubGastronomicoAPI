export class RoleInactiveError extends Error {
  constructor() {
    super(`El rol se encuntra desactivado`);
    this.name = "RoleInactiveError";
  }
}
