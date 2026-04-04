import { Request, Response } from "express";

import { RegisterUser } from "@application/use-cases/RegisterUser";
import { IRegisterUserDTO } from "@application/dtos/RegisterUserDTO";
import { RegisterUserError } from "@domain/exceptions/RegisterUserError";
import { DuplicateEmailError } from "@domain/exceptions/DuplicateEmailError";

export class UserController {
  constructor(private readonly registerUser: RegisterUser) {}

  async register(req: Request, res: Response): Promise<void> {
    //se tipa como el DTO para asegurar la forma esperada
    const { company_id, branch_id, name, lastname, email, password, role_id } =
      req.body as IRegisterUserDTO;
    if (!name || !lastname || !email || !password || !role_id) {
      res.status(400).json({ message: "Todos los campos son requeridos" });
      return;
    }
    // ejecuta el caso de uso RegisterUser
    try {
      const user = await this.registerUser.execute({
        company_id,
        branch_id,
        name,
        lastname,
        email,
        password,
        role_id,
      });
      res
        .status(201)
        .json({ message: "Usuario registrado exitosamente", user });
    } catch (error) {
      if (error instanceof DuplicateEmailError) {
        res.status(409).json({ message: error.message });
        return;
      }
      if (error instanceof RegisterUserError) {
        res.status(500).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
}
