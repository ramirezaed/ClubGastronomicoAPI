import { RoleResponseDto } from "@/modules/users/application/dtos/role/RoleResponseDTO";
import RoleModel from "@/modules/users/infrastructure/persistence/role/RoleModel";

export class MongooseRoleQueryRepository {
  private toDTO(doc: any): RoleResponseDto {
    return {
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      is_active: doc.is_active,
    };
  }
  async findById(id: string): Promise<RoleResponseDto | null> {
    const doc = await RoleModel.findOne({ _id: id, deleted_at: null });
    if (!doc) return null;
    return this.toDTO(doc);
  }

  async findByName(name: string): Promise<RoleResponseDto | null> {
    const doc = await RoleModel.findOne({ name, deleted_at: null });
    if (!doc) return null; //si no existe retorna null
    return this.toDTO(doc); // si esxiste retorna el documento
  }

  async findAll(): Promise<RoleResponseDto[] | null> {
    const doc = await RoleModel.find({ deleted_at: null });
    // Mongo devuelve Document[] , el dominio necesita Role[]
    // se aplica el mapper toEntity() a cada documento.
    if (!doc) return null;
    return doc.map((doc) => this.toDTO(doc));
  }
}
