// //ADAPTER
// import { ICompanyBranchService } from "@/modules/users/application/ports/ICompanyService";

// export class HttpCompanyBranchService implements ICompanyBranchService {
//   private readonly url = process.env.COMPANY_SERVICE_URL ?? "";

//   async getCompanyById(id: string): Promise<{ id: string; name: string } | null> {
//     const controller = new AbortController();
//     const timeout = setTimeout(() => controller.abort(), 3000); // 3s timeout

//     try {
//       const response = await fetch(`${this.url}/companies/${id}`, {
//         signal: controller.signal,
//       });
//       if (!response.ok) return null;
//       const data = (await response.json()) as { id: string; name: string };
//       // Validacion minima del contrato externo
//       if (!data?.id || !data?.name) {
//         return null;
//       }
//       return data;
//     } catch {
//       return null; // si el microservicio no esta disponible, no rompe el endpoint
//     } finally {
//       clearTimeout(timeout); //si el microsevicio no response en 3 segundos se aborta la peticion
//     }
//   }

//   async getBranchById(id: string): Promise<{ id: string; name: string } | null> {
//     const controller = new AbortController();
//     const timeout = setTimeout(() => controller.abort(), 3000); // 3s timeout

//     try {
//       const response = await fetch(`${this.url}/branches/${id}`, {
//         signal: controller.signal,
//       });
//       if (!response.ok) return null;
//       const data = (await response.json()) as { id: string; name: string };
//       // Validacion minima del contrato externo
//       if (!data?.id || !data?.name) {
//         return null;
//       }
//       return data;
//     } catch {
//       return null; // si el microservicio no esta disponible, no rompe el endpoint
//     } finally {
//       clearTimeout(timeout); //si el microsevicio no response en 3 segundos se aborta la peticion
//     }
//   }
// }
