export class RoleInactiveError extends Error {
  constructor() {
    super("No podés usar este rol porque está desactivado.");
    this.name = "RoleInactiveError";
  }
}
