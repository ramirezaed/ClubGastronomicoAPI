export interface ILoginResponseDTO {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    company_id: string | null;
    branch_id: string | null;
    name: string;
    email: string;
    role_id: string;
  };
}
