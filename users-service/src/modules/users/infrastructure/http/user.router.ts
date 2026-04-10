import { Router } from "express";
import { MongooseUserRepository } from "@/modules/users/infrastructure/persistence/user/MongooseUserRepository";
import { MeUserUseCase } from "@/modules/users/application/use-cases/user/MeUserUseCase";
import { UserController } from "@/modules/users/infrastructure/controllers/UserController";
import { UpdateUserUseCase } from "@/modules/users/application/use-cases/user/UpdateUserUseCase";
import { authMiddleware } from "@/shared/infraestructure/http/middleware/auth.middleware";

const UserRouter = Router();
//inyeccion de dependencias
//Instancia del repositorio basada en Mongoose */
const userRepository = new MongooseUserRepository();

//capa de aplicacion (Casos de Uso)
//aca se define que hace
const meUserUseCase = new MeUserUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
//capa de interfaz
//se inyectan las dependencias
const userController = new UserController(meUserUseCase, updateUserUseCase);

/**
 * @swagger
 * /api/user/me/{id}:
 *   get:
 *     summary: Obtener datos del usuario autenticado
 *     tags: [Auth]
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
 *     responses:
 *       200:
 *         description: Datos del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *                 name:
 *                   type: string
 *                   example: "Alejandro"
 *                 lastname:
 *                   type: string
 *                   example: "Ramirez"
 *                 email:
 *                   type: string
 *                   example: "ale@gmail.com"
 *                 is_active:
 *                   type: boolean
 *                   example: true
 *                 role:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "64f1a2b3c4d5e6f7a8b9c0d3"
 *                     name:
 *                       type: string
 *                       example: "Admin"
 *                 company:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                       example: "Empresa S.A."
 *                 branch:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                       example: "Sucursal Centro"
 *       404:
 *         description: El usuario que buscas no existe o fue eliminado
 *       500:
 *         description: Error interno del servidor
 */
/**
 * @swagger
 * /api/user/{id}:
 *   patch:
 *     summary: Actualizar datos del usuario
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *         description: ID del usuario a actualizar
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
 *                 example: Alejandro
 *                 description: Nuevo nombre del usuario
 *               lastname:
 *                 type: string
 *                 example: Ramirez
 *                 description: Nuevo apellido del usuario
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
 *                   example: usuario actualizado
 *                 userActualizado:
 *                   type: object
 *                   description: Usuario actualizado
 *       400:
 *         description: Todos los datos son necesarios
 *       404:
 *         description: El usuario no existe o fue eliminado
 *       500:
 *         description: Error interno del servidor
 */
//perfil de usuario
UserRouter.get("/me", authMiddleware, (req, res) => userController.me(req, res));
//modifica datos de usuario, nombre apellido
UserRouter.patch("/:id", (req, res) => userController.update(req, res));
export default UserRouter;
