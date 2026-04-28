//esta interface es un puerto

export interface IPasswordHash {
  hash(password: string): Promise<string>;
  compare(plain: string, hashed: string): Promise<boolean>;
}
