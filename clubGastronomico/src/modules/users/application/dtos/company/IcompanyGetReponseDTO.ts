export interface ICompanyGetResponseDTO {
  id: string;
  subscription_plan: {
    id: string;
    name: string;
  };
  // owner_id: string;
  owner: {
    id: string;
    email: string;
  };
  name: string;
  phone: string;
  is_active: boolean;
}
