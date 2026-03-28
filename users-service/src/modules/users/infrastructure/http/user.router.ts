// aca va la ruta
import { Router } from "express";
import { MongooseUserRepository } from "@infra/persistence/MongooseUserRepository";
import { RegisterUser } from "@application/use-cases/RegisterUser";
import { UserController } from "@infra/controllers/UserController";

const router = Router();

const userRepository = new MongooseUserRepository();
const registerUserUseCase = new RegisterUser(userRepository);
const userController = new UserController(registerUserUseCase);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, lastname, email, password, role_id]
 *             properties:
 *               company_id:
 *                 type: string
 *                 nullable: true
 *                 example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *                 description: ID de la empresa (opcional)
 *               branch_id:
 *                 type: string
 *                 nullable: true
 *                 example: "64f1a2b3c4d5e6f7a8b9c0d2"
 *                 description: ID de la sucursal (opcional)
 *               name:
 *                 type: string
 *                 example: Alejandro
 *                 description: Nombre del usuario
 *               lastname:
 *                 type: string
 *                 example: Ramirez
 *                 description: Apellido del usuario
 *               email:
 *                 type: string
 *                 example: ale@gmail.com
 *                 description: Correo electrónico del usuario
 *               password:
 *                 type: string
 *                 example: "123456"
 *                 description: Contraseña del usuario
 *               role_id:
 *                 type: string
 *                 example: "64f1a2b3c4d5e6f7a8b9c0d3"
 *                 description: ID del rol del usuario
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Todos los campos son requeridos
 *       409:
 *         description: El correo ya está registrado
 *       500:
 *         description: No se pudo completar el registro de usuario
 */

router.post("/register", (req, res) => userController.register(req, res));

export default router;
