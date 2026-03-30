export class RoleNotExistsError extends Error {
  constructor(id: string) {
    super(`el rol id : ${id} , no se encuentra registrado`);
    this.name = "RoleNotExistsError";
  }
}
