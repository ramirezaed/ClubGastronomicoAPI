import UserModel from "@/modules/users/infrastructure/persistence/user/UserModel";
import { IUserRepository } from "@/modules/users/domain/repositories/user/IUserRepository";
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
      doc.password,
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
  async save(user: User): Promise<User | null> {
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

    if (!doc) return null;
    const saved = await doc.save();
    return this.toEntity(saved); //
  }
  async update(user: User): Promise<User | null> {
    const doc = await UserModel.findOneAndUpdate(
      {
        _id: user.id,
        delete_at: null,
      },
      {
        $set: {
          name: user.name, // para el update
          lastname: user.lastname, // para el update
          is_active: user.is_active, // para activate/deactivate
          role_id: user.role_id, //para cambiar el rol
          deleted_at: user.deleted_at, // para la eliminacion logica
        },
      },
      { returnDocument: "after" }, //antes era {new:true}
    ).select("-password");
    if (!doc) return null;
    return this.toEntity(doc);
  }
  async delete(id: string): Promise<void> {
    const doc = await UserModel.findOneAndUpdate({ _id: id, delete_at: null }, { $set: { deleted_at: new Date() } });
    return;
  }
}
