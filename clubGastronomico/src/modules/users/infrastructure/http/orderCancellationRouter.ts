import { getAllOrderCancellationUseCase } from "@/modules/users/application/use-cases/orderCancellation.ts/getAllOrderCancellationUseCase";
import { getByIdOrdercancellationUseCase } from "@/modules/users/application/use-cases/orderCancellation.ts/getByIdOrderCancellationUseCase";
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
const getById = new getByIdOrdercancellationUseCase(orderCancellation, companyRepository);

const orderCancellationController = new OrderCancellationController(getAll, getById);

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderCancellation:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "685c1d2f9a4f4c0012ab3456"
 *         order_id:
 *           type: string
 *           example: "685c1d2f9a4f4c0012ab1111"
 *         company_id:
 *           type: string
 *           example: "685c1d2f9a4f4c0012ab2222"
 *         reason:
 *           type: string
 *           enum:
 *             - El tiempo de espera es demasiado largo
 *             - Me equivoqué en la dirección de entrega
 *             - Pedí los productos equivocados
 *             - Olvidé aplicar un cupón o descuento
 *             - Hice el pedido dos veces sin querer
 *             - El costo final superó mi presupuesto
 *             - Ya no quiero el pedido / Cambié de opinión
 *             - Otro motivo
 *           example: "El tiempo de espera es demasiado largo"
 *         custom_reason:
 *           type: string
 *           nullable: true
 *           example: "El restaurante informó una demora de más de 2 horas"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2026-05-20T18:30:00.000Z"
 */

/**
 * @swagger
 * /api/order-cancellations:
 *   get:
 *     summary: Obtener todas las cancelaciones de pedidos
 *     tags: [OrderCancellations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: reason
 *         schema:
 *           type: string
 *           enum:
 *             - El tiempo de espera es demasiado largo
 *             - Me equivoqué en la dirección de entrega
 *             - Pedí los productos equivocados
 *             - Olvidé aplicar un cupón o descuento
 *             - Hice el pedido dos veces sin querer
 *             - El costo final superó mi presupuesto
 *             - Ya no quiero el pedido / Cambié de opinión
 *             - Otro motivo
 *         description: Filtrar por motivo de cancelación
 *
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-05-01"
 *         description: Fecha inicial del rango
 *
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-05-31"
 *         description: Fecha final del rango
 *
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Número de página
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Cantidad de resultados por página
 *
 *     responses:
 *       200:
 *         description: Cancelaciones obtenidas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/OrderCancellation'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 35
 *                     totalPages:
 *                       type: integer
 *                       example: 4
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tiene permisos (solo OWNER)
 *       500:
 *         description: Error interno del servidor
 */
orderCancellationRouter.get("/", authMiddleware, authorizeRoles("owner"), (req, res) =>
  orderCancellationController.getAll(req, res),
);

/**
 * @swagger
 * /api/order-cancellations/{id}:
 *   get:
 *     summary: Obtener una cancelación por ID de pedido
 *     tags: [OrderCancellations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del pedido cancelado
 *         example: "685c1d2f9a4f4c0012ab1111"
 *
 *     responses:
 *       200:
 *         description: Cancelación obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderCancellation'
 *       404:
 *         description: Compañía no encontrada o cancelación inexistente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tiene permisos (solo OWNER)
 *       500:
 *         description: Error interno del servidor
 */
orderCancellationRouter.get("/:id", authMiddleware, authorizeRoles("owner"), (req, res) =>
  orderCancellationController.getById(req, res),
);
export default orderCancellationRouter;
