// aca va la ruta
//router.post('/login', ...).
import { Router } from "express";
import { MongooseUserRepository } from "../persistence/MongooseUserRepository";
import { RegisterUser } from "../../application/use-cases/RegisterUser";
import { UserController } from "../controllers/UserController";

const router = Router();

const userRepository = new MongooseUserRepository();
const registerUserUseCase = new RegisterUser(userRepository);
const userController = new UserController(registerUserUseCase);

router.post("/register", (req, res) => userController.register(req, res));

export default router;
