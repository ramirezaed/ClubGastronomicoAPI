import { Request, Response } from "express";

import { RegisterRole } from "@/modules/users/application/use-cases/role/RegisterRole";
import { UpdateRole } from "@/modules/users/application/use-cases/role/updateRole";
import { IRegisterRoleDTO } from "@/modules/users/application/dtos/role/RegisterRoleDTO";
import { IUpdateRoleDTO } from "@/modules/users/application/dtos/role/UpdateRoleDTO";
import { RegisterRoleError } from "@/modules/users/domain/exceptions/role/RegisterRoleError";
import { DuplicateNameError } from "@/modules/users/domain/exceptions/role/DuplicateNameError";
import { RoleNotExistsError } from "@/modules/users/domain/exceptions/role/RoleNotExistsError";
import { UpdateRoleError } from "@/modules/users/domain/exceptions/role/UpdateRoleError";
import { GetRoleById } from "@/modules/users/application/use-cases/role/GetRoleById";
import { GetAllRoles } from "@/modules/users/application/use-cases/role/GetAllRoles";
import { RolesNotFoundError } from "@/modules/users/domain/exceptions/role/RolesNotFoundError";
import { DeleteRole } from "@/modules/users/application/use-cases/role/DeleteRole";

export class RoleController {
  constructor(
    private readonly registerRole: RegisterRole,
    private readonly updateRole: UpdateRole,
    private readonly getRoleByid: GetRoleById,
    private readonly getAllRoles: GetAllRoles,
    private readonly deleteRole: DeleteRole,
  ) {}

  async register(req: Request, res: Response) {
    //en lugar de hacer const data = req.body as IRegisterRoleDTO;
    //se tipa como el RoleDTO para asugurar la forma esperada
    const { name, permissions, description, is_active } =
      req.body as IRegisterRoleDTO;
    if (!name || !permissions || !description) {
      res.status(400).json({ message: "Todos los datos son necesarios" });
      return;
    }

    if (!Array.isArray(permissions)) {
      res.status(400).json({ message: "permissions debe ser un array" });
      return;
    }
    //ejecuto el caso de uso registrarRol
    try {
      const rol = await this.registerRole.execute({
        name,
        permissions,
        description,
        is_active,
      });
      res.status(201).json({ message: "nuevo rol registrado", rol });
    } catch (error) {
      if (error instanceof DuplicateNameError) {
        res.status(409).json({ message: error.message });
      }
      if (error instanceof RegisterRoleError) {
        res.status(500).json({ message: error.message });
      }
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
  async update(req: Request, res: Response) {
    const id = req.params.id as string;
    const { permissions, description, is_active } = req.body as IUpdateRoleDTO;

    try {
      const rolActualizado = await this.updateRole.execute(id, {
        permissions,
        description,
        is_active,
      });
      res.status(200).json({ message: "rol actualizado", rolActualizado });
    } catch (error) {
      if (error instanceof RoleNotExistsError) {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error instanceof UpdateRoleError) {
        res.status(500).json({ message: error.message });
      }
    }
  }
  async getRoleByID(req: Request, res: Response) {
    const id = req.params.id as string;
    // const id = req.params;
    try {
      const rol = await this.getRoleByid.execute(id);
      return res.status(200).json({ message: "Rol", rol });
    } catch (error) {
      if (error instanceof RoleNotExistsError) {
        res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
  async getAll(req: Request, res: Response) {
    try {
      const roles = await this.getAllRoles.execute();
      return res.status(200).json({ message: "roles", roles });
    } catch (error) {
      if (error instanceof RolesNotFoundError) {
        res.status(404).json({ message: error.message });
      }
    }
    return res.status(500).json({ message: "error interno del servidor" });
  }
  async softDelete(req: Request, res: Response) {
    const id = req.params.id as string;
    try {
      await this.deleteRole.execute(id);
      return res.status(204).json({ meesage: "Rol eliminado" });
    } catch (error) {
      if (error instanceof RoleNotExistsError) {
        res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: "error interno del servidor" });
    }
  }
}
