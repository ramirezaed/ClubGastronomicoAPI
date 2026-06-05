export interface IJwtPayloadDTO {
  id: string;
  email: string;
  role_id: string;
  role_name: string; // nombre del rol
  company_id: string | null;
  branch_id: string | null;
}
