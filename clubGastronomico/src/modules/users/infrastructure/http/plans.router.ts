import { findByIdPlansUseCase } from "@/modules/users/application/use-cases/plan/findByIdPlansUseCase";
import { getAllPlansUseCase } from "@/modules/users/application/use-cases/plan/getAllPlansUseCase";
import { PlanController } from "@/modules/users/infrastructure/controllers/plansCotroller";
import { subscriptionQueryRepository } from "@/modules/users/infrastructure/persistence/subscription/subscriptionQueryRepository";
import { authMiddleware } from "@/shared/infraestructure/http/middleware/auth.middleware";
import { authorizeRoles } from "@/shared/infraestructure/http/middleware/authorize.middleware";
import { Router } from "express";

const PlansRouter = Router();

//capa de infraestructura(adaptadores de salida)
const planRepository = new subscriptionQueryRepository();
//capa de aplicacion(caso de uso), se define lo que hace
const getAllUseCase = new getAllPlansUseCase(planRepository);
const findByIdPlanUseCase = new findByIdPlansUseCase(planRepository);

//capa de interfaz, se inyectan las dependencias

const plansController = new PlanController(getAllUseCase, findByIdPlanUseCase);

PlansRouter.get("/", authMiddleware, authorizeRoles("SuperAdmin", "owner"), (req, res) => plansController.getAll(req, res));
PlansRouter.get("/:id", authMiddleware, authorizeRoles("SuperAdmin"), (req, res) => plansController.findById(req, res));
export default PlansRouter;
