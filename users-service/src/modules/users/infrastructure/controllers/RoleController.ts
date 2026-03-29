import { Request, Response } from "express";

import { RegisterRole } from "@/modules/users/application/use-cases/role/RegisterRole";
import { IRegisterRoleDTO } from "@/modules/users/application/dtos/role/RegisterRoleDTO";
import { RegisterRoleError } from "@/modules/users/domain/exceptions/role/RegisterRoleError";
import { DuplicateNameError } from "@/modules/users/domain/exceptions/role/DuplicateNameError";

export class RoleController {
  constructor(private readonly registerRole: RegisterRole) {}

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
}
