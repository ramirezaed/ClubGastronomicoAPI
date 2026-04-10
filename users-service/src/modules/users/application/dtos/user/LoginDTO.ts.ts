// es una interface, define los datos que se esperan del cleinte
// por ejemplo en este caso para hacer login se espera el correo y el password

export interface ILoginDTO {
  email: string;
  password: string;
}
