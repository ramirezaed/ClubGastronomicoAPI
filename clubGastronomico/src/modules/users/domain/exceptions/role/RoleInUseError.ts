export class RoleInUseError extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = "RoleInUseError";
  }
}
