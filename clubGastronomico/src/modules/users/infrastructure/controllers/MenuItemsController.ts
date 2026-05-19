import { RegisterMenuItemsUseCase } from "@/modules/users/application/use-cases/MenuItems/registerMenuItemsUseCase";
import { CategoryNotFound } from "@/modules/users/domain/exceptions/CategoryItems/CategoryItemsNoyFoundError";
import { DuplicateNameMenuItemsError } from "@/modules/users/domain/exceptions/CategoryItems/DuplicateNameError";
import { Request, Response } from "express";

export class MenuItemsController {
  constructor(private readonly registerMenuItems: RegisterMenuItemsUseCase) {}
  async register(req: Request, res: Response): Promise<void> {
    try {
      const company = req.user.company_id as string;
      const data = req.body;
      const newMenuItems = await this.registerMenuItems.execute(company, data);
      res.status(201).json(newMenuItems);
      return;
    } catch (error) {
      if (error instanceof DuplicateNameMenuItemsError) {
        res.status(409).json({ message: error.message });
        return;
      }
      if (error instanceof CategoryNotFound) {
        res.status(404).json({ message: error.message });
        return;
      }
      console.error(error);
      res.status(500).json({ message: "error interno del servidor" });
      return;
    }
  }
}
