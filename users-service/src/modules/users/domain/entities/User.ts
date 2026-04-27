//es una clase, defino que es un usuario (id, nombre apellido email etc etc)
//se puede validar la logica  , como por ejemplo user.isValidEmail() que cumpla con nombre@nombre.com

import { InactiveUserError } from "@/modules/users/domain/exceptions/user/InactiveUser";
import { InvalidCreedentialError } from "@/modules/users/domain/exceptions/user/InvalidCreedentialError";
import { RegisterUserError } from "@/modules/users/domain/exceptions/user/RegisterUserError";
import { UserAlreadyActiveError } from "@/modules/users/domain/exceptions/user/UserAlreadyActiveError";
import { UserAlreadyDeactiveError } from "@/modules/users/domain/exceptions/user/UserAlreadyDeactiveError";
import { UserInactiveError } from "@/modules/users/domain/exceptions/user/UserInactiveError";

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
    public role_id: string,
    public is_active: boolean,
    public deleted_at: Date | null,
  ) {}

  static create(
    name: string,
    lastname: string,
    email: string,
    hashedPassword: string, // ya viene hasheado del caso de uso
    role_id: string,
    company_id: string | null,
    branch_id: string | null,
  ): User {
    if (!name || !lastname || !email || !hashedPassword || !role_id) {
      throw new RegisterUserError();
    }
    return new User("", company_id, branch_id, name, lastname, email, hashedPassword, role_id, false, null);
  }
  verifyIsActive(): void {
    if (!this.is_active) {
      throw new InactiveUserError();
    }
  }
  update(name: string, lastname: string): void {
    if (!this.is_active) {
      throw new UserInactiveError();
    }
    this.name = name ?? this.name;
    this.lastname = lastname ?? this.lastname;
  }
  activate(): void {
    if (this.is_active) {
      throw new UserAlreadyActiveError();
    }
    this.is_active = true;
  }
  deactivate(): void {
    if (!this.is_active) {
      throw new UserAlreadyDeactiveError();
    }
    this.is_active = false;
  }
  delete(): void {
    if (!this.deleted_at) {
      //si no es null, ya fue eliminado
      throw new Error("usuario ya fue eliminado");
    }
    this.deleted_at = new Date();
    this.is_active = false;
  }
  updateRole(idRole: string): void {
    if (!this.is_active) {
      throw new UserInactiveError();
    }
    if (!idRole) {
      throw new Error("todos los campos son necesrio");
    }
    this.role_id = idRole;
  }
  resetPassword(hashedPassword: string): void {
    if (!hashedPassword) throw new RegisterUserError();
    this.password = hashedPassword;
  }
  verifyPassword(isMatch: boolean): void {
    if (!isMatch) {
      throw new InvalidCreedentialError();
    }
  }
}
