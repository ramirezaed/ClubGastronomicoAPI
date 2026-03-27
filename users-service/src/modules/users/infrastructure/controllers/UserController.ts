import { Request, Response } from "express";

import { RegisterUser } from "@application/use-cases/RegisterUser";
import { IRegisterUserDTO } from "@application/dtos/RegisterUserDTO";
import { RegisterUserError } from "@domain/exceptions/RegisterUserError";
import { DuplicateEmailError } from "@domain/exceptions/DuplicateEmailError";

export class UserController {
  constructor(private readonly registerUser: RegisterUser) {}

  async register(req: Request, res: Response): Promise<void> {
    const { name, lastname, email, password, role } =
      req.body as IRegisterUserDTO;

    if (!name || !lastname || !email || !password) {
      res.status(400).json({ message: "Todos los campos son requeridos" });
      return;
    }

    try {
      const user = await this.registerUser.execute({
        name,
        lastname,
        email,
        password,
        role,
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
