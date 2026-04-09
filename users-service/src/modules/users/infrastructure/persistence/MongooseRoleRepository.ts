import { IRoleRepository } from "@/modules/users/domain/repositories/role/IRoleRepository";
import { Role } from "@/modules/users/domain/entities/Role";
import RoleModel from "@/modules/users/infrastructure/persistence/RoleModel";

export class MongooseRoleRepository implements IRoleRepository {
  //toEntity m:etodo privado que convierte un documento de Mongoose a una entidad de dominio.
  private toEntity(doc: any): Role {
    return new Role(doc._id.toString(), doc.name, doc.permissions, doc.description, doc.is_active, doc.deleted_at);
  }

  async findByName(name: string): Promise<Role | null> {
    const doc = await RoleModel.findOne({ name, deleted_at: null });
    if (!doc) return null; //si no existe retorna null
    return this.toEntity(doc); // si esxiste retorna el documento
  }
  async save(role: Role): Promise<Role> {
    const doc = new RoleModel({
      name: role.name,
      permissions: role.permissions,
      description: role.description,
      is_active: role.is_active,
      deleted_at: role.deleted_at,
    });
    const guardar = await doc.save();
    return this.toEntity(guardar);
  }
  async findById(id: string): Promise<Role | null> {
    const doc = await RoleModel.findOne({ _id: id, deleted_at: null });
    if (!doc) return null;
    return this.toEntity(doc);
  }
  async findAll(): Promise<Role[] | null> {
    const doc = await RoleModel.find({ deleted_at: null });
    // Mongo devuelve Document[] , el dominio necesita Role[]
    // se aplica el mapper toEntity() a cada documento.
    if (!doc) return null;
    return doc.map((doc) => this.toEntity(doc));
  }
  async update(role: Role): Promise<Role> {
    const doc = await RoleModel.findByIdAndUpdate(
      {
        _id: role.id,
        deleted_at: null, //no actualizar roles eliminados
      },
      {
        $set: {
          name: role.name,
          permissions: role.permissions,
          description: role.description,
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
