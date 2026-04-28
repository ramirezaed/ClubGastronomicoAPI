import { Request, Response, NextFunction } from "express";

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = req.user?.role_name;

    if (!userRole || !allowedRoles.includes(userRole)) {
      console.log("datos del ususario", userRole);
      res.status(403).json({ message: "No tenés permisos para realizar esta acción" });
      return;
    }

    next();
  };
};
