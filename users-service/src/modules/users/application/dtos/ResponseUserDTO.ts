export interface ResponseUserDTO {
  company_id?: string | null;
  branch_id?: string | null;
  name: string;
  lastname: string;
  email: string;
  role_id: string;
  is_active: boolean;
}
