import { activateCategoryUseCase } from "@/modules/users/application/use-cases/category/activatecategoryUseCase";
import { deactivateCategoryUseCase } from "@/modules/users/application/use-cases/category/deactivateCategoryUseCase";
import { findByIdCategoryUseCase } from "@/modules/users/application/use-cases/category/findByIdUseCase";
import { getAllCategoryUseCase } from "@/modules/users/application/use-cases/category/getAllCategoryUseCase";
import { RegisterCategoryUseCase } from "@/modules/users/application/use-cases/category/registerCategoryUseCase";
import { softdeleteCategoryUseCase } from "@/modules/users/application/use-cases/category/softdeleteCategoryUseCase";
import { CategoryController } from "@/modules/users/infrastructure/controllers/categoryController";
import { CategoryQueryRepository } from "@/modules/users/infrastructure/persistence/categoryItems/categoryQueryRepository";
import { CategoryRepository } from "@/modules/users/infrastructure/persistence/categoryItems/categoryRepository";
import { authMiddleware } from "@/shared/infraestructure/http/middleware/auth.middleware";
import { authorizeRoles } from "@/shared/infraestructure/http/middleware/authorize.middleware";
import { Router } from "express";

const categoryRouter = Router();

//capa de infraestructura, (adaptadores de salida)
const categoryRepository = new CategoryRepository();
const categoryQueryRepository = new CategoryQueryRepository();

// capa de aplicacion, caso de uso
const registerCategory = new RegisterCategoryUseCase(categoryRepository, categoryQueryRepository);
const activateCategory = new activateCategoryUseCase(categoryRepository);
const deactivateCategory = new deactivateCategoryUseCase(categoryRepository);
const softdelete = new softdeleteCategoryUseCase(categoryRepository);
const findById = new findByIdCategoryUseCase(categoryQueryRepository);
const getAllCategory = new getAllCategoryUseCase(categoryQueryRepository);

//capa de interfaz, se inyectan las dependencias
const categoryController = new CategoryController(
  registerCategory,
  activateCategory,
  deactivateCategory,
  softdelete,
  findById,
  getAllCategory,
);

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "665e0d3b5c9a1c0012f1a999"
 *         name:
 *           type: string
 *           example: "Hamburguesas"
 *         is_active:
 *           type: boolean
 *           example: true
 *         deleted_at:
 *           type: string
 *           nullable: true
 *           example: null
 *         created_at:
 *           type: string
 *           example: "2026-05-21T10:00:00.000Z"
 *         updated_at:
 *           type: string
 *           example: "2026-05-21T10:00:00.000Z"
 */

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Obtener una categoría por ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la categoría
 *         example: "665e0d3b5c9a1c0012f1a999"
 *     responses:
 *       200:
 *         description: Categoría obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tiene permisos (solo OWNER)
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error interno del servidor
 */
categoryRouter.get("/:id", authMiddleware, authorizeRoles("owner"), (req, res) => categoryController.findById(req, res));

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Obtener lista de categorías con paginación
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: is_active
 *         schema:
 *           type: boolean
 *           example: true
 *         description: Filtrar categorías activas o inactivas
 *
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *           example: "Hamburguesas"
 *         description: Filtrar categorías por nombre
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
 *         description: Lista de categorías obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
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
 *                       example: 25
 *                     totalPages:
 *                       type: integer
 *                       example: 3
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tiene permisos (solo OWNER)
 *       500:
 *         description: Error interno del servidor
 */
categoryRouter.get("/", authMiddleware, authorizeRoles("owner"), (req, res) => categoryController.getAll(req, res));

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Registrar una nueva categoría
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Hamburguesas"
 *     responses:
 *       201:
 *         description: Categoría creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "665e0d3b5c9a1c0012f1a999"
 *                 name:
 *                   type: string
 *                   example: "Hamburguesas"
 *                 is_active:
 *                   type: boolean
 *                   example: true
 *                 created_at:
 *                   type: string
 *                   example: "2026-05-21T10:00:00.000Z"
 *                 updated_at:
 *                   type: string
 *                   example: "2026-05-21T10:00:00.000Z"
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tiene permisos (solo OWNER)
 *       409:
 *         description: Ya existe una categoría con ese nombre
 *       404:
 *         description: Error al registrar categoría
 *       500:
 *         description: Error interno del servidor
 */
categoryRouter.post("/", authMiddleware, authorizeRoles("owner"), (req, res) => categoryController.register(req, res));

/**
 * @swagger
 * /api/categories/activate/{id}:
 *   patch:
 *     summary: Activar una categoría
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la categoría
 *         example: "665e0d3b5c9a1c0012f1a999"
 *     responses:
 *       200:
 *         description: Categoría activada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tiene permisos (solo OWNER)
 *       404:
 *         description: Categoría no encontrada
 *       409:
 *         description: La categoría ya se encuentra activa
 *       500:
 *         description: Error interno del servidor
 */
categoryRouter.patch("/activate/:id", authMiddleware, authorizeRoles("owner"), (req, res) =>
  categoryController.activate(req, res),
);

/**
 * @swagger
 * /api/categories/deactivate/{id}:
 *   patch:
 *     summary: Desactivar una categoría
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la categoría
 *         example: "665e0d3b5c9a1c0012f1a999"
 *     responses:
 *       200:
 *         description: Categoría desactivada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tiene permisos (solo OWNER)
 *       404:
 *         description: Categoría no encontrada
 *       409:
 *         description: La categoría ya se encuentra inactiva
 *       500:
 *         description: Error interno del servidor
 */
categoryRouter.patch("/deactivate/:id", authMiddleware, authorizeRoles("owner"), (req, res) =>
  categoryController.deactivate(req, res),
);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Eliminar una categoría (soft delete)
 *     description: Marca la categoría como eliminada seteando el campo deleted_at sin eliminarla físicamente.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la categoría
 *         example: "665e0d3b5c9a1c0012f1a999"
 *     responses:
 *       200:
 *         description: Categoría eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: categoria eliminada exitosamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tiene permisos (solo OWNER)
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error interno del servidor
 */
categoryRouter.delete("/:id", authMiddleware, authorizeRoles("owner"), (req, res) => categoryController.softdelete(req, res));

export default categoryRouter;
