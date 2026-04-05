import UserModel from "@infra/persistence/UserModel";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { User } from "@domain/entities/User";

export class MongooseUserRepository implements IUserRepository {
  private toEntity(doc: any): User {
    return new User(
      doc._id.toString(), // ✅ Faltaban los ()
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

  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email });
    if (!doc) return null;
    return this.toEntity(doc); // ✅ Usando toEntity
  }
  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findById({ _id: id, delete_at: null });
    if (!doc) return null;
    return this.toEntity(doc);
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

    return this.toEntity(saved); // ✅ Usando toEntity
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
      { new: true },
    );
    return this.toEntity(doc);
  }
}
