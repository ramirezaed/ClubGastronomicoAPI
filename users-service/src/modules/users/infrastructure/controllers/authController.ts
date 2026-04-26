import { Request, Response } from "express";
import { RegisterUserUseCase } from "@/modules/users/application/use-cases/auth/RegisterUserUseCase";
import { IRegisterUserDTO } from "@/modules/users/application/dtos/user/RegisterUserDTO";
import { RegisterUserError } from "@/modules/users/domain/exceptions/user/RegisterUserError";
import { DuplicateEmailError } from "@/modules/users/domain/exceptions/user/DuplicateEmailError";
import { ILoginDTO } from "@/modules/users/application/dtos/user/LoginDTO.ts";
import { LoginUseCase } from "@/modules/users/application/use-cases/auth/LoginUserUseCase";
import { RefreshTokenUseCase } from "@/modules/users/application/use-cases/auth/RefreshTokenUseCase";
import { InvalidCreedentialError } from "@/modules/users/domain/exceptions/user/InvalidCreedentialError";
import { InactiveUserError } from "@/modules/users/domain/exceptions/user/InactiveUser";
import { ValidateTokenUseCase } from "@/modules/users/application/use-cases/auth/ValidateTokenUseCase";
import { InvalidtokenError } from "@/modules/users/domain/exceptions/user/invalidToken";
import { RolesNotFoundError } from "@/modules/users/domain/exceptions/role/RolesNotFoundError";
import { ForgotPasswordUseCase } from "@/modules/users/application/use-cases/auth/ForgotPasswordUseCase";
import { ResetPasswordUseCase } from "@/modules/users/application/use-cases/auth/ResetPasswordUseCase";
import { UserNotExistError } from "@/modules/users/domain/exceptions/user/UserNotExistsError";

export class AuthController {
  constructor(
    private readonly registerUser: RegisterUserUseCase,
    private readonly loginUser: LoginUseCase,
    private readonly refreshToken: RefreshTokenUseCase,
    private readonly validateToken: ValidateTokenUseCase,
    private readonly forgot: ForgotPasswordUseCase,
    private readonly reset: ResetPasswordUseCase,
  ) {}

  async login(req: Request, res: Response): Promise<void> {
    const data = req.body as ILoginDTO;
    if (!data.email || !data.password) {
      res.status(400).json({ message: "Todos los campos son requeridos" });
      return;
    }
    try {
      const result = await this.loginUser.execute(data);
      res.status(200).json(result);
      return;
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
      return;
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
      return;
    } catch (error) {
      if (error instanceof InvalidtokenError) {
        res.status(401).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Error interno del servidor" });
      return;
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
      return;
    } catch (error) {
      if (error instanceof InvalidtokenError) {
        res.status(401).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Error interno del servidor" });
      return;
    }
  }
  async register(req: Request, res: Response): Promise<void> {
    //se tipa como el DTO para asegurar la forma esperada
    const { name, lastname, email, password, role_id } = req.body as IRegisterUserDTO;
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
      res.status(201).json({ message: "Usuario registrado exitosamente", user });
      return;
    } catch (error) {
      if (error instanceof DuplicateEmailError) {
        res.status(409).json({ message: error.message });
        return;
      }
      if (error instanceof RegisterUserError) {
        res.status(500).json({ message: error.message });
        return;
      }
      if (error instanceof RolesNotFoundError) {
        res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: "Error interno del servidor" });
      return;
    }
  }
  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      await this.forgot.execute(email);
      // siempre 200 aunque el email no exista, por seguridad
      res
        .status(200)
        .json({ message: "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña." });
    } catch (error) {
      if (error instanceof InactiveUserError) {
        res.status(403).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Error interno del servidor" });
      return;
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, newPassword } = req.body;
      await this.reset.execute(token, newPassword);
      res.status(200).json({ message: "Contraseña actualizada correctamente" });
    } catch (error) {
      if (error instanceof InvalidtokenError) {
        res.status(401).json({ message: error.message });
        return;
      }
      if (error instanceof UserNotExistError) {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
}
