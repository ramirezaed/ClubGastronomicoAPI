// auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Token requerido" });
    return;
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    req.userId = payload.id; // 👈 lo guardás en el request
    next();
  } catch {
    res.status(401).json({ message: "Token inválido" });
  }
};
