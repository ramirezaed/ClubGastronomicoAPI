import bcrypt from "bcrypt";
import { IPasswordHash } from "@/modules/users/domain/ports/IpasswordHash";
export class PasswordHasher implements IPasswordHash {
  private readonly saltRounds = 10;

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
