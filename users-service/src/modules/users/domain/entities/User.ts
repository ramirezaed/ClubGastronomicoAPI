//es una clase, defino que es un usuario (id, nombre apellido email etc etc)
//se puede validar la logica  , como por ejemplo user.isValidEmail() que cumpla con nombre@nombre.com

export class User {
  constructor(
    public readonly id: string,
    public company_id: string | null,
    public branch_id: string | null,
    public name: string,
    public lastname: string,
    public email: string,
    public password: string,
    public role_id: string | null,
    public is_active: boolean,
    public deleted_at: Date | null,
  ) {}
}
