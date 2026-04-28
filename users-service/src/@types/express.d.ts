// // src/@types/express.d.ts
import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        email: string;
        role_id: string;
        role_name: string;
        company_id: string | null;
        branch_id: string | null;
      };
    }
  }
}
