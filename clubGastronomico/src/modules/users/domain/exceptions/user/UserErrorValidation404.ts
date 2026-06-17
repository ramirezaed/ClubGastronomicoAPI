export class userErrorValidation404 extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = "userErrorValidation404";
  }
}
