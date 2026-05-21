import { activateCategoryUseCase } from "@/modules/users/application/use-cases/category/activatecategoryUseCase";
import { deactivateCategoryUseCase } from "@/modules/users/application/use-cases/category/deactivateCategoryUseCase";
import { findByIdCategoryUseCase } from "@/modules/users/application/use-cases/category/findByIdUseCase";
import { RegisterCategoryUseCase } from "@/modules/users/application/use-cases/category/registerCategoryUseCase";
import { softdeleteCategoryUseCase } from "@/modules/users/application/use-cases/category/softdeleteCategoryUseCase";
import { categoryAlreadyActiveError } from "@/modules/users/domain/exceptions/category/categoryAlreadyActive";
import { categoryAlreadyInactiveError } from "@/modules/users/domain/exceptions/category/categoryAlreadyInactive";
import { categoryDuplicateNameError } from "@/modules/users/domain/exceptions/category/categoryDuplicateNameError";
import { categoryNotFound } from "@/modules/users/domain/exceptions/category/categoryNotFound";
import { RegisterCategoryError } from "@/modules/users/domain/exceptions/category/registerCategoryError";
import { Request, Response } from "express";
export class CategoryController {
  constructor(
    private readonly registerCategory: RegisterCategoryUseCase,
    private readonly activateCategory: activateCategoryUseCase,
    private readonly deactivateCategory: deactivateCategoryUseCase,
    private readonly softDeleteCategory: softdeleteCategoryUseCase,
    private readonly findByIdCategory: findByIdCategoryUseCase,
  ) {}

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
  async activate(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const category = await this.activateCategory.execute(id);
      res.status(200).json(category);
      return;
    } catch (error) {
      if (error instanceof categoryAlreadyActiveError) {
        res.status(409).json({ message: error.message });
        return;
      }
      if (error instanceof categoryNotFound) {
        res.status(404).json({ message: error.message });
        return;
      }
      console.error(error);
      res.status(500).json({ message: "error interno del servidor" });
      return;
    }
  }
  async deactivate(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const category = await this.deactivateCategory.execute(id);
      res.status(200).json(category);
      return;
    } catch (error) {
      if (error instanceof categoryAlreadyInactiveError) {
        res.status(409).json({ message: error.message });
        return;
      }
      if (error instanceof categoryNotFound) {
        res.status(404).json({ message: error.message });
        return;
      }
      console.error(error);
      res.status(500).json({ message: "error interno del servidor" });
      return;
    }
  }
  async softdelete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      await this.softDeleteCategory.execute(id);
      res.status(200).json({ message: "categoria eliminada exitosamente" });
    } catch (error) {
      if (error instanceof categoryNotFound) {
        res.status(404).json({ message: error.message });
        return;
      }
      console.error(error);
      res.status(500).json({ message: "error interno del servidor" });
    }
  }
  async findById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const category = await this.findByIdCategory.execute(id);
      res.status(200).json(category);
      return;
    } catch (error) {
      if (error instanceof categoryNotFound) {
        res.status(404).json({ message: error.message });
        return;
      }
      console.error(error);
      res.status(500).json({ message: "error interno del servidor" });
      return;
    }
  }
}
