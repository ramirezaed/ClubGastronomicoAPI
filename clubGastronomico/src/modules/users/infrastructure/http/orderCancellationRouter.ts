import { getAllOrderCancellationUseCase } from "@/modules/users/application/use-cases/orderCancellation.ts/getAllOrderCancellationUseCase";
import { OrderCancellationController } from "@/modules/users/infrastructure/controllers/orderCancellationController";
import { CompanyQueryRepository } from "@/modules/users/infrastructure/persistence/company/CompanyQueryRepository";

import { orderCancellationQueryRepository } from "@/modules/users/infrastructure/persistence/orderCancellation/orderCancellationQueryRepository";
import { authMiddleware } from "@/shared/infraestructure/http/middleware/auth.middleware";
import { authorizeRoles } from "@/shared/infraestructure/http/middleware/authorize.middleware";
import { Router } from "express";
import { DEFAULT_CIPHERS } from "node:tls";

const orderCancellationRouter = Router();

//adaptadores de salida
const orderCancellation = new orderCancellationQueryRepository();
const companyRepository = new CompanyQueryRepository();

//capa de aplicacon (caso de suo)

const getAll = new getAllOrderCancellationUseCase(orderCancellation, companyRepository);

const orderCancellationController = new OrderCancellationController(getAll);

orderCancellationRouter.get("/", authMiddleware, authorizeRoles("owner"), (req, res) =>
  orderCancellationController.getAll(req, res),
);
export default orderCancellationRouter;
