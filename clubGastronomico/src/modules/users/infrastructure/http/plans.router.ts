import { UpdatePlanUseCase } from "@/modules/users/application/use-cases/plan/updatePlanUseCase";
import { softdeletePlanUseCase } from "@/modules/users/application/use-cases/plan/deletePlanUseCase";
import { findByIdPlansUseCase } from "@/modules/users/application/use-cases/plan/findByIdPlansUseCase";
import { getAllPlansUseCase } from "@/modules/users/application/use-cases/plan/getAllPlansUseCase";
import { registerPlanUseCase } from "@/modules/users/application/use-cases/plan/registerPlanUseCase";
import { PlanController } from "@/modules/users/infrastructure/controllers/plansCotroller";
import { subscriptionQueryRepository } from "@/modules/users/infrastructure/persistence/subscription/subscriptionQueryRepository";
import { SubscriptionPlanRepository } from "@/modules/users/infrastructure/persistence/subscription/subscriptionRepository";
import { authMiddleware } from "@/shared/infraestructure/http/middleware/auth.middleware";
import { authorizeRoles } from "@/shared/infraestructure/http/middleware/authorize.middleware";
import { Router } from "express";

const PlansRouter = Router();

//capa de infraestructura(adaptadores de salida)
const planQueryRepository = new subscriptionQueryRepository();
const planRepository = new SubscriptionPlanRepository();
//capa de aplicacion(caso de uso), se define lo que hace
const getAllUseCase = new getAllPlansUseCase(planQueryRepository);
const findByIdPlanUseCase = new findByIdPlansUseCase(planQueryRepository);
const registerPlan = new registerPlanUseCase(planRepository);
const updatePlan = new UpdatePlanUseCase(planRepository);
const softdelete = new softdeletePlanUseCase(planRepository);

//capa de interfaz, se inyectan las dependencias

const plansController = new PlanController(getAllUseCase, findByIdPlanUseCase, registerPlan, updatePlan, softdelete);

PlansRouter.get("/", authMiddleware, authorizeRoles("SuperAdmin", "owner"), (req, res) => plansController.getAll(req, res));
PlansRouter.get("/:id", authMiddleware, authorizeRoles("SuperAdmin"), (req, res) => plansController.findById(req, res));
PlansRouter.post("/", authMiddleware, authorizeRoles("SuperAdmin"), (req, res) => plansController.register(req, res));
PlansRouter.patch("/:id", authMiddleware, authorizeRoles("SuperAdmin"), (req, res) => plansController.update(req, res));
PlansRouter.delete("/:id", authMiddleware, authorizeRoles("SuperAdmin"), (req, res) => plansController.softdelete(req, res));
export default PlansRouter;
