// src/@types/express.d.ts
import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      // userId?: string; // Aquí definimos tu propiedad personalizada
      user: {
        id: string;
        role_id: string;
        company: string | null;
        branch: string | null;
        email: string;
      };
    }
  }
}
