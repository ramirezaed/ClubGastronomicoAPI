import { ActivateMenuItemsUseCase } from "@/modules/users/application/use-cases/MenuItems/activateMenuItemsUseCase";
import { deactivaMenuItemsUseCase } from "@/modules/users/application/use-cases/MenuItems/deactivateMenuItemsUseCase";
import { RegisterMenuItemsUseCase } from "@/modules/users/application/use-cases/MenuItems/registerMenuItemsUseCase";
import { UpdateMenuItemsUseCase } from "@/modules/users/application/use-cases/MenuItems/updateMenuItemsUseCase";
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
const updateMenu = new UpdateMenuItemsUseCase(menuRepository);
const activateMenu = new ActivateMenuItemsUseCase(menuRepository);
const deactivateMenu = new deactivaMenuItemsUseCase(menuRepository);
//capa de interfaz

const menuItemsController = new MenuItemsController(registerMenu, updateMenu, activateMenu, deactivateMenu);

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

/**
 * @swagger
 * /api/menu-items/{id}:
 *   patch:
 *     summary: Actualizar un item del menú
 *     tags: [MenuItems]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del item del menú a actualizar
 *         example: "665e0d3b5c9a1c0012f1a999"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Se pueden enviar solo los campos a modificar
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
 *                 example: "Hamburguesa Doble"
 *               description:
 *                 type: string
 *                 example: "Hamburguesa doble carne con cheddar"
 *               price:
 *                 type: number
 *                 example: 3200
 *               preparation_time_minutes:
 *                 type: number
 *                 example: 20
 *               stock:
 *                 type: number
 *                 example: 25
 *               daily_stock:
 *                 type: number
 *                 nullable: true
 *                 example: 50
 *               image_url:
 *                 type: string
 *                 nullable: true
 *                 example: "https://miapp.com/images/hamburguesa-doble.png"
 *               is_active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Item del menú actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItem'
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tiene permisos (solo OWNER)
 *       404:
 *         description: Item del menú no encontrado o inactivo
 *       500:
 *         description: Error interno del servidor
 */
MenuItemsRouter.patch("/:id", authMiddleware, authorizeRoles("owner"), (req, res) => menuItemsController.update(req, res));

/**
 * @swagger
 * /api/menu-items/activate/{id}:
 *   patch:
 *     summary: Activar un item del menú
 *     tags: [MenuItems]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del item del menú
 *         example: "665e0d3b5c9a1c0012f1a999"
 *     responses:
 *       200:
 *         description: Item del menú activado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItem'
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tiene permisos (solo OWNER)
 *       404:
 *         description: Item del menú no encontrado
 *       409:
 *         description: El item ya se encuentra activo
 *       500:
 *         description: Error interno del servidor
 */
MenuItemsRouter.patch("/activate/:id", authMiddleware, authorizeRoles("owner"), (req, res) =>
  menuItemsController.activate(req, res),
);

/**
 * @swagger
 * /api/menu-items/deactiate/{id}:
 *   patch:
 *     summary: Desactivar un item del menú
 *     tags: [MenuItems]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del item del menú
 *         example: "665e0d3b5c9a1c0012f1a999"
 *     responses:
 *       200:
 *         description: Item del menú desactivado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItem'
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tiene permisos (solo OWNER)
 *       404:
 *         description: Item del menú no encontrado
 *       409:
 *         description: El item ya se encuentra inactivo
 *       500:
 *         description: Error interno del servidor
 */
MenuItemsRouter.patch("/deactiate/:id", authMiddleware, authorizeRoles("owner"), (req, res) =>
  menuItemsController.deactivate(req, res),
);
export default MenuItemsRouter;
