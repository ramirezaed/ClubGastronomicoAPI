//clase con error perzonalizado cuando un email ya se encuentra duplicado
export class DuplicateEmailError extends Error {
  constructor(email: string) {
    //super es la palabra clave para llamar al constructor de la clase padre
    super(`el correo ${email} ya esta registrado`);
    this.name = "DuplicateEmailError";
  }
}
