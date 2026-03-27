//error perzonalizado cuando se regitra un usuario
export class RegisterUserError extends Error {
  constructor() {
    //super es la palabra clave para llamar al constructor de la clase padre
    super(`No se pudo completar el registro de usuario`);
    this.name = "RegisterUserError";
  }
}
