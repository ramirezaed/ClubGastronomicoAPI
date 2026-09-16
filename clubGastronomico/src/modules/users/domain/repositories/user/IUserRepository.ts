import { User } from "@domain/entities/User";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<User>;
  update(user: User): Promise<User | null>; // sirve para update, activate, deactivate, updateRol
  delete(id: string): Promise<void>;
  existsByRoleId(roleId: string): Promise<boolean>; //verificar que el rol no este asignado a un usuario
}
