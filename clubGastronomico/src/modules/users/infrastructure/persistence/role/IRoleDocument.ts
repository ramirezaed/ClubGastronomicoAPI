import { Document } from "mongoose";
import { Role } from "@domain/entities/Role";

export interface IRoleDocument extends Role, Document {}
