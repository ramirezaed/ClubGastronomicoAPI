export class Role {
  constructor(
    public readonly id: string,
    public name: string,
    public permissions: string[],
    public description: string,
    public is_active: boolean,
    public deleted_at: Date | null,
  ) {}
}
