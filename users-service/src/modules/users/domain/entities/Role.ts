export class Role {
  constructor(
    public readonly id: string,
    public name: string,
    public permissions: string[],
    public description: string,
    public is_active: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
