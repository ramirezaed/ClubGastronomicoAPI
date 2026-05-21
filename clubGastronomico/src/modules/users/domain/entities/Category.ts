export class Category {
  constructor(
    public readonly id: string,
    public name: string,
    public is_active: boolean,
    public deleted_at: Date | null,
  ) {}
}
