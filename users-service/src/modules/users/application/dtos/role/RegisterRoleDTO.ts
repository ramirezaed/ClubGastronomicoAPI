// interface para registrar un nuevo rol, representa los datos que recibe el caso de uso RegistrarRole
export interface IRegisterRoleDTO {
  name: string;
  permissions: string[];
  description: string;
  is_active: boolean;
}
