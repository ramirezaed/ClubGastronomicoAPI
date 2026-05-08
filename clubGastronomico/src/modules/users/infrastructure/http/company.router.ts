import { ActivateCompanyUseCase } from "@/modules/users/application/use-cases/company/activateCompanyUseCase";
import { changePlanCompanyUseCase } from "@/modules/users/application/use-cases/company/changePlanCompanyUseCase";
import { DeactivateCompanyUseCase } from "@/modules/users/application/use-cases/company/deactivateCompanyUseCase";
import { findByIdCompanyUseCase } from "@/modules/users/application/use-cases/company/findByIdCompanyUseCase";
import { GetAllCompanyUseCase } from "@/modules/users/application/use-cases/company/getAllCompanyUseCase";
import { meCompanyUseCase } from "@/modules/users/application/use-cases/company/meCompanyUseCase";
import { RegisterCompanyUseCase } from "@/modules/users/application/use-cases/company/registerCompanyUseCase";
import { SoftDeleteCompanyUseCase } from "@/modules/users/application/use-cases/company/softDeleteCompanyUseCase";
import { UpdateCompanyUseCase } from "@/modules/users/application/use-cases/company/updateCompanyUseCase";
import { CompanyController } from "@/modules/users/infrastructure/controllers/companyController";
import { CompanyQueryRepository } from "@/modules/users/infrastructure/persistence/company/CompanyQueryRepository";
import { CompanyRepository } from "@/modules/users/infrastructure/persistence/company/CompanyRepository";
import { subscriptionQueryRepository } from "@/modules/users/infrastructure/persistence/subscription/subscriptionQueryRepository";
import { MongooseUserRepository } from "@/modules/users/infrastructure/persistence/user/MongooseUserRepository";
import { authMiddleware } from "@/shared/infraestructure/http/middleware/auth.middleware";
import { authorizeRoles } from "@/shared/infraestructure/http/middleware/authorize.middleware";
import { Router } from "express";

const CompanyRouter = Router();
//inyeccion de dependencias
// capa de Infraestructura (Adaptadores de salida)
//Instancia del repositorio basada en Mongoose */
const companyRepository = new CompanyRepository();
const companyQueryRepository = new CompanyQueryRepository();
const subscription = new subscriptionQueryRepository();
const userRepository = new MongooseUserRepository();

//capa de aplicacion (Casos de Uso)
//aca se define que hace
const registercompanyUseCase = new RegisterCompanyUseCase(companyRepository, subscription, userRepository);
const getAllCompanyUseCase = new GetAllCompanyUseCase(companyQueryRepository);
const findByIdCompany = new findByIdCompanyUseCase(companyQueryRepository);
const meCompany = new meCompanyUseCase(companyQueryRepository);
const updateCompany = new UpdateCompanyUseCase(companyRepository);
const softdeleteCompany = new SoftDeleteCompanyUseCase(companyRepository);
const activate = new ActivateCompanyUseCase(companyRepository);
const deactivate = new DeactivateCompanyUseCase(companyRepository);
const changePlan = new changePlanCompanyUseCase(companyRepository, subscription);
//capa de interfaz
//se inyectan las dependencias
const companyController = new CompanyController(
  registercompanyUseCase,
  getAllCompanyUseCase,
  findByIdCompany,
  meCompany,
  updateCompany,
  softdeleteCompany,
  activate,
  deactivate,
  changePlan,
);
/**
 * @swagger
 * components:
 *   schemas:
 *     Company:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "665e0d3b5c9a1c0012f1a111"
 *         owner_id:
 *           type: string
 *           example: "665e0d3b5c9a1c0012f1a222"
 *         subscription_plan_id:
 *           type: string
 *           example: "665e0d3b5c9a1c0012f1a333"
 *         name:
 *           type: string
 *           example: "Mi Restaurante"
 *         phone:
 *           type: string
 *           example: "+5493794000000"
 *         is_active:
 *           type: boolean
 *           example: true
 *         deleted_at:
 *           type: string
 *           nullable: true
 *           example: null
 *         created_at:
 *           type: string
 *           example: "2026-05-01T10:00:00.000Z"
 *         updated_at:
 *           type: string
 *           example: "2026-05-01T10:00:00.000Z"
 */

/**
 * @swagger
 * /api/company:
 *   post:
 *     summary: Registrar una nueva compañía
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Mi Restaurante
 *               phone:
 *                 type: string
 *                 example: "+5493794000000"
 *     responses:
 *       201:
 *         description: Compañía creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       409:
 *         description: La compañía ya existe
 *       404:
 *         description: Plan de suscripción no encontrado
 *       400:
 *         description: Error al registrar compañía
 *       500:
 *         description: error interno del servidor
 */
CompanyRouter.post("/", authMiddleware, authorizeRoles("owner"), (req, res) => companyController.register(req, res));
/**
 * @swagger
 * /api/company:
 *   get:
 *     summary: Obtener todas las compañías (paginado)
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           example: 10
 *     responses:
 *       200:
 *         description: Lista de compañías
 *       500:
 *         description: error interno del servidor
 */
CompanyRouter.get("/", authMiddleware, authorizeRoles("SuperAdmin"), (req, res) => companyController.getAll(req, res));
/**
 * @swagger
 * /api/company/me:
 *   get:
 *     summary: Obtener mi compañía
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Compañía encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       404:
 *         description: Company no encontrada
 *       500:
 *         description: error interno del servidor
 */
CompanyRouter.get("/me", authMiddleware, (req, res) => companyController.MeCompany(req, res));
/**
 * @swagger
 * /api/company/{id}:
 *   get:
 *     summary: Obtener compañía por ID
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "665e0d3b5c9a1c0012f1a111"
 *     responses:
 *       200:
 *         description: Compañía encontrada
 *       404:
 *         description: Company no encontrada
 *       500:
 *         description: error interno del servidor
 */
CompanyRouter.get("/:id", authMiddleware, authorizeRoles("SuperAdmin"), (req, res) =>
  companyController.findById(req, res),
);
/**
 * @swagger
 * /api/company/update:
 *   patch:
 *     summary: Actualizar mi compañía
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Nuevo Nombre
 *               phone:
 *                 type: string
 *                 example: "+5493794111111"
 *     responses:
 *       200:
 *         description: Compañía actualizada
 *       403:
 *         description: Company inactiva
 *       404:
 *         description: Company no encontrada
 *       500:
 *         description: error interno del servidor
 */
CompanyRouter.patch("/update", authMiddleware, authorizeRoles("owner"), (req, res) =>
  companyController.update(req, res),
);
/**
 * @swagger
 * /api/company/{id}:
 *   delete:
 *     summary: Eliminar (soft delete) compañía
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Compañía eliminada
 *       404:
 *         description: Company no encontrada
 *       500:
 *         description: error interno del servidor
 */
CompanyRouter.delete("/:id", authMiddleware, authorizeRoles("SuperAdmin", "owner"), (req, res) =>
  companyController.Softdelete(req, res),
);
/**
 * @swagger
 * /api/company/activate/{id}:
 *   patch:
 *     summary: Activar compañía
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Compañía activada
 *       404:
 *         description: Company no encontrada
 *       409:
 *         description: La compañía ya está activa
 *       500:
 *         description: error interno del servidor
 */
CompanyRouter.patch("/activate/:id", authMiddleware, authorizeRoles("SuperAdmin"), (req, res) =>
  companyController.Activate(req, res),
);
/**
 * @swagger
 * /api/company/deactivate/{id}:
 *   patch:
 *     summary: Desactivar compañía
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Compañía desactivada
 *       404:
 *         description: Company no encontrada
 *       409:
 *         description: La compañía ya está desactivada
 *       500:
 *         description: error interno del servidor
 */
CompanyRouter.patch("deactivate/:id", authMiddleware, authorizeRoles("SuperAdmin"), (req, res) =>
  companyController.Deactivate(req, res),
);
/**
 * @swagger
 * /api/company/change-plan/{id}:
 *   patch:
 *     summary: Cambiar plan de suscripción de una compañía
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               plan_name:
 *                 type: string
 *                 example: PRO
 *     responses:
 *       200:
 *         description: Plan actualizado correctamente
 *       404:
 *         description: Company o plan no encontrado
 *       403:
 *         description: La compañía ya posee ese plan
 *       500:
 *         description: error interno del servidor
 */
CompanyRouter.patch("/change-plan/:id", authMiddleware, authorizeRoles("SuperAdmin"), (req, res) =>
  companyController.ChangePlan(req, res),
);
export default CompanyRouter;
