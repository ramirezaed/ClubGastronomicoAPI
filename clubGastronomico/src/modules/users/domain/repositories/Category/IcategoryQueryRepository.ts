import { categoryResponseDTO } from "@/modules/users/application/dtos/category/categoryResponseDTO";

export interface IcategoryQueryRepository {
  findByName(name: string): Promise<categoryResponseDTO | null>;
}
