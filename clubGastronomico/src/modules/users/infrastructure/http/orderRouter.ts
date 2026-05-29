import { changeStatusOrderUsecase } from "@/modules/users/application/use-cases/order/changeStatusOrderUseCase";
import { findByIdOrderUseCase } from "@/modules/users/application/use-cases/order/findByIdOrderUseCase";
import { getAllOrderUsecase } from "@/modules/users/application/use-cases/order/getAllOrderUseCase";
import { registerOrderUseCase } from "@/modules/users/application/use-cases/order/registerOrderUseCase";
import { OrderController } from "@/modules/users/infrastructure/controllers/orderController";
import { CompanyQueryRepository } from "@/modules/users/infrastructure/persistence/company/CompanyQueryRepository";
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
const companyQueryRepository = new CompanyQueryRepository();
const menuItemsQueryRepository = new MenuItemsQueryRepository();
const menuItems = new MenuItemsRepository();
// capa de aplicacion (casos de uso)
const registerUseCase = new registerOrderUseCase(orderRepository, companyQueryRepository, menuItemsQueryRepository, menuItems);
const findByIdUseCase = new findByIdOrderUseCase(orderQueryRepository, companyQueryRepository);
const changeStatusUseCase = new changeStatusOrderUsecase(orderRepository, companyQueryRepository);
const getAllOrderUseCase = new getAllOrderUsecase(orderQueryRepository, companyQueryRepository);
const registerForBOTUseCase = new registerOrderUseCase(
  orderRepository,
  companyQueryRepository,
  menuItemsQueryRepository,
  menuItems,
);

//capa de interfaz, se inyectan las dependencias
const orderController = new OrderController(
  registerUseCase,
  registerForBOTUseCase,
  findByIdUseCase,
  changeStatusUseCase,
  getAllOrderUseCase,
);

//registrar una nueva order
orderRouter.post("/", authMiddleware, authorizeRoles("owner", "Employee"), (req, res) => orderController.register(req, res));

//registrar orden desde el bot
orderRouter.post("/bot/:id", authMiddleware, authorizeRoles("owner", "Employee"), (req, res) =>
  orderController.register(req, res),
);

//buscar order por id
orderRouter.get("/:id", authMiddleware, authorizeRoles("owner", "Employee"), (req, res) => orderController.findById(req, res));

//muestra todas las ordenes
orderRouter.get("/", authMiddleware, authorizeRoles("owner", "Employee"), (req, res) => orderController.getAll(req, res));

//cambiar estado de order
orderRouter.patch("/:id/status/:status", authMiddleware, authorizeRoles("owner", "Employee"), (req, res) =>
  orderController.changeStatus(req, res),
);
export default orderRouter;
