import { findByIdCompanyUseCase } from "@/modules/users/application/use-cases/company/findByIdCompanyUseCase";
import { GetAllCompanyUseCase } from "@/modules/users/application/use-cases/company/getAllCompanyUseCase";
import { RegisterCompanyUseCase } from "@/modules/users/application/use-cases/company/registerCompanyUseCase";
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

//capa de interfaz
//se inyectan las dependencias
const companyController = new CompanyController(registercompanyUseCase, getAllCompanyUseCase, findByIdCompany);

CompanyRouter.post("/", authMiddleware, authorizeRoles("owner"), (req, res) => companyController.register(req, res));
CompanyRouter.get("/", authMiddleware, authorizeRoles("SuperAdmin"), (req, res) => companyController.getAll(req, res));
CompanyRouter.get("/:id", authMiddleware, authorizeRoles("SuperAdmin"), (req, res) =>
  companyController.findById(req, res),
);
export default CompanyRouter;
