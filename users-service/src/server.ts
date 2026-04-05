import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import { connectDB } from "@/config/db";
import router from "@/modules/users/infrastructure/http/auth.router";
import { swaggerSpec } from "@/config/swagger";
import swaggerUi from "swagger-ui-express";
import { seedRoles } from "@/config/roleSeeder";
import RoleRouter from "@/modules/users/infrastructure/http/role.router";

config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const HOST = process.env.HOST || "localhost";

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", router);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec)); //las rutas para swagger
app.use("/api/roles", RoleRouter);

const startServer = async () => {
  try {
    await connectDB();
    await seedRoles();
    app.listen(PORT, () => {
      console.log(`Server is running on http://${HOST}:${PORT}`);
      console.log(`Docs en http://${HOST}:${PORT}/api/docs`);
    });
  } catch (error) {
    console.error(" Error al iniciar el servidor:", error);
    process.exit(1);
  }
};

startServer();
