import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IJwtPayloadDTO } from "@/modules/users/application/dtos/user/IjwtPayLoadDTO";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Token requerido" });
    return;
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as IJwtPayloadDTO;
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ message: "Token invalido" });
  }
};
