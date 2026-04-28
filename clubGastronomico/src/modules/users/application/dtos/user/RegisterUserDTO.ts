//DTO utilizado para el registro de usuarios
// representa los datos que recibe el caso de uso RegisterUser

export interface IRegisterUserDTO {
  company_id?: string | null;
  branch_id?: string | null;
  name: string;
  lastname: string;
  email: string;
  password: string;
  role_id: string;
  role_name: string;
}
