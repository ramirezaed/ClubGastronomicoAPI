import { ActivateMenuItemsUseCase } from "@/modules/users/application/use-cases/MenuItems/activateMenuItemsUseCase";
import { deactivaMenuItemsUseCase } from "@/modules/users/application/use-cases/MenuItems/deactivateMenuItemsUseCase";
import { getAllMenuItemsUseCase } from "@/modules/users/application/use-cases/MenuItems/getAllMenuItemsUseCase";
import { getAllForBotUseCase } from "@/modules/users/application/use-cases/MenuItems/GetByIdMenuItemsForBotUseCase";
import { getByIdMenuItemsUseCase } from "@/modules/users/application/use-cases/MenuItems/getByIdMenuItemsUseCase";
import { RegisterMenuItemsUseCase } from "@/modules/users/application/use-cases/MenuItems/registerMenuItemsUseCase";
import { softDeleteMenuItemsUseCase } from "@/modules/users/application/use-cases/MenuItems/softDeleteMenuItemsUseCase";
import { UpdateMenuItemsUseCase } from "@/modules/users/application/use-cases/MenuItems/updateMenuItemsUseCase";
import { MenuItemsController } from "@/modules/users/infrastructure/controllers/MenuItemsController";
import { CategoryRepository } from "@/modules/users/infrastructure/persistence/categoryItems/categoryRepository";
import { MenuItemsQueryRepository } from "@/modules/users/infrastructure/persistence/MenuItems/MenuItemsQueryRepository";
import { MenuItemsRepository } from "@/modules/users/infrastructure/persistence/MenuItems/MenuItemsRepository";
import { authMiddleware } from "@/shared/infraestructure/http/middleware/auth.middleware";
import { authorizeRoles } from "@/shared/infraestructure/http/middleware/authorize.middleware";
import { Router } from "express";

const MenuItemsRouter = Router();

//capa de infraestructura

const menuRepository = new MenuItemsRepository();
const menuQueryRepository = new MenuItemsQueryRepository();
const categoryQueryRepository = new CategoryRepository();

//capa de apliacion (casos de uso)

const registerMenu = new RegisterMenuItemsUseCase(menuRepository, menuQueryRepository, categoryQueryRepository);
const updateMenu = new UpdateMenuItemsUseCase(menuRepository);
const activateMenu = new ActivateMenuItemsUseCase(menuRepository);
const deactivateMenu = new deactivaMenuItemsUseCase(menuRepository);
const softDelete = new softDeleteMenuItemsUseCase(menuRepository);
const getByIdMenu = new getByIdMenuItemsUseCase(menuQueryRepository);
const getAllMenu = new getAllMenuItemsUseCase(menuQueryRepository);
const getAllForBot = new getAllForBotUseCase(menuQueryRepository);

//capa de interfaz

const menuItemsController = new MenuItemsController(
  registerMenu,
  updateMenu,
  activateMenu,
  deactivateMenu,
  softDelete,
  getByIdMenu,
  getAllMenu,
  getAllForBot,
);

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
 * /api/menu-items/{id}:
 *   get:
 *     summary: Obtener un item del menú por ID
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
 *         description: Item del menú obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItem'
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tiene permisos (solo OWNER)
 *       404:
 *         description: Item del menú o categoría no encontrada
 *       500:
 *         description: Error interno del servidor
 */
MenuItemsRouter.get("/:id", authMiddleware, authorizeRoles("owner"), (req, res) => menuItemsController.getById(req, res));

/**
 * @swagger
 * /api/menu-items:
 *   get:
 *     summary: Obtener lista de items del menú con filtros y paginación
 *     tags: [MenuItems]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: is_active
 *         schema:
 *           type: boolean
 *           example: true
 *         description: Filtrar por estado activo/inactivo
 *
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *           example: "hamburguesa"
 *         description: Filtrar por nombre (búsqueda parcial)
 *
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Número de página (por defecto 1)
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Cantidad de resultados por página (por defecto 10)
 *
 *     responses:
 *       200:
 *         description: Lista de items del menú obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MenuItem'
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
 *                       example: 42
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tiene permisos (solo OWNER)
 *       500:
 *         description: Error interno del servidor
 */
MenuItemsRouter.get("/", authMiddleware, authorizeRoles("owner", "Employee"), (req, res) => menuItemsController.getAll(req, res));

/**
 * @swagger
 * /api/menu-items/bot:
 *   get:
 *     summary: Obtener items del menú para el bot
 *     description: Devuelve todos los items del menú de la compañía autenticada para consumo del bot.
 *     tags: [MenuItems]
 *     responses:
 *       200:
 *         description: Lista de items del menú obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MenuItem'
 *
 *       404:
 *         description: No se encontraron items del menú
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Menu items not found"
 *
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "error interno del servidor"
 */
MenuItemsRouter.get("/bot", (req, res) => menuItemsController.getAllforBot(req, res));

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
MenuItemsRouter.patch("/deactivate/:id", authMiddleware, authorizeRoles("owner"), (req, res) =>
  menuItemsController.deactivate(req, res),
);
/**
 * @swagger
 * /api/menu-items/{id}:
 *   delete:
 *     summary: Eliminar (soft delete) un item del menú
 *     description: Marca el item como eliminado seteando el campo deleted_at sin borrarlo físicamente.
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
 *         description: Item eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: items eliminado con exito
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tiene permisos (solo OWNER)
 *       404:
 *         description: Item del menú no encontrado
 *       500:
 *         description: Error interno del servidor
 */
MenuItemsRouter.delete("/:id", authMiddleware, authorizeRoles("owner"), (req, res) => menuItemsController.softDelete(req, res));

export default MenuItemsRouter;
