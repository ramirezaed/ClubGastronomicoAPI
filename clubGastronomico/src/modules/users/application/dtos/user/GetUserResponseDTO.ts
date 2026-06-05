export interface GetUserResponseDTO {
  id: string;
  name: string;
  lastname: string;
  email: string;
  is_active: boolean;
  role: {
    id: string;
    name: string;
  };
  company: {
    id: string;
    name: string;
  } | null;
  branch: {
    id: string;
    name: string;
  } | null;
}
