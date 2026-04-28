import { IRoleRepository } from "@/modules/users/domain/repositories/role/IRoleRepository";
import { Role } from "@/modules/users/domain/entities/Role";
import RoleModel from "@/modules/users/infrastructure/persistence/role/RoleModel";

export class MongooseRoleRepository implements IRoleRepository {
  //toEntity m:etodo privado que convierte un documento de Mongoose a una entidad de dominio.
  private toEntity(doc: any): Role {
    return new Role(doc._id.toString(), doc.name, doc.description, doc.is_active, doc.deleted_at);
  }
  async save(role: Role): Promise<Role> {
    const doc = new RoleModel({
      name: role.name,
      description: role.description,
      is_active: role.is_active,
      deleted_at: role.deleted_at,
    });
    const saved = await doc.save();
    return this.toEntity(saved);
  }
  async findById(id: string): Promise<Role | null> {
    const doc = await RoleModel.findOne({ _id: id, deleted_at: null });
    if (!doc) return null;
    return this.toEntity(doc);
  }
  async update(role: Role): Promise<Role> {
    const doc = await RoleModel.findByIdAndUpdate(
      {
        _id: role.id,
        deleted_at: null, //no actualizar roles eliminados
      },
      {
        $set: {
          description: role.description,
          is_active: role.is_active, //para los endpoint activate/deactivate
        },
      },
      { new: true },
    );
    return this.toEntity(doc);
  }
  async delete(id: string): Promise<void> {
    const doc = await RoleModel.findOneAndUpdate(
      { _id: id, deleted_at: null },
      {
        $set: {
          deleted_at: new Date(),
        },
      },
    );
    return;
  }
}
