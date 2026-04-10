import { Request, Response } from "express";
import { MeUserUseCase } from "@/modules/users/application/use-cases/user/MeUserUseCase";
import { UserNotExistError } from "@/modules/users/domain/exceptions/user/UserNotExistsError";
import { UpdateUserUseCase } from "@/modules/users/application/use-cases/user/UpdateUserUseCase";
import { IUpdateUserDTO } from "@/modules/users/application/dtos/user/UpdateUserDTO";
import { UpdateUserError } from "@/modules/users/domain/exceptions/user/UpdateUserError";
import { GetAllUsersUseCase } from "@/modules/users/application/use-cases/user/GetAllUserUseCase";
import { DeleteUserUseCase } from "@/modules/users/application/use-cases/user/DeleteUserUseCase";
import { ActivateUserUseCase } from "@/modules/users/application/use-cases/user/ActivateUserUseCase";
import { UserAlreadyActiveError } from "@/modules/users/domain/exceptions/user/UserAlreadyActiveError";
import { DeactivateUserUseCase } from "@/modules/users/application/use-cases/user/DeactivateUserUseCase";
import { UserAlreadyDeactiveError } from "@/modules/users/domain/exceptions/user/UserAlreadyDeactiveError";
import { UpdateRoleUserUseCase } from "@/modules/users/application/use-cases/user/UpdateRoleUserUseCase";
import { UpdateRoleUserError } from "@/modules/users/domain/exceptions/user/UpdateRoleUserError";
import { RoleNotExistsError } from "@/modules/users/domain/exceptions/role/RoleNotExistsError";
export class UserController {
  constructor(
    private readonly meUser: MeUserUseCase,
    private readonly updateUser: UpdateUserUseCase,
    private readonly getAllUser: GetAllUsersUseCase,
    private readonly deleteUser: DeleteUserUseCase,
    private readonly activateUser: ActivateUserUseCase,
    private readonly deactivateUser: DeactivateUserUseCase,
    private readonly updateRoleUser: UpdateRoleUserUseCase,
  ) {}

  async me(req: Request, res: Response): Promise<void> {
    const id = req.userId as string;
    try {
      const me = await this.meUser.execute(id);
      res.status(200).json(me);
      return;
    } catch (error) {
      if (error instanceof UserNotExistError) {
        res.status(404).json({ message: error.message });
        return;
      }
      console.log(error);
      res.status(500).json({ message: "Error interno del1 servidor" });
      return;
    }
  }
  async update(req: Request, res: Response): Promise<void> {
    const id = req.userId as string;
    const { name, lastname } = req.body as IUpdateUserDTO;
    if (!name || !lastname) {
      res.status(400).json({ message: "Todos los datos son necesarios" });
      return;
    }

    try {
      const userActualizado = await this.updateUser.execute(id, {
        name,
        lastname,
      });
      res.status(200).json({ message: " usuario actualizado", userActualizado });
      return;
    } catch (error) {
      if (error instanceof UserNotExistError) {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error instanceof UpdateUserError) {
        res.status(500).json({ message: "Error interno del servidor" });
        return;
      }
      res.status(500).json({ message: "Error interno del servidor" });
      return;
    }
  }
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      let is_active: boolean | undefined;
      if (req.query.is_active === "true") is_active = true;
      else if (req.query.is_active === "false") is_active = false;
      //      si no viene el param, queda undefined → trae todos
      const users = await this.getAllUser.execute({ is_active });

      res.status(200).json({ message: "Lista de Usuarios", users });
      return;
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor" });
      return;
    }
  }
  async softDelete(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    try {
      await this.deleteUser.execute(id);
      res.status(200).json({ message: "Usuario Eliminado" });
      return;
    } catch (error) {
      if (error instanceof UserNotExistError) {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "error interno del servidor" });
      return;
    }
  }
  async activate(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    try {
      const userActualizado = await this.activateUser.execute(id);
      res.status(200).json({ message: "usuario activado", userActualizado });
      return;
    } catch (error) {
      if (error instanceof UserNotExistError) {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error instanceof UserAlreadyActiveError) {
        res.status(409).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "error interno del servidor" });
      return;
    }
  }
  async deactivate(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    try {
      const userActualizado = await this.deactivateUser.execute(id);
      res.status(200).json({ message: "usuario Desactivados", userActualizado });
      return;
    } catch (error) {
      if (error instanceof UserNotExistError) {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error instanceof UserAlreadyDeactiveError) {
        res.status(409).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "error interno del servidor" });
      return;
    }
  }
  async updateRole(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    const { role_id } = req.body;
    if (!role_id) {
      res.status(400).json({ message: "Todos los campos son requeridos" });
      return;
    }
    try {
      const userActaulizado = await this.updateRoleUser.execute(id, role_id);
      res.status(200).json({ userActaulizado });
      return;
    } catch (error) {
      if (error instanceof UserNotExistError) {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error instanceof RoleNotExistsError) {
        res.status(400).json({ message: error.message });
        return;
      }
      if (error instanceof UpdateRoleUserError) {
        res.status(409).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Error interno del servidor" });
      return;
    }
  }
}
