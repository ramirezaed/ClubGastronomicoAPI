export interface IRegisterUserDTO {
  company_id?: string | null;
  branch_id?: string | null;
  name: string;
  lastname: string;
  email: string;
  password: string;
  role_id: string;
}
