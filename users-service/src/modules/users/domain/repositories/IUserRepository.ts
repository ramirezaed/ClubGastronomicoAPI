//  Es una interface, define los metodos como save(user), o findByEmail(email)
//  no tiene codigo, solo dice lo que se puede hacer
//  se puede hacer un findByEmail(email),   findById(id), save, update, etc

import { User } from "@domain/entities/User";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findAll(filter?: { is_active?: boolean }): Promise<User[]>;
  save(user: User): Promise<User>;
  update(user: User): Promise<User>;
  activateDesactivte(id: string, is_active: boolean): Promise<User | null>;
  me(id: string): Promise<User | null>;
}
