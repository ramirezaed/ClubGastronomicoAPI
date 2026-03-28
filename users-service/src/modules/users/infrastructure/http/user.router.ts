// aca va la ruta
//router.post('/login', ...).
import { Router } from "express";
import { MongooseUserRepository } from "@infra/persistence/MongooseUserRepository";
import { RegisterUser } from "@application/use-cases/RegisterUser";
import { UserController } from "@infra/controllers/UserController";

const router = Router();

const userRepository = new MongooseUserRepository();
const registerUserUseCase = new RegisterUser(userRepository);
const userController = new UserController(registerUserUseCase);

router.post("/register", (req, res) => userController.register(req, res));

export default router;
