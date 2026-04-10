export interface GetUserResponseDTO {
  company_id?: string | null;
  branch_id?: string | null;
  id: string;
  name: string;
  lastname: string;
  email: string;
  is_active: boolean;

  role: {
    id: string;
    name: string;
  } | null;
  company: {
    id: string;
    name: string;
  } | null;
  branch: {
    id: string;
    name: string;
  } | null;
}
