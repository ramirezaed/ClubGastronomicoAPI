import UserModel from "@infra/persistence/UserModel";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { User } from "@domain/entities/User";

export class MongooseUserRepository implements IUserRepository {
  private toEntity(doc: any): User {
    return new User(
      doc._id.toString(),
      doc.company_id?.toString() ?? null,
      doc.branch_id?.toString() ?? null,
      doc.name,
      doc.lastname,
      doc.email,
      doc.role_id.toString(),
      doc.role_id,
      doc.is_active,
      doc.deleted_at,
    );
  }
  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email });
    if (!doc) return null;
    return this.toEntity(doc); //
  }
  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findOne({ _id: id, delete_at: null });
    if (!doc) return null;
    return this.toEntity(doc);
  }
  async findAll(filter?: { is_active?: boolean }): Promise<User[]> {
    //unknown: de cualquier tipo, pero no puede ser usado sin comprobarlo antes
    const query: Record<string, unknown> = { deleted_at: null };
    if (filter?.is_active !== undefined) {
      query.is_active = filter.is_active;
    }
    //lean devuelve objetos JS simples, no documentos de mongoose, es mas rapido y liviano
    const doc = await UserModel.find(query).populate("role_id", "name").lean();
    return doc.map((doc) => this.toEntity(doc));
  }
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

    const saved = await doc.save();

    return this.toEntity(saved); //
  }
  async update(user: User): Promise<User> {
    const doc = await UserModel.findByIdAndUpdate(
      {
        _id: user.id,
        delete_at: null,
        is_Active: user.is_active,
      },
      {
        $set: {
          name: user.name,
          lastname: user.lastname,
        },
      },
      { returnDocument: "after" }, // Esta es la nueva forma
    ).select("-password"); // para que no envie el password
    return this.toEntity(doc);
  }
  async activateDesactivte(id: string, is_Active: boolean): Promise<User | null> {
    const doc = await UserModel.findOneAndUpdate(
      { _id: id, delete_at: null }, //filtro, busca por id, y que no este eliminado
      { $set: { is_active: is_Active } }, // el dato que se va a cambiar
      { returnDocument: "after" }, // Esta es la nueva forma //devuelve el nuevo documento, el actualizado
    ).select("-password"); // para que no envie el password
    if (!doc) {
      //si no se encuentra el documneto devuelve null
      return null;
    }
    return this.toEntity(doc);
  }
}
