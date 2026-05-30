import { cancelOrderUseCase } from "@/modules/users/application/use-cases/order/cancelOrderUseCase";
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
const cancelUseCase = new cancelOrderUseCase(orderRepository, companyQueryRepository, menuItems);

//capa de interfaz, se inyectan las dependencias
const orderController = new OrderController(
  registerUseCase,
  registerForBOTUseCase,
  findByIdUseCase,
  changeStatusUseCase,
  getAllOrderUseCase,
  cancelUseCase,
);

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       properties:
 *         menuItems_id:
 *           type: string
 *           example: "6837e5c8c3f0c3c5d1e12345"
 *         category_id:
 *           type: string
 *           example: "6837e5c8c3f0c3c5d1e67890"
 *         item_name:
 *           type: string
 *           example: "Hamburguesa Completa"
 *         category_name:
 *           type: string
 *           example: "Hamburguesas"
 *         quantity:
 *           type: number
 *           example: 2
 *         unit_price:
 *           type: number
 *           example: 5000
 *         time:
 *           type: number
 *           example: 15
 *
 *     Customer:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Juan Perez"
 *         address:
 *           type: string
 *           example: "Av. San Martin 123"
 *         phone:
 *           type: string
 *           example: "3794123456"
 *         telegram_id:
 *           type: string
 *           example: "123456789"
 *         telegram_username:
 *           type: string
 *           example: "juanperez"
 *
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "6837e5c8c3f0c3c5d1e99999"
 *         company_id:
 *           type: string
 *           example: "6837e5c8c3f0c3c5d1e11111"
 *         status:
 *           type: string
 *           enum:
 *             - Pendiente
 *             - En Progreso
 *             - Completo
 *         customer:
 *           $ref: '#/components/schemas/Customer'
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         total_amount:
 *           type: number
 *           example: 10000
 *         deleted_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Registrar una nueva orden manualmente
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customer
 *               - items
 *             properties:
 *               customer:
 *                 type: object
 *                 required:
 *                   - name
 *                   - address
 *                   - phone
 *                   - telegram_id
 *                   - telegram_username
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Carlos Gómez"
 *                   address:
 *                     type: string
 *                     example: "Calle Falsa 123"
 *                   phone:
 *                     type: string
 *                     example: "+543794123456"
 *                   telegram_id:
 *                     type: string
 *                     example: "1234"
 *                   telegram_username:
 *                     type: string
 *                     example: "carlos_gomez_ok"
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - menuItems_id
 *                     - quantity
 *                   properties:
 *                     menuItems_id:
 *                       type: string
 *                       example: "6a13330f8e9b769082a1985a"
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                       example: 80
 *     responses:
 *       201:
 *         description: Orden registrada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Error de validación de la orden
 *       404:
 *         description: Compañía no encontrada
 *       504:
 *         description: Error interno del servidor
 */
//registrar una nueva order
orderRouter.post("/", authMiddleware, authorizeRoles("owner", "Employee"), (req, res) => orderController.register(req, res));

//registrar orden desde el bot

/**
 * @swagger
 * /api/orders/bot/{id}:
 *   post:
 *     summary: Registrar una orden desde Telegram Bot
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la compañía
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customer
 *               - items
 *             properties:
 *               customer:
 *                 type: object
 *                 required:
 *                   - name
 *                   - address
 *                   - phone
 *                   - telegram_id
 *                   - telegram_username
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Carlos Gómez"
 *                   address:
 *                     type: string
 *                     example: "Calle Falsa 123"
 *                   phone:
 *                     type: string
 *                     example: "+543794123456"
 *                   telegram_id:
 *                     type: string
 *                     example: "1234"
 *                   telegram_username:
 *                     type: string
 *                     example: "carlos_gomez_ok"
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - menuItems_id
 *                     - quantity
 *                   properties:
 *                     menuItems_id:
 *                       type: string
 *                       example: "6a13330f8e9b769082a1985a"
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                       example: 80
 *     responses:
 *       201:
 *         description: Orden registrada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Error de validación de la orden
 *       404:
 *         description: Compañía no encontrada
 *       504:
 *         description: Error interno del servidor
 */
orderRouter.post("/bot/:id", (req, res) => orderController.registerForBOT(req, res));

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Obtener una orden por ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la orden
 *     responses:
 *       200:
 *         description: Orden encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Orden o compañía no encontrada
 *       500:
 *         description: Error interno del servidor
 */
//buscar order por id
orderRouter.get("/:id", authMiddleware, authorizeRoles("owner", "Employee"), (req, res) => orderController.findById(req, res));

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Obtener todas las órdenes
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum:
 *             - Pendiente
 *             - En Progreso
 *             - Completo
 *         description: Filtrar órdenes por estado
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Cantidad de registros por página
 *     responses:
 *       200:
 *         description: Órdenes obtenidas correctamente
 *       500:
 *         description: Error interno del servidor
 */
//muestra todas las ordenes
orderRouter.get("/", authMiddleware, authorizeRoles("owner", "Employee"), (req, res) => orderController.getAll(req, res));

/**
 * @swagger
 * /api/orders/{id}/status/{status}:
 *   patch:
 *     summary: Cambiar estado de una orden
 *     description: |
 *       Las transiciones permitidas son:
 *
 *       - Pendiente → En Progreso
 *       - En Progreso → Completo
 *
 *       No se permiten cambios en sentido inverso ni saltar estados.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la orden
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum:
 *             - Pendiente
 *             - En Progreso
 *             - Completo
 *         description: Nuevo estado de la orden
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente
 *       403:
 *         description: Transición de estado inválida
 *       404:
 *         description: Orden o compañía no encontrada
 *       500:
 *         description: Error interno del servidor
 */
//cambiar estado de order
orderRouter.patch("/:id/status/:status", authMiddleware, authorizeRoles("owner", "Employee"), (req, res) =>
  orderController.changeStatus(req, res),
);

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   patch:
 *     summary: Cancelar una orden
 *     description: |
 *       Cancela una orden actualizando su estado a cancelada.
 *
 *       Restricciones:
 *
 *       - Solo pueden cancelarse órdenes creadas en la fecha actual.
 *       - No puede cancelarse una orden que ya haya sido cancelada previamente.
 *
 *       Reglas de negocio:
 *
 *       - Si la orden se encontraba en estado "Pendiente" o "En progreso", el stock de los productos se restaura automáticamente.
 *       - Si la orden se encontraba en estado "Completo", la orden se cancela pero el stock no se restaura.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la orden
 *     responses:
 *       200:
 *         description: Orden cancelada correctamente
 *         content:
 *           application/json:
 *             example:
 *               message: "orden cancelada"
 *       400:
 *         description: La orden no cumple las condiciones para ser cancelada
 *       404:
 *         description: Orden o compañía no encontrada
 *       500:
 *         description: Error interno del servidor
 */
orderRouter.patch("/:id", authMiddleware, authorizeRoles("owner", "Employee"), (req, res) => orderController.cancel(req, res));
export default orderRouter;
