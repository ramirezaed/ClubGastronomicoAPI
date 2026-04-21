//clase con error perzonalizado para evitar el duplicado de roles
export class DuplicateNameError extends Error {
  constructor(name: string) {
    super(`El rol ${name} ya se encuentra registrado`);
    this.name = "DuplicateNameError";
  }
}
