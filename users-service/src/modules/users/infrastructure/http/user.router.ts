import { Router } from "express";
import { MongooseUserRepository } from "@/modules/users/infrastructure/persistence/user/MongooseUserRepository";
import { MongooseRoleRepository } from "@/modules/users/infrastructure/persistence/role/MongooseRoleRepository";
import { MeUserUseCase } from "@/modules/users/application/use-cases/user/MeUserUseCase";
import { UserController } from "@/modules/users/infrastructure/controllers/UserController";
import { UpdateUserUseCase } from "@/modules/users/application/use-cases/user/UpdateUserUseCase";
import { authMiddleware } from "@/shared/infraestructure/http/middleware/auth.middleware";
import { GetAllUsersUseCase } from "@/modules/users/application/use-cases/user/GetAllUserUseCase";
import { DeleteUserUseCase } from "@/modules/users/application/use-cases/user/DeleteUserUseCase";
import { ActivateUserUseCase } from "@/modules/users/application/use-cases/user/ActivateUserUseCase";
import { DeactivateUserUseCase } from "@/modules/users/application/use-cases/user/DeactivateUserUseCase";
import { UpdateRoleUserUseCase } from "@/modules/users/application/use-cases/user/UpdateRoleUserUseCase";

const UserRouter = Router();

const userRepository = new MongooseUserRepository();
const roleRepository = new MongooseRoleRepository();

const meUserUseCase = new MeUserUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const getAllUserUseCase = new GetAllUsersUseCase(userRepository);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);
const activateUserUseCase = new ActivateUserUseCase(userRepository);
const deactivateUserUseCase = new DeactivateUserUseCase(userRepository);
const updateRoleUserUseCase = new UpdateRoleUserUseCase(userRepository, roleRepository);

const userController = new UserController(
  meUserUseCase,
  updateUserUseCase,
  getAllUserUseCase,
  deleteUserUseCase,
  activateUserUseCase,
  deactivateUserUseCase,
  updateRoleUserUseCase,
);

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *         name:
 *           type: string
 *           example: "Alejandro"
 *         lastname:
 *           type: string
 *           example: "Ramirez"
 *         email:
 *           type: string
 *           example: "ale@gmail.com"
 *         is_active:
 *           type: boolean
 *           example: true
 *         role:
 *           type: object
 *           nullable: true
 *           properties:
 *             id:
 *               type: string
 *               example: "64f1a2b3c4d5e6f7a8b9c0d2"
 *             name:
 *               type: string
 *               example: "Admin"
 *         company:
 *           type: object
 *           nullable: true
 *           properties:
 *             id:
 *               type: string
 *               example: "64f1a2b3c4d5e6f7a8b9c0d3"
 *             name:
 *               type: string
 *               example: "Empresa S.A."
 *         branch:
 *           type: object
 *           nullable: true
 *           properties:
 *             id:
 *               type: string
 *               example: "64f1a2b3c4d5e6f7a8b9c0d4"
 *             name:
 *               type: string
 *               example: "Sucursal Centro"
 */

/**
 * @swagger
 * /api/user/:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: is_active
 *         required: false
 *         schema:
 *           type: boolean
 *         description: "Sin el parámetro devuelve todos. true: activos. false: inactivos."
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lista de Usuarios"
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserResponse'
 *       500:
 *         description: Error interno del servidor
 */
UserRouter.get("/", (req, res) => userController.getAll(req, res));

/**
 * @swagger
 * /api/user/me:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Token inválido o no enviado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
UserRouter.get("/me", authMiddleware, (req, res) => userController.me(req, res));

/**
 * @swagger
 * /api/user/me:
 *   patch:
 *     summary: Actualizar nombre y apellido del usuario autenticado
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, lastname]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Alejandro"
 *               lastname:
 *                 type: string
 *                 example: "Ramirez"
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "usuario actualizado"
 *                 userActualizado:
 *                   $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Todos los datos son necesarios
 *       401:
 *         description: Token inválido o no enviado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
UserRouter.patch("/me", authMiddleware, (req, res) => userController.update(req, res));

/**
 * @swagger
 * /api/user/activate/{id}:
 *   patch:
 *     summary: Activar cuenta de un usuario
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *         description: ID del usuario a activar
 *     responses:
 *       200:
 *         description: Usuario activado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "usuario activado"
 *                 userActualizado:
 *                   $ref: '#/components/schemas/UserResponse'
 *       404:
 *         description: Usuario no encontrado
 *       409:
 *         description: El usuario ya se encuentra activo
 *       500:
 *         description: Error interno del servidor
 */
UserRouter.patch("/activate/:id", (req, res) => userController.activate(req, res));

/**
 * @swagger
 * /api/user/deactivate/{id}:
 *   patch:
 *     summary: Desactivar cuenta de un usuario
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *         description: ID del usuario a desactivar
 *     responses:
 *       200:
 *         description: Usuario desactivado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "usuario Desactivado"
 *                 userActualizado:
 *                   $ref: '#/components/schemas/UserResponse'
 *       404:
 *         description: Usuario no encontrado
 *       409:
 *         description: El usuario ya se encuentra inactivo
 *       500:
 *         description: Error interno del servidor
 */
UserRouter.patch("/deactivate/:id", (req, res) => userController.deactivate(req, res));

/**
 * @swagger
 * /api/user/role/{id}:
 *   patch:
 *     summary: Cambiar el rol de un usuario
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role_id]
 *             properties:
 *               role_id:
 *                 type: string
 *                 example: "64f1a2b3c4d5e6f7a8b9c0d2"
 *                 description: ID del nuevo rol
 *     responses:
 *       200:
 *         description: Rol actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userActualizado:
 *                   $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: role_id es requerido o el rol no existe
 *       404:
 *         description: Usuario no encontrado
 *       409:
 *         description: Error al actualizar el rol
 *       500:
 *         description: Error interno del servidor
 */
UserRouter.patch("/role/:id", (req, res) => userController.updateRole(req, res));

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: Eliminar un usuario (soft delete)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario Eliminado"
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
UserRouter.delete("/:id", (req, res) => userController.softDelete(req, res));

export default UserRouter;
