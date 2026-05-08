import { ActivateCompanyUseCase } from "@/modules/users/application/use-cases/company/activateCompanyUseCase";
import { changePlanCompanyUseCase } from "@/modules/users/application/use-cases/company/changePlanCompanyUseCase";
import { DeactivateCompanyUseCase } from "@/modules/users/application/use-cases/company/deactivateCompanyUseCase";
import { findByIdCompanyUseCase } from "@/modules/users/application/use-cases/company/findByIdCompanyUseCase";
import { GetAllCompanyUseCase } from "@/modules/users/application/use-cases/company/getAllCompanyUseCase";
import { meCompanyUseCase } from "@/modules/users/application/use-cases/company/meCompanyUseCase";
import { RegisterCompanyUseCase } from "@/modules/users/application/use-cases/company/registerCompanyUseCase";
import { SoftDeleteCompanyUseCase } from "@/modules/users/application/use-cases/company/softDeleteCompanyUseCase";
import { UpdateCompanyUseCase } from "@/modules/users/application/use-cases/company/updateCompanyUseCase";
import { CompanyController } from "@/modules/users/infrastructure/controllers/companyController";
import { CompanyQueryRepository } from "@/modules/users/infrastructure/persistence/company/CompanyQueryRepository";
import { CompanyRepository } from "@/modules/users/infrastructure/persistence/company/CompanyRepository";
import { subscriptionQueryRepository } from "@/modules/users/infrastructure/persistence/subscription/subscriptionQueryRepository";
import { MongooseUserRepository } from "@/modules/users/infrastructure/persistence/user/MongooseUserRepository";
import { authMiddleware } from "@/shared/infraestructure/http/middleware/auth.middleware";
import { authorizeRoles } from "@/shared/infraestructure/http/middleware/authorize.middleware";
import { Router } from "express";

const CompanyRouter = Router();
//inyeccion de dependencias
// capa de Infraestructura (Adaptadores de salida)
//Instancia del repositorio basada en Mongoose */
const companyRepository = new CompanyRepository();
const companyQueryRepository = new CompanyQueryRepository();
const subscription = new subscriptionQueryRepository();
const userRepository = new MongooseUserRepository();

//capa de aplicacion (Casos de Uso)
//aca se define que hace
const registercompanyUseCase = new RegisterCompanyUseCase(companyRepository, subscription, userRepository);
const getAllCompanyUseCase = new GetAllCompanyUseCase(companyQueryRepository);
const findByIdCompany = new findByIdCompanyUseCase(companyQueryRepository);
const meCompany = new meCompanyUseCase(companyQueryRepository);
const updateCompany = new UpdateCompanyUseCase(companyRepository);
const softdeleteCompany = new SoftDeleteCompanyUseCase(companyRepository);
const activate = new ActivateCompanyUseCase(companyRepository);
const deactivate = new DeactivateCompanyUseCase(companyRepository);
const changePlan = new changePlanCompanyUseCase(companyRepository, subscription);
//capa de interfaz
//se inyectan las dependencias
const companyController = new CompanyController(
  registercompanyUseCase,
  getAllCompanyUseCase,
  findByIdCompany,
  meCompany,
  updateCompany,
  softdeleteCompany,
  activate,
  deactivate,
  changePlan,
);

CompanyRouter.post("/", authMiddleware, authorizeRoles("owner"), (req, res) => companyController.register(req, res));
CompanyRouter.get("/", authMiddleware, authorizeRoles("SuperAdmin"), (req, res) => companyController.getAll(req, res));
CompanyRouter.get("/me", authMiddleware, (req, res) => companyController.MeCompany(req, res));
CompanyRouter.get("/:id", authMiddleware, authorizeRoles("SuperAdmin"), (req, res) =>
  companyController.findById(req, res),
);
CompanyRouter.patch("/update", authMiddleware, authorizeRoles("owner"), (req, res) =>
  companyController.update(req, res),
);
CompanyRouter.delete("/:id", authMiddleware, authorizeRoles("SuperAdmin", "owner"), (req, res) =>
  companyController.Softdelete(req, res),
);
CompanyRouter.patch("/activate/:id", authMiddleware, authorizeRoles("SuperAdmin"), (req, res) =>
  companyController.Activate(req, res),
);
CompanyRouter.patch("deactivate/:id", authMiddleware, authorizeRoles("SuperAdmin"), (req, res) =>
  companyController.Deactivate(req, res),
);
CompanyRouter.patch("/change-plan/:id", authMiddleware, authorizeRoles("SuperAdmin"), (req, res) =>
  companyController.ChangePlan(req, res),
);
export default CompanyRouter;
