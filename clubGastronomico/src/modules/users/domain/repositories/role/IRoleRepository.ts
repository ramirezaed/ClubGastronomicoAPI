//PUERTOS (interfaces)

// es una interfaz que define los metodos que se puede hacer con roles
// lo que el sistema puede hacer con los roles
// create, save, find etc

import { Role } from "@/modules/users/domain/entities/Role";

export interface IRoleRepository {
  findById(id: string): Promise<Role | null>;
  save(role: Role): Promise<Role>;
  update(role: Role): Promise<Role>;
  delete(id: string): Promise<void>;
}
