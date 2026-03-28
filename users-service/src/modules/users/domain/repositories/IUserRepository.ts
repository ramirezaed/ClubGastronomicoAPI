//  Es una interface, define los metodos como save(user), o findByEmail(email)
//  no tiene codigo, solo dice lo que se puede hacer
//  se puede hacer un findByEmail(email),   findById(id), save, update, etc

import { User } from "@domain/entities/User";

export interface IUserRepository {
  //findByEmail: se utiliza principalmente para que no hayan email duplicados
  findByEmail(email: string): Promise<User | null>;
  //save : se utiliza para guardar un usuario en el sistema
  save(user: User): Promise<User>;
}
