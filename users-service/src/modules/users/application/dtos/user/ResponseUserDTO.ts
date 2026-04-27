export interface ResponseUserDTO {
  id: string;
  company_id: string | null;
  branch_id: string | null;
  name: string;
  lastname: string;
  email: string;
  role_id: string;
  role_name: string;
  is_active: boolean;
}
