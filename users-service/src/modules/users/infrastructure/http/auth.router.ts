import { Router } from "express";
import { MongooseUserRepository } from "@/modules/users/infrastructure/persistence/user/MongooseUserRepository";
import { RegisterUser } from "@/modules/users/application/use-cases/auth/RegisterUserUseCase";
import { LoginUseCase } from "@/modules/users/application/use-cases/auth/LoginUserUseCase";
import { RefreshTokenUseCase } from "@/modules/users/application/use-cases/auth/RefreshTokenUseCase";
import { AuthController } from "@/modules/users/infrastructure/controllers/authController";
import { ValidateTokenUseCase } from "@/modules/users/application/use-cases/auth/ValidateTokenUseCase";
import { UpdateUserUseCase } from "@/modules/users/application/use-cases/user/UpdateUserUseCase";
import { GetAllUsersUseCase } from "@/modules/users/application/use-cases/user/GetAllUserUseCase";
import { HttpCompanyBranchService } from "@/modules/users/infrastructure/services/HttpCompanyBranchService";
import { ChangeStatusUserUseCase } from "@/modules/users/application/use-cases/user/ChangeStatusUserUseCase";
import { MeUserUseCase } from "@/modules/users/application/use-cases/user/MeUserUseCase";
import { UpdateRoleUserUseCase } from "@/modules/users/application/use-cases/user/UpdateRoleUserUseCase";
import { MongooseRoleRepository } from "@/modules/users/infrastructure/persistence/role/MongooseRoleRepository";
import { DeleteUserUseCase } from "@/modules/users/application/use-cases/user/DeleteUserUseCase";

const router = Router();
//inyeccion de dependencias

// capa de Infraestructura (Adaptadores de salida)
//Instancia del repositorio basada en Mongoose */
const userRepository = new MongooseUserRepository();
const roleRepository = new MongooseRoleRepository();
//capa de aplicacion (Casos de Uso)
//aca se define que hace
const registerUserUseCase = new RegisterUser(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const companyBranchService = new HttpCompanyBranchService();
const getAllUserUseCase = new GetAllUsersUseCase(userRepository, companyBranchService);
const changeStatusUseCase = new ChangeStatusUserUseCase(userRepository);
const updateRoleUserUseCase = new UpdateRoleUserUseCase(userRepository, roleRepository);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);
///////////////////////////////
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
  getAllUserUseCase,
  changeStatusUseCase,
  updateRoleUserUseCase,
  deleteUserUseCase,
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

/**
 * @swagger
 * /api/auth/me/{id}:
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
 * /api/auth/role/{id}:
 *   patch:
 *     summary: Actualizar el rol de un usuario
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
 *                 example: "64f1a2b3c4d5e6f7a8b9c0d3"
 *                 description: ID del nuevo rol a asignar
 *     responses:
 *       200:
 *         description: Rol actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userActaulizado:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *                     name:
 *                       type: string
 *                       example: "Alejandro"
 *                     email:
 *                       type: string
 *                       example: "ale@gmail.com"
 *                     role_id:
 *                       type: string
 *                       example: "64f1a2b3c4d5e6f7a8b9c0d3"
 *       400:
 *         description: Campos requeridos faltantes o rol no existe
 *       404:
 *         description: Usuario no encontrado
 *       409:
 *         description: Error al actualizar el rol
 *       500:
 *         description: Error interno del servidor
 */
/**
 * @swagger
 * /api/auth/{id}:
 *   delete:
 *     summary: Eliminar un usuario (soft delete)
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
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario Eliminado"
 *       404:
 *         description: El usuario que buscas no existe o fue eliminado
 *       500:
 *         description: Error interno del servidor
 */
//iniciar sesion
router.post("/login", (req, res) => authController.login(req, res));
//toekn nuevo cada 15 minutos
router.post("/refreshToken", (req, res) => authController.TokenRefresh(req, res));
//valida token de microservicios externos
router.get("/validate", (req, res) => authController.tokenValidate(req, res));
//
//
//crea cuenta de usuario con role owner y is_active=false
router.post("/register", (req, res) => authController.register(req, res));

//lista de usuarios, con filtro por estado, true o false
router.get("/users", (req, res) => authController.getAll(req, res));
//activar o desactivar una cuenta de usuario
router.patch("/changeStatus/:id", (req, res) => authController.changeStatus(req, res));
//cambia rol de usuario
router.patch("/role/:id", (req, res) => authController.updateRole(req, res));
// elimina usuario
router.delete("/:id", (req, res) => authController.softDelete(req, res));

export default router;
