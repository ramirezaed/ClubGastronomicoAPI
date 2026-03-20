// //servidor microservicio usarios
// import express, { Request, Response } from "express";
// import { connectDB } from "./config/db";
// import { config } from "dotenv";
// // import router from "./routers";
// import cookieParser from "cookie-parser";

// import cors from "cors"; // Importa CORS esto es para que desde el front pueda entrar a todos los endpoint

// config();
// const PORT = Number(process.env.PORT) || 5000; // parseando, le digo que es del tipo numero
// const HOST = process.env.HOST || "localhost";
// const app = express();
// app.use(cors());

// app.use(express.json());
// app.use(cookieParser());
// // app.use("/api", router);

// connectDB(); //me conecto a la base de dato abstraida
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// Servidor microservicio usuarios

import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import { connectDB } from "./config/db";
// import router from "./routers";

// Configurar variables de entorno
config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const HOST = process.env.HOST || "localhost";

app.use(
  cors({
    origin: process.env.CLIENT_URL, // ajustar según tu frontend
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

// app.use("/api", router);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on http://${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error(" Error al iniciar el servidor:", error);
    process.exit(1);
  }
};

startServer();
