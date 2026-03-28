//es una clase, defino que es un usuario (id, nombre apellido email etc etc)
//se puede validar la logica  , como por ejemplo user.isValidEmail() que cumpla con nombre@nombre.com

//entidad de dominio User
//representa a un usuario dentro del sistema
//es independiente a la bd y la infraestructura

export class User {
  constructor(
    //readonly: el dato solo se define al crear el objeto y no se puede cambiar
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
