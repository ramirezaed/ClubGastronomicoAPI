import { findByIdOrderUseCase } from "@/modules/users/application/use-cases/order/findByIdOrderUseCase";
import { registerOrderUseCase } from "@/modules/users/application/use-cases/order/registerOrderUseCase";
import { OrderController } from "@/modules/users/infrastructure/controllers/orderController";
import { CompanyQueryRepository } from "@/modules/users/infrastructure/persistence/company/CompanyQueryRepository";
import { CompanyRepository } from "@/modules/users/infrastructure/persistence/company/CompanyRepository";
import { MenuItemsQueryRepository } from "@/modules/users/infrastructure/persistence/MenuItems/MenuItemsQueryRepository";
import { MenuItemsRepository } from "@/modules/users/infrastructure/persistence/MenuItems/MenuItemsRepository";
import { OrderQueryRepository } from "@/modules/users/infrastructure/persistence/order/orderQueryRepository";
import { OrderRepository } from "@/modules/users/infrastructure/persistence/order/orderRepository";
import { authMiddleware } from "@/shared/infraestructure/http/middleware/auth.middleware";
import { authorizeRoles } from "@/shared/infraestructure/http/middleware/authorize.middleware";
import { Router } from "express";

const orderRouter = Router();

//capa de infraestructura(adaptadores de salida)

const orderRepository = new OrderRepository();
const orderQueryRepository = new OrderQueryRepository();
const companyRepository = new CompanyQueryRepository();
const menuItems = new MenuItemsQueryRepository();

// capa de aplicacion (casos de uso)
const registerUseCase = new registerOrderUseCase(orderRepository, companyRepository, menuItems);
const findByIdUseCase = new findByIdOrderUseCase(orderQueryRepository, companyRepository);

//capa de interfaz, se inyectan las dependencias
const orderController = new OrderController(registerUseCase, findByIdUseCase);

orderRouter.post("/", authMiddleware, authorizeRoles("owner", "Employee"), (req, res) => orderController.register(req, res));

orderRouter.get("/:id", authMiddleware, authorizeRoles("owner", "Employee"), (req, res) => orderController.findById(req, res));
export default orderRouter;
