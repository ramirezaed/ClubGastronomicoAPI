import { Document } from "mongoose";
import { Category } from "@/modules/users/domain/entities/Category";

export interface IcategoryDocument extends Category, Document {}
