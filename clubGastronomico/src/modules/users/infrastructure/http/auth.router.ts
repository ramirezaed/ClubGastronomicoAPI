import { Router } from "express";
import { MongooseUserRepository } from "@/modules/users/infrastructure/persistence/user/MongooseUserRepository";
import { RegisterUserUseCase } from "@/modules/users/application/use-cases/auth/RegisterUserUseCase";
import { LoginUseCase } from "@/modules/users/application/use-cases/auth/LoginUserUseCase";
import { RefreshTokenUseCase } from "@/modules/users/application/use-cases/auth/RefreshTokenUseCase";
import { AuthController } from "@/modules/users/infrastructure/controllers/authController";
import { ValidateTokenUseCase } from "@/modules/users/application/use-cases/auth/ValidateTokenUseCase";
import { PasswordHasher } from "@/modules/users/infrastructure/services/PasswordHash";
import { MongooseRoleQueryRepository } from "@/modules/users/infrastructure/persistence/role/MongooseRoleQueryRepository";
import { JwtTokenService } from "@/modules/users/infrastructure/services/JwtTokenService";
import { ResetPasswordUseCase } from "@/modules/users/application/use-cases/auth/ResetPasswordUseCase";
import { ForgotPasswordUseCase } from "@/modules/users/application/use-cases/auth/ForgotPasswordUseCase";
import { NodemailerEmailService } from "@/modules/users/infrastructure/services/emailService";
import { ChangePasswordUseCase } from "@/modules/users/application/use-cases/user/ChangePasswordUseCase";
import { authMiddleware } from "@/shared/infraestructure/http/middleware/auth.middleware";
import { n8nRegisterNotifier } from "@/modules/users/infrastructure/services/n8nRegisterNotifier";

const router = Router();
//inyeccion de dependencias
// capa de Infraestructura (Adaptadores de salida)
//Instancia del repositorio basada en Mongoose */
const userRepository = new MongooseUserRepository();
const roleQueryRepository = new MongooseRoleQueryRepository();
const passwordHash = new PasswordHasher();
const tokenService = new JwtTokenService();
const emailService = new NodemailerEmailService();
const notifier = new n8nRegisterNotifier();

//capa de aplicacion (Casos de Uso)
//aca se define que hace
const registerUserUseCase = new RegisterUserUseCase(userRepository, passwordHash, roleQueryRepository, notifier);
const loginUseCase = new LoginUseCase(userRepository, passwordHash, tokenService);
const refreshTokenService = new RefreshTokenUseCase(tokenService);
const validateToken = new ValidateTokenUseCase(tokenService);
const forgotPasswordUseCase = new ForgotPasswordUseCase(userRepository, tokenService, emailService);
const resetPasswordUseCase = new ResetPasswordUseCase(userRepository, tokenService, passwordHash);
const changePassworduseCase = new ChangePasswordUseCase(userRepository, passwordHash);
//capa de interfaz
//se inyectan las dependencias
const authController = new AuthController(
  registerUserUseCase,
  loginUseCase,
  refreshTokenService,
  validateToken,
  forgotPasswordUseCase,
  resetPasswordUseCase,
  changePassworduseCase,
);

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
router.post("/login", (req, res) => authController.login(req, res));
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
router.post("/refreshToken", (req, res) => authController.TokenRefresh(req, res));
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
router.get("/validate", (req, res) => authController.tokenValidate(req, res));
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
router.post("/register", (req, res) => authController.register(req, res));
/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Solicitar recuperación de contraseña
 *     description: Envía un enlace con token para restablecer la contraseña si el email existe.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@gmail.com
 *                 description: Correo electrónico del usuario
 *     responses:
 *       200:
 *         description: Siempre responde OK por seguridad, incluso si el email no existe
 *       403:
 *         description: Usuario inactivo
 *       500:
 *         description: Error interno del servidor
 */
router.post("/forgot-password", (req, res) => authController.forgotPassword(req, res)); //para cmabiar la contraseña
/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Restablecer contraseña con token
 *     description: Permite establecer una nueva contraseña usando el token recibido por email.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, newPassword]
 *             properties:
 *               token:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 description: Token enviado al correo del usuario
 *               newPassword:
 *                 type: string
 *                 example: "NuevaPassword123"
 *                 description: Nueva contraseña del usuario
 *     responses:
 *       200:
 *         description: Contraseña actualizada correctamente
 *       401:
 *         description: Token inválido o expirado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.post("/reset-password", (req, res) => authController.resetPassword(req, res)); //el forgot envia el token para el reset
/**
 * @swagger
 * /api/auth/change-password:
 *   patch:
 *     summary: Cambiar contraseña del usuario autenticado
 *     description: Permite cambiar la contraseña desde dentro del sistema.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: "PasswordActual123"
 *                 description: Contraseña actual del usuario
 *               newPassword:
 *                 type: string
 *                 example: "NuevaPassword123"
 *                 description: Nueva contraseña
 *     responses:
 *       200:
 *         description: Contraseña actualizada correctamente
 *       401:
 *         description: Contraseña actual incorrecta / no autorizado
 *       403:
 *         description: Usuario inactivo
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.patch("/change-password", authMiddleware, (req, res) => authController.changePassword(req, res));
export default router;
