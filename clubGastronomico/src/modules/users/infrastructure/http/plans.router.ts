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

/**
 * @swagger
 * components:
 *   schemas:
 *     SubscriptionPlan:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "6641a0d21b23fa12c9d4f111"
 *         name:
 *           type: string
 *           example: "Plan Premium"
 *         price:
 *           type: string
 *           example: "9999"
 *         description:
 *           type: string
 *           example: "Acceso completo al sistema"
 *         is_active:
 *           type: boolean
 *           example: true
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */
/**
 * @swagger
 * /api/plans:
 *   get:
 *     summary: Obtener todos los planes activos
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de planes obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SubscriptionPlan'
 *       404:
 *         description: No existen planes registrados
 *       500:
 *         description: Error interno del servidor
 */
PlansRouter.get("/", authMiddleware, authorizeRoles("SuperAdmin", "owner"), (req, res) => plansController.getAll(req, res));

/**
 * @swagger
 * /api/plans/{id}:
 *   get:
 *     summary: Obtener plan por ID
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del plan
 *         schema:
 *           type: string
 *           example: "6641a0d21b23fa12c9d4f111"
 *     responses:
 *       200:
 *         description: Plan encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubscriptionPlan'
 *       404:
 *         description: Plan no encontrado
 *       500:
 *         description: Error interno del servidor
 */
PlansRouter.get("/:id", authMiddleware, authorizeRoles("SuperAdmin"), (req, res) => plansController.findById(req, res));

/**
 * @swagger
 * /api/plans:
 *   post:
 *     summary: Crear nuevo plan de suscripción
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price, description]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Plan Gold"
 *               price:
 *                 type: string
 *                 example: "15000"
 *               description:
 *                 type: string
 *                 example: "Plan con funcionalidades avanzadas"
 *     responses:
 *       201:
 *         description: Plan creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubscriptionPlan'
 *       409:
 *         description: Ya existe un plan con ese nombre
 *       400:
 *         description: Error al registrar el plan
 *       500:
 *         description: Error interno del servidor
 */
PlansRouter.post("/", authMiddleware, authorizeRoles("SuperAdmin"), (req, res) => plansController.register(req, res));

/**
 * @swagger
 * /api/plans/{id}:
 *   patch:
 *     summary: Actualizar plan
 *     tags: [Plans]
 *     description: Permite modificar precio y descripción del plan
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del plan a actualizar
 *         schema:
 *           type: string
 *           example: "6641a0d21b23fa12c9d4f111"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               price:
 *                 type: string
 *                 example: "20000"
 *               description:
 *                 type: string
 *                 example: "Plan actualizado"
 *     responses:
 *       200:
 *         description: Plan actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubscriptionPlan'
 *       404:
 *         description: Plan no encontrado
 *       500:
 *         description: Error interno del servidor
 */
PlansRouter.patch("/:id", authMiddleware, authorizeRoles("SuperAdmin"), (req, res) => plansController.update(req, res));

/**
 * @swagger
 * /api/plans/{id}:
 *   delete:
 *     summary: Eliminar plan (Soft Delete)
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del plan a eliminar
 *         schema:
 *           type: string
 *           example: "6641a0d21b23fa12c9d4f111"
 *     responses:
 *       200:
 *         description: Plan eliminado correctamente
 *         content:
 *           application/json:
 *             example:
 *               message: Plan Eliminado con exito
 *       404:
 *         description: Plan no encontrado
 *       500:
 *         description: Error interno del servidor
 */
PlansRouter.delete("/:id", authMiddleware, authorizeRoles("SuperAdmin"), (req, res) => plansController.softdelete(req, res));
export default PlansRouter;
