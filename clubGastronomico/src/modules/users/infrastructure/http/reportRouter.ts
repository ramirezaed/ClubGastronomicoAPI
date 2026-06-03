import { canceledSalesUseCase } from "@/modules/users/application/use-cases/reports/canceledSalesUseCase";
import { dailySalesUseCase } from "@/modules/users/application/use-cases/reports/dailySalesUseCase";
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

const reportsController = new ReportsController(dailySales, canceledSales);

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

export default reportsRouter;
