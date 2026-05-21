import { RegisterCategoryUseCase } from "@/modules/users/application/use-cases/category/registerCategoryUseCase";
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

//capa de interfaz, se inyectan las dependencias
const categoryController = new CategoryController(registerCategory);

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
