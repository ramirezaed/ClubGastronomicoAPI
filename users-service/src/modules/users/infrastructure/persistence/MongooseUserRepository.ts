//traduce los documentos de MongoDB a entidades de dominio
//y de Entidades de dominio a MongoDB

import UserModel from "@infra/persistence/UserModel";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { User } from "@domain/entities/User";

export class MongooseUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email });
    if (!doc) return null;

    // Mapeo: Documento Mongo → Entidad de Dominio
    return new User(
      doc._id.toString(),
      doc.company_id?.toString() ?? null,
      doc.branch_id?.toString() ?? null,
      doc.name,
      doc.lastname,
      doc.email,
      doc.password,
      doc.role_id,
      doc.is_active,
      doc.deleted_at,
    );
  }
  // Mapeo: Entidad de Dominio → Documento Mongo
  async save(user: User): Promise<User> {
    const doc = new UserModel({
      company_id: user.company_id,
      branch_id: user.branch_id,
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      password: user.password,
      role_id: user.role_id,
      is_active: user.is_active,
      deleted_at: user.deleted_at,
    });
    //Se Guarda en MongoDB
    const saved = await doc.save();

    // Mapeo: Documento Mongo → Entidad de Dominio
    return new User(
      saved._id.toString(),
      saved.company_id,
      saved.branch_id,
      saved.name,
      saved.lastname,
      saved.email,
      saved.password,
      saved.role_id,
      saved.is_active,
      saved.deleted_at,
    );
  }
}
