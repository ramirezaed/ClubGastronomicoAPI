import { Request, Response } from "express";
import { MeUserUseCase } from "@/modules/users/application/use-cases/user/MeUserUseCase";
import { UserNotExistError } from "@/modules/users/domain/exceptions/user/UserNotExistsError";
import { UpdateUserUseCase } from "@/modules/users/application/use-cases/user/UpdateUserUseCase";
import { IUpdateUserDTO } from "@/modules/users/application/dtos/user/UpdateUserDTO";
import { UpdateUserError } from "@/modules/users/domain/exceptions/user/UpdateUserError";
export class UserController {
  constructor(
    private readonly meUser: MeUserUseCase,
    private readonly updateUser: UpdateUserUseCase,
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
    const id = req.params.id as string;
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
}
