import { RegisterCategoryUseCase } from "@/modules/users/application/use-cases/category/registerCategoryUseCase";
import { categoryDuplicateNameError } from "@/modules/users/domain/exceptions/category/categoryDuplicateNameError";
import { RegisterCategoryError } from "@/modules/users/domain/exceptions/category/registerCategoryError";
import { Request, Response } from "express";
export class CategoryController {
  constructor(private readonly registerCategory: RegisterCategoryUseCase) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      const category = await this.registerCategory.execute(data);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof categoryDuplicateNameError) {
        res.status(409).json({ message: error.message });
        return;
      }
      if (error instanceof RegisterCategoryError) {
        res.status(404).json({ message: error.message });
        return;
      }
      console.error(error);
      res.status(500).json({ message: "error interno del servidor" });
      return;
    }
  }
}
