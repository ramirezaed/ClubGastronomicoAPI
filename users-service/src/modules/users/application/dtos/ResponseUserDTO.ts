export interface ResponseUserDTO {
  id?: string;
  // company_id?: string | null;
  // branch_id?: string | null;
  company?: { id: string; name: string } | null; // Objeto con info del microservicio
  branch?: { id: string; name: string } | null;
  name: string;
  lastname: string;
  email: string;
  role_id: string;
  is_active: boolean;
}
