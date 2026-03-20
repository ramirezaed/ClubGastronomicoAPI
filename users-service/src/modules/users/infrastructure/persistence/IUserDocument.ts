import { Document } from "mongoose";
import { User } from "../../domain/entities/User";

//es la unión entre tu entidad de negocio y Mongoose.
// Gracias a esto el schema sabe que this.password es un string y no una Date,
export interface IUserDocument extends User, Document {}
