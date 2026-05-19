import { RegisterMenuItemsUseCase } from "@/modules/users/application/use-cases/MenuItems/registerMenuItemsUseCase";
import { MenuItemsController } from "@/modules/users/infrastructure/controllers/MenuItemsController";
import { MenuItemsQueryRepository } from "@/modules/users/infrastructure/persistence/MenuItems/MenuItemsQueryRepository";
import { MenuItemsRepository } from "@/modules/users/infrastructure/persistence/MenuItems/MenuItemsRepository";
import { authMiddleware } from "@/shared/infraestructure/http/middleware/auth.middleware";
import { authorizeRoles } from "@/shared/infraestructure/http/middleware/authorize.middleware";
import { Router } from "express";

const MenuItemsRouter = Router();

//capa de infraestructura

const menuRepository = new MenuItemsRepository();
const menuQueryRepository = new MenuItemsQueryRepository();
const categoryQueryRepository = new CategoryItemsQueryRepository();

//capa de apliacion (casos de uso)

const registerMenu = new RegisterMenuItemsUseCase(menuRepository, menuQueryRepository, categoryQueryRepository);

//capa de interfaz

const menuItemsController = new MenuItemsController(registerMenu);

/**
 * @swagger
 * components:
 *   schemas:
 *     MenuItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "665e0d3b5c9a1c0012f1a999"
 *         category_id:
 *           type: string
 *           example: "665e0d3b5c9a1c0012f1a888"
 *         company_id:
 *           type: string
 *           example: "665e0d3b5c9a1c0012f1a777"
 *         branch_id:
 *           type: string
 *           nullable: true
 *           example: "665e0d3b5c9a1c0012f1a666"
 *         name:
 *           type: string
 *           example: "Hamburguesa Clásica"
 *         description:
 *           type: string
 *           example: "Hamburguesa con carne, queso, lechuga y tomate"
 *         price:
 *           type: number
 *           example: 2500
 *         preparation_time_minutes:
 *           type: number
 *           example: 15
 *         stock:
 *           type: number
 *           example: 10
 *         daily_stock:
 *           type: number
 *           nullable: true
 *           example: null
 *         image_url:
 *           type: string
 *           nullable: true
 *           example: "https://miapp.com/images/hamburguesa.png"
 *         is_active:
 *           type: boolean
 *           example: true
 *         deleted_at:
 *           type: string
 *           nullable: true
 *           example: null
 *         created_at:
 *           type: string
 *           example: "2026-05-19T10:00:00.000Z"
 *         updated_at:
 *           type: string
 *           example: "2026-05-19T10:00:00.000Z"
 */

/**
 * @swagger
 * /api/menu-items:
 *   post:
 *     summary: Registrar un nuevo item del menú
 *     tags: [MenuItems]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category_id
 *               - name
 *               - description
 *               - price
 *             properties:
 *               category_id:
 *                 type: string
 *                 example: "665e0d3b5c9a1c0012f1a888"
 *               branch_id:
 *                 type: string
 *                 nullable: true
 *                 example: "665e0d3b5c9a1c0012f1a666"
 *               name:
 *                 type: string
 *                 example: "Hamburguesa Clásica"
 *               description:
 *                 type: string
 *                 example: "Hamburguesa con carne, queso, lechuga y tomate"
 *               price:
 *                 type: number
 *                 example: 2500
 *               preparation_time_minutes:
 *                 type: number
 *                 example: 15
 *               stock:
 *                 type: number
 *                 example: 10
 *               daily_stock:
 *                 type: number
 *                 nullable: true
 *                 example: null
 *               image_url:
 *                 type: string
 *                 nullable: true
 *                 example: "https://miapp.com/images/hamburguesa.png"
 *     responses:
 *       201:
 *         description: Item del menú creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItem'
 *       409:
 *         description: Nombre duplicado en menú
 *       404:
 *         description: Categoría no encontrada
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permisos (solo OWNER)
 *       500:
 *         description: Error interno del servidor
 */
MenuItemsRouter.post("/", authMiddleware, authorizeRoles("owner"), (req, res) => menuItemsController.register(req, res));

export default MenuItemsRouter;
