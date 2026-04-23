import { Router } from "express";
import { MongooseRoleRepository } from "@/modules/users/infrastructure/persistence/role/MongooseRoleRepository";
import { RegisterRole } from "@/modules/users/application/use-cases/role/RegisterRole";
import { RoleController } from "@/modules/users/infrastructure/controllers/RoleController";
import { GetAllRoles } from "@/modules/users/application/use-cases/role/GetAllRoles";
import { GetRoleById } from "@/modules/users/application/use-cases/role/GetRoleById";
import { UpdateRole } from "@/modules/users/application/use-cases/role/updateRole";
import { DeleteRole } from "@/modules/users/application/use-cases/role/DeleteRole";
import { ActivateRoleUseCase } from "@/modules/users/application/use-cases/role/ActivcateRoleUseCase";
import { DeactivateRoleUserUseCase } from "@/modules/users/application/use-cases/role/DeactivateRoleUseCase";
import { MongooseRoleQueryRepository } from "@/modules/users/infrastructure/persistence/role/MongooseRoleQueryRepository";

const RoleRouter = Router();
//inyeccion de dependencias

// capa de Infraestructura (Adaptadores de salida)
//Instancia del repositorio basada en Mongoose */
const roleRepository = new MongooseRoleRepository();
const roleQueryRepository = new MongooseRoleQueryRepository();
//capa de aplicacion (Casos de Uso)
//aca se define que hace
const getAllRolesUseCase = new GetAllRoles(roleQueryRepository);
const getRoleByIdUseCase = new GetRoleById(roleQueryRepository);
const registerRoleUseCase = new RegisterRole(roleRepository, roleQueryRepository);
// const getAllRolesUseCase = new GetAllRoles(roleQueryRepository);
// const getRoleByIdUseCase = new GetRoleById(roleQueryRepository);
const updateRoleUseCase = new UpdateRole(roleRepository);
const deleteRoleUseCase = new DeleteRole(roleRepository);
const activateRoleUseCase = new ActivateRoleUseCase(roleRepository);
const deactivateRoleUseCase = new DeactivateRoleUserUseCase(roleRepository);
//capa de interfaz
//se inyectan las dependencias
const roleController = new RoleController(
  registerRoleUseCase,
  updateRoleUseCase,
  getRoleByIdUseCase,
  getAllRolesUseCase,
  deleteRoleUseCase,
  activateRoleUseCase,
  deactivateRoleUseCase,
);

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
/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Obtener todos los roles
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: Lista de roles obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: roles
 *                 roles:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Rol'
 *       404:
 *         description: No existen roles registrados
 *       500:
 *         description: Error interno del servidor
 */
/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Obtener un rol por ID
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del rol
 *         schema:
 *           type: string
 *           example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *     responses:
 *       200:
 *         description: Rol encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Rol
 *                 rol:
 *                   $ref: '#/components/schemas/Rol'
 *       404:
 *         description: El rol no existe
 *       500:
 *         description: Error interno del servidor
 */
/**
 * @swagger
 * /api/roles/{id}:
 *   patch:
 *     summary: Actualizar un rol existente (no se puede modificar el nombre)
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del rol a actualizar
 *         schema:
 *           type: string
 *           example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *     requestBody:
 *       required: true
 *       description: Solo se pueden actualizar permisos y descripción
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["manage_employees"]
 *                 description: Lista de permisos del rol
 *               description:
 *                 type: string
 *                 example: "Encargado del negocio"
 *                 description: Descripción del rol
 *               is_active:
 *                 type: boolean
 *                 example: true
 *                 description: Estado del rol (true para activar, false para desactivar
 *     responses:
 *       200:
 *         description: Rol actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: rol actualizado
 *                 rolActualizado:
 *                   $ref: '#/components/schemas/Rol'
 *       404:
 *         description: El rol no existe
 *       500:
 *         description: No se pudo actualizar el rol
 */
/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Eliminar rol (Soft delete)
 *     description: Marca el rol con deleted_at sin eliminarlo físicamente.
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Rol eliminado correctamente
 *       404:
 *         description: El rol no existe
 *       500:
 *         description: Error interno
 */
/**
 * @swagger
 * /api/roles/activate/{id}:
 *   patch:
 *     summary: Activar un rol existente
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del rol a activar
 *         schema:
 *           type: string
 *           example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *     responses:
 *       200:
 *         description: Rol activado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Rol activado correctamente
 *                 response:
 *                   $ref: '#/components/schemas/Rol'
 *       404:
 *         description: El rol no existe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: El rol que intentás consultar no existe.
 *       409:
 *         description: El rol ya se encuentra activo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: El rol ya se encuentra activo.
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: error interno del servidor
 */
/**
 * @swagger
 * /api/roles/deactivate/{id}:
 *   patch:
 *     summary: Desactivar un rol existente
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del rol a desactivar
 *         schema:
 *           type: string
 *           example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *     responses:
 *       200:
 *         description: Rol desactivado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Rol desactivado correctamente
 *                 response:
 *                   $ref: '#/components/schemas/Rol'
 *       404:
 *         description: El rol no existe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: El rol que intentás consultar no existe.
 *       409:
 *         description: El rol ya se encuentra desactivado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: El rol ya se encuentra desactivado.
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: error interno del servidor
 */

//registrar nuevo Rol
RoleRouter.post("/", (req, res) => roleController.register(req, res));
// obtener todos los roles
RoleRouter.get("/", (req, res) => roleController.getAll(req, res));
// obtener rol por id
RoleRouter.get("/:id", (req, res) => roleController.getRoleByID(req, res));
// actualizar rol
RoleRouter.patch("/:id", (req, res) => roleController.update(req, res));
//activar rol
RoleRouter.patch("/activate/:id", (req, res) => roleController.activate(req, res));
//desactivar rol
RoleRouter.patch("/deactivate/:id", (req, res) => roleController.deactivate(req, res));
// eliminar rol
RoleRouter.delete("/:id", (req, res) => roleController.softDelete(req, res));
export default RoleRouter;
