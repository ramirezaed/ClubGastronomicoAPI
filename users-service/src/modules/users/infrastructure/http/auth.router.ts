import { Router } from "express";
import { MongooseUserRepository } from "@infra/persistence/MongooseUserRepository";
import { RegisterUser } from "@/modules/users/application/use-cases/RegisterUserUseCase";
import { LoginUseCase } from "@/modules/users/application/use-cases/LoginUserUseCase";
import { RefreshTokenUseCase } from "@/modules/users/application/use-cases/RefreshTokenUseCase";
import { AuthController } from "@/modules/users/infrastructure/controllers/authController";
import { ValidateTokenUseCase } from "@/modules/users/application/use-cases/ValidateTokenUseCase";

const router = Router();

const userRepository = new MongooseUserRepository();

const registerUserUseCase = new RegisterUser(userRepository);
const loginUseCase = new LoginUseCase(userRepository);
const refreshToken = new RefreshTokenUseCase();
const validateToken = new ValidateTokenUseCase();
const authController = new AuthController(
  registerUserUseCase,
  loginUseCase,
  refreshToken,
  validateToken,
);

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
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: ale@gmail.com
 *                 description: Correo electrónico del usuario
 *               password:
 *                 type: string
 *                 example: "123456"
 *                 description: Contraseña del usuario
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                   description: Token de acceso (expira en 15min)
 *                 refreshToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                   description: Token de refresco (expira en 7d)
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *                     company_id:
 *                       type: string
 *                       nullable: true
 *                       example: "64f1a2b3c4d5e6f7a8b9c0d2"
 *                     branch_id:
 *                       type: string
 *                       nullable: true
 *                       example: "64f1a2b3c4d5e6f7a8b9c0d3"
 *                     name:
 *                       type: string
 *                       example: Alejandro
 *                     email:
 *                       type: string
 *                       example: ale@gmail.com
 *                     role_id:
 *                       type: string
 *                       example: "64f1a2b3c4d5e6f7a8b9c0d4"
 *       400:
 *         description: Todos los campos son requeridos
 *       401:
 *         description: Credenciales inválidas
 *       403:
 *         description: Usuario inactivo
 *       500:
 *         description: Error interno del servidor
 */
/**
 * @swagger
 * /api/auth/refreshToken:
 *   post:
 *     summary: Obtener nuevo access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 description: Token de refresco obtenido en el login
 *     responses:
 *       200:
 *         description: Nuevo access token generado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                   description: Nuevo token de acceso (expira en 15min)
 *       400:
 *         description: refreshToken requerido
 *       401:
 *         description: Refresh token inválido o expirado
 */
/**
 * @swagger
 * /api/auth/validate:
 *   get:
 *     summary: Validar access token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         description: Token de acceso en formato Bearer
 *     responses:
 *       200:
 *         description: Token válido, retorna el payload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *                 email:
 *                   type: string
 *                   example: "ale@gmail.com"
 *                 role_id:
 *                   type: string
 *                   example: "64f1a2b3c4d5e6f7a8b9c0d3"
 *       401:
 *         description: Token ausente o inválido/expirado
 *       500:
 *         description: Error interno del servidor
 */
router.post("/register", (req, res) => authController.register(req, res));
router.post("/login", (req, res) => authController.login(req, res));
router.post("/refreshToken", (req, res) =>
  authController.TokenRefresh(req, res),
);
router.get("/validate", (req, res) => authController.tokenValidate(req, res));

export default router;
