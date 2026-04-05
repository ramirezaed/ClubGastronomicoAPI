import { Request, Response } from "express";

import { RegisterUser } from "@/modules/users/application/use-cases/RegisterUserUseCase";
import { IRegisterUserDTO } from "@application/dtos/RegisterUserDTO";
import { RegisterUserError } from "@domain/exceptions/RegisterUserError";
import { DuplicateEmailError } from "@domain/exceptions/DuplicateEmailError";
import { ILoginDTO } from "@/modules/users/application/dtos/LoginDTO.ts";
import { LoginUseCase } from "@/modules/users/application/use-cases/LoginUserUseCase";
import { RefreshTokenUseCase } from "@/modules/users/application/use-cases/RefreshTokenUseCase";
import { InvalidCreedentialError } from "@/modules/users/domain/exceptions/InvalidCreedentialError";
import { InactiveUserError } from "@/modules/users/domain/exceptions/InactiveUser";
import { ValidateTokenUseCase } from "@/modules/users/application/use-cases/ValidateTokenUseCase";
import { InvalidtokenError } from "@/modules/users/domain/exceptions/invalidToken";
import { UpdateUserUseCase } from "@/modules/users/application/use-cases/UpdateUserUseCase";
import { IUpdateUserDTO } from "@/modules/users/application/dtos/UpdateUserDTO";
import { UserNotExistError } from "@/modules/users/domain/exceptions/UserNotExistsError";
import { UpdateUserError } from "@/modules/users/domain/exceptions/UpdateUserError";
export class AuthController {
  constructor(
    private readonly registerUser: RegisterUser,
    private readonly loginUser: LoginUseCase,
    private readonly refreshToken: RefreshTokenUseCase,
    private readonly validateToken: ValidateTokenUseCase,
    private readonly updateUser: UpdateUserUseCase,
  ) {}
  async register(req: Request, res: Response): Promise<void> {
    //se tipa como el DTO para asegurar la forma esperada
    const { name, lastname, email, password, role_id } =
      req.body as IRegisterUserDTO;
    if (!name || !lastname || !email || !password) {
      res.status(400).json({ message: "Todos los campos son requeridos" });
      return;
    }
    // ejecuta el caso de uso RegisterUser
    try {
      const user = await this.registerUser.execute({
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

  async login(req: Request, res: Response): Promise<void> {
    const data = req.body as ILoginDTO;
    if (!data.email || !data.password) {
      res.status(400).json({ message: "Todos los campos son requeridos" });
      return;
    }
    try {
      const result = await this.loginUser.execute(data);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof InvalidCreedentialError) {
        res.status(401).json({ message: error.message });
        return;
      }
      if (error instanceof InactiveUserError) {
        res.status(403).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async TokenRefresh(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        res.status(400).json({ message: "refreshToken requerido" });
        return;
      }
      const result = await this.refreshToken.execute(refreshToken);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof InvalidtokenError) {
        res.status(401).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async tokenValidate(req: Request, res: Response): Promise<void> {
    const tokenHeader = req.headers.authorization;
    if (!tokenHeader) {
      res.status(401).json({ message: "No autorizado" });
      return;
    }
    //divide el texto de array y ocupa el que se encuentra en la posicion 1
    //  [ "Bearer" , "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"]
    //el string de la posicion 1 es  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
    const token = tokenHeader.split(" ")[1];
    try {
      const payload = await this.validateToken.execute(token);
      res.status(200).json(payload);
    } catch (error) {
      if (error instanceof InvalidtokenError) {
        res.status(401).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
  async update(req: Request, res: Response) {
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
      res
        .status(200)
        .json({ message: " usuario actualizado", userActualizado });
    } catch (error) {
      if (error instanceof UserNotExistError) {
        res.status(404).json({ message: error.message });
      }
      if (error instanceof UpdateUserError) {
        res.status(500).json({ message: "Error interno del servidor" });
      }
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
}
