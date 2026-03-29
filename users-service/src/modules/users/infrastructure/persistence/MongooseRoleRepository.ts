import { IRoleRepository } from "@/modules/users/domain/repositories/role/IRoleRepository";
import { Role } from "@/modules/users/domain/entities/Role";
import RoleModel from "@/modules/users/infrastructure/persistence/RoleModel";

export class MongooseRoleRepository implements IRoleRepository {
  async findByName(name: string): Promise<Role | null> {
    const doc = await RoleModel.findOne({ name });
    if (!doc) return null;
    //mapeo : documento de mongo a endtidad del dominio
    return new Role(
      doc._id.toString(),
      doc.name,
      doc.permissions,
      doc.description,
      doc.is_active,
      doc.deleted_at,
    );
  }
  //mapeo: entidad de dominio a documento mongo
  async save(role: Role): Promise<Role> {
    const doc = new RoleModel({
      name: role.name,
      permissions: role.permissions,
      description: role.description,
      is_active: role.is_active,
      deleted_at: role.deleted_at,
    });
    const guardar = await doc.save();

    //mapeo documento de mongo a entidad de dominio
    return new Role(
      guardar._id.toString(),
      guardar.name,
      guardar.permissions,
      guardar.description,
      guardar.is_active,
      guardar.deleted_at,
    );
  }
}
