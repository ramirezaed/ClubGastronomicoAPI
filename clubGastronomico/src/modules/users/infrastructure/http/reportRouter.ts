import { canceledSalesUseCase } from "@/modules/users/application/use-cases/reports/canceledSalesUseCase";
import { dailySalesUseCase } from "@/modules/users/application/use-cases/reports/dailySalesUseCase";
import { topHourDayUseCase } from "@/modules/users/application/use-cases/reports/topHourDayUseCase";
import { topItemsUseCase } from "@/modules/users/application/use-cases/reports/topItemsUseCase";
import { ReportsController } from "@/modules/users/infrastructure/controllers/reportsController";
import { CompanyQueryRepository } from "@/modules/users/infrastructure/persistence/company/CompanyQueryRepository";
import { reportsQueryRepository } from "@/modules/users/infrastructure/persistence/reports/reportsQueryRepository";
import { authMiddleware } from "@/shared/infraestructure/http/middleware/auth.middleware";
import { authorizeRoles } from "@/shared/infraestructure/http/middleware/authorize.middleware";
import { Router } from "express";

const reportsRouter = Router();

const companyQueryRepository = new CompanyQueryRepository();
const reportsQueryrepository = new reportsQueryRepository();

const dailySales = new dailySalesUseCase(reportsQueryrepository, companyQueryRepository);
const canceledSales = new canceledSalesUseCase(reportsQueryrepository, companyQueryRepository);
const topItems = new topItemsUseCase(reportsQueryrepository, companyQueryRepository);
const topHpur = new topHourDayUseCase(reportsQueryrepository, companyQueryRepository);

const reportsController = new ReportsController(dailySales, canceledSales, topItems, topHpur);

/**
 * @swagger
 * /api/reports/dailySales:
 *   get:
 *     summary: Obtener reporte diario de ventas
 *     description: Devuelve el total de pedidos y el monto total vendido. Si no se envía una fecha, se utiliza la fecha actual.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-06-02"
 *         description: Fecha del reporte. Si no se envía, se utiliza la fecha actual.
 *     responses:
 *       200:
 *         description: Reporte obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DailySalesReport'
 *       400:
 *         description: Fecha inválida
 *       404:
 *         description: Compañía no encontrada o inactiva
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tiene permisos (solo OWNER)
 *       500:
 *         description: Error interno del servidor
 */
reportsRouter.get("/dailySales", authMiddleware, authorizeRoles("owner"), (req, res) => reportsController.dailySales(req, res));

/**
 * @swagger
 * /api/reports/canceled-sales:
 *   get:
 *     summary: Obtener reporte de ventas canceladas
 *     description: Devuelve información sobre los pedidos cancelados. Si no se envía una fecha, se utiliza la fecha actual.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-06-02"
 *         description: Fecha del reporte. Si no se envía, se utiliza la fecha actual.
 *     responses:
 *       200:
 *         description: Reporte obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CanceledSalesReport'
 *       400:
 *         description: Fecha inválida
 *       404:
 *         description: Compañía no encontrada o inactiva
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tiene permisos (solo OWNER)
 *       500:
 *         description: Error interno del servidor
 */
reportsRouter.get("/canceled-sales", authMiddleware, authorizeRoles("owner"), (req, res) =>
  reportsController.canceledReports(req, res),
);

/**
 * @swagger
 * components:
 *   schemas:
 *     TopItemsReport:
 *       type: object
 *       properties:
 *         date_from:
 *           type: string
 *           format: date
 *           example: "2026-06-01"
 *         date_to:
 *           type: string
 *           format: date
 *           example: "2026-06-03"
 *         topItems:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               menuItems_id:
 *                 type: string
 *                 example: "6a13330f8e9b769082a1985a"
 *               item_name:
 *                 type: string
 *                 example: "Hamburguesa Completa"
 *               category_name:
 *                 type: string
 *                 example: "Hamburguesas"
 *               total_quantity:
 *                 type: integer
 *                 example: 125
 *               total_amount:
 *                 type: number
 *                 example: 562500
 */
/**
 * @swagger
 * /api/reports/top-items:
 *   get:
 *     summary: Obtener los productos más vendidos
 *     description: Devuelve el ranking de productos más vendidos en un rango de fechas. Si no se envían fechas, se utiliza la fecha actual.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date_from
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-06-01"
 *         description: Fecha inicial del reporte. Si no se envía, se utiliza la fecha actual.
 *
 *       - in: query
 *         name: date_to
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-06-03"
 *         description: Fecha final del reporte. Si no se envía, se utiliza la fecha actual.
 *
 *     responses:
 *       200:
 *         description: Reporte obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TopItemsReport'
 *       400:
 *         description: Fechas inválidas o rango de fechas incorrecto
 *       404:
 *         description: Compañía no encontrada o inactiva
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tiene permisos (solo OWNER)
 *       500:
 *         description: Error interno del servidor
 */
reportsRouter.get("/top-items", authMiddleware, authorizeRoles("owner"), (req, res) => reportsController.topItems(req, res));

/**
 * @swagger
 * components:
 *   schemas:
 *     TopDayHour:
 *       type: object
 *       properties:
 *         day_of_week:
 *           type: string
 *           example: "Friday"
 *         hour_from:
 *           type: integer
 *           example: 20
 *         hour_to:
 *           type: integer
 *           example: 21
 *         label:
 *           type: string
 *           example: "20:00 - 21:00"
 *         total_orders:
 *           type: integer
 *           example: 45
 *
 *     TopHoursReport:
 *       type: object
 *       properties:
 *         date_from:
 *           type: string
 *           format: date
 *           example: "2026-06-01"
 *         date_to:
 *           type: string
 *           format: date
 *           example: "2026-06-07"
 *         top_hours:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TopDayHour'
 */
/**
 * @swagger
 * /api/reports/top-hours-days:
 *   get:
 *     summary: Obtener los días y franjas horarias con más pedidos
 *     description: Devuelve un ranking de días y franjas horarias con mayor cantidad de pedidos dentro de un rango de fechas. Si no se envían fechas, se utiliza la fecha actual.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date_from
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-06-01"
 *         description: Fecha inicial del reporte. Si no se envía, se utiliza la fecha actual.
 *
 *       - in: query
 *         name: date_to
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-06-07"
 *         description: Fecha final del reporte. Si no se envía, se utiliza la fecha actual.
 *
 *     responses:
 *       200:
 *         description: Reporte obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TopHoursReport'
 *       400:
 *         description: Fechas inválidas o rango de fechas incorrecto
 *       404:
 *         description: Compañía no encontrada o inactiva
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tiene permisos (solo OWNER)
 *       500:
 *         description: Error interno del servidor
 */

reportsRouter.get("/top-hours-days", authMiddleware, authorizeRoles("owner"), (req, res) =>
  reportsController.topHourDay(req, res),
);
export default reportsRouter;
