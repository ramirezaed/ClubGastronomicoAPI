export class N8nServiceInactiveError extends Error {
  constructor() {
    super(
      `El servicio de restablecimiento de contraseña no está disponible en este momento. Por favor, inténtalo de nuevo más tarde.`,
    );
    this.name = "N8nServiceInactiveError";
  }
}
