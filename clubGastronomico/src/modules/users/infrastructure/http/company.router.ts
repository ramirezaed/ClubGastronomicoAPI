import { RegisterCompanyUseCase } from "@/modules/users/application/use-cases/company/registerCompanyUseCase";
import { CompanyController } from "@/modules/users/infrastructure/controllers/companyController";
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
const subscription = new subscriptionQueryRepository();
const userRepository = new MongooseUserRepository();

//capa de aplicacion (Casos de Uso)
//aca se define que hace
const registercompanyUseCase = new RegisterCompanyUseCase(companyRepository, subscription, userRepository);

//capa de interfaz
//se inyectan las dependencias
const companyController = new CompanyController(registercompanyUseCase);

CompanyRouter.post("/", authMiddleware, authorizeRoles("owner"), (req, res) => companyController.register(req, res));

export default CompanyRouter;
