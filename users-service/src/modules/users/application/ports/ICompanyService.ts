//los puertos son interfaces que definen como el dominio / aplicacion se comunica con el mundo exterior.
//son contratos.
export interface ICompanyBranchService {
  getCompanyById(id: string): Promise<{ id: string; name: string } | null>;
  getBranchById(id: string): Promise<{ id: string; name: string } | null>;
}
