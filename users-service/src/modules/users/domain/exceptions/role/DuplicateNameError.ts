//clase con error perzonalizado para evitar el duplicado de roles
export class DuplicateNameError extends Error {
  constructor(name: string) {
    super(`Ya existe un rol llamado "${name}". Probá con otro nombre.`);
    this.name = "DuplicateNameError";
  }
}
