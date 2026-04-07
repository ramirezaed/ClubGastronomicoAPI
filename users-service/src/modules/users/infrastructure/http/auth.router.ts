import { Router } from "express";
import { MongooseUserRepository } from "@infra/persistence/MongooseUserRepository";
import { RegisterUser } from "@/modules/users/application/use-cases/RegisterUserUseCase";
import { LoginUseCase } from "@/modules/users/application/use-cases/LoginUserUseCase";
import { RefreshTokenUseCase } from "@/modules/users/application/use-cases/RefreshTokenUseCase";
import { AuthController } from "@/modules/users/infrastructure/controllers/authController";
import { ValidateTokenUseCase } from "@/modules/users/application/use-cases/ValidateTokenUseCase";
import { UpdateUserUseCase } from "@/modules/users/application/use-cases/UpdateUserUseCase";
import { GetAllUsersUseCase } from "@/modules/users/application/use-cases/GetAllUserUseCase";
import { HttpCompanyBranchService } from "@/modules/users/infrastructure/services/HttpCompanyBranchService";
import { ChangeStatusUserUseCase } from "@/modules/users/application/use-cases/ChangeStatusUserUseCase";

const router = Router();
//inyeccion de dependencias

// capa de Infraestructura (Adaptadores de salida)
//Instancia del repositorio basada en Mongoose */
const userRepository = new MongooseUserRepository();
//capa de aplicacion (Casos de Uso)
//aca se define que hace
const registerUserUseCase = new RegisterUser(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const companyBranchService = new HttpCompanyBranchService();
const getAllUserUseCase = new GetAllUsersUseCase(userRepository, companyBranchService);
const changeStatusUseCase = new ChangeStatusUserUseCase(userRepository);
const loginUseCase = new LoginUseCase(userRepository);
const refreshToken = new RefreshTokenUseCase();
const validateToken = new ValidateTokenUseCase();
//capa de interfaz
//se inyectan las dependencias
const authController = new AuthController(
  registerUserUseCase,
  loginUseCase,
  refreshToken,
  validateToken,
  updateUserUseCase,
  getAllUserUseCase,
  changeStatusUseCase,
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
/**
 * @swagger
 * /api/auth/update/{id}:
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
/**
 * @swagger
 * /api/auth/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: is_active
 *         required: false
 *         schema:
 *           type: boolean
 *         description: "Filtra por estado. Sin el param: todos. true: activos. false: inactivos."
 *     responses:
 *       200:
 *         description: Lista de usuarios con rol, empresa y sucursal
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *                   name:
 *                     type: string
 *                     example: "Alejandro"
 *                   lastname:
 *                     type: string
 *                     example: "Ramirez"
 *                   email:
 *                     type: string
 *                     example: "ale@gmail.com"
 *                   is_active:
 *                     type: boolean
 *                     example: true
 *                   role:
 *                     type: object
 *                     nullable: true
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                         example: "Admin"
 *                   company:
 *                     type: object
 *                     nullable: true
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                         example: "Empresa S.A."
 *                   branch:
 *                     type: object
 *                     nullable: true
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                         example: "Sucursal Centro"
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /api/auth/changeStatus/{id}:
 *   patch:
 *     summary: Cambiar estado activo/inactivo de un usuario
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
 *         description: Estado cambiado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Estado actualizado correctamente"
 *                 is_active:
 *                   type: boolean
 *                   example: false
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.post("/register", (req, res) => authController.register(req, res));
router.post("/login", (req, res) => authController.login(req, res));
router.post("/refreshToken", (req, res) => authController.TokenRefresh(req, res));
router.get("/validate", (req, res) => authController.tokenValidate(req, res));
router.patch("/update/:id", (req, res) => authController.update(req, res));
router.get("/users", (req, res) => authController.getAll(req, res));
router.patch("/changeStatus/:id", (req, res) => authController.changeStatus(req, res));
export default router;
