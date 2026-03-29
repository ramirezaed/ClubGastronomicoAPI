import { Router } from "express";
import { MongooseRoleRepository } from "@/modules/users/infrastructure/persistence/MongooseRoleRepository";
import { RegisterRole } from "@/modules/users/application/use-cases/role/RegisterRole";
import { RoleController } from "@/modules/users/infrastructure/controllers/RoleController";

const RoleRouter = Router();
const roleRepository = new MongooseRoleRepository();
const registerRoleUseCase = new RegisterRole(roleRepository);
const roleController = new RoleController(registerRoleUseCase);

/**
 * @swagger
 * components:
 *   schemas:
 *     Rol:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *         name:
 *           type: string
 *           example: "owner"
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *           example: ["manage_branch", "manage_employees"]
 *         description:
 *           type: string
 *           example: "Propietario de la empresa"
 *         is_active:
 *           type: boolean
 *           example: true
 */

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Registrar un nuevo rol
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, permissions, description]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "owner"
 *                 description: Nombre del rol
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["manage_branch", "manage_employees"]
 *                 description: Lista de permisos del rol
 *               description:
 *                 type: string
 *                 example: "Propietario de la empresa"
 *                 description: Descripción del rol
 *               is_active:
 *                 type: boolean
 *                 example: true
 *                 description: Estado del rol (por defecto true)
 *     responses:
 *       201:
 *         description: Nuevo rol registrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: nuevo rol registrado
 *                 rol:
 *                   $ref: '#/components/schemas/Rol'
 *       400:
 *         description: Todos los datos son necesarios
 *       409:
 *         description: Ya existe un rol registrado con ese nombre
 *       500:
 *         description: No se pudo registrar el rol
 */

RoleRouter.post("/", (req, res) => roleController.register(req, res));

export default RoleRouter;
