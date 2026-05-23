import { ActivateMenuItemsUseCase } from "@/modules/users/application/use-cases/MenuItems/activateMenuItemsUseCase";
import { deactivaMenuItemsUseCase } from "@/modules/users/application/use-cases/MenuItems/deactivateMenuItemsUseCase";
import { getAllMenuItemsUseCase } from "@/modules/users/application/use-cases/MenuItems/getAllMenuItemsUseCase";
import { getAllForBotUseCase } from "@/modules/users/application/use-cases/MenuItems/GetByIdMenuItemsForBotUseCase";
import { getByIdMenuItemsUseCase } from "@/modules/users/application/use-cases/MenuItems/getByIdMenuItemsUseCase";
import { RegisterMenuItemsUseCase } from "@/modules/users/application/use-cases/MenuItems/registerMenuItemsUseCase";
import { softDeleteMenuItemsUseCase } from "@/modules/users/application/use-cases/MenuItems/softDeleteMenuItemsUseCase";
import { UpdateMenuItemsUseCase } from "@/modules/users/application/use-cases/MenuItems/updateMenuItemsUseCase";
import { CategoryNotFound } from "@/modules/users/domain/exceptions/CategoryItems/CategoryItemsNoyFoundError";
import { DuplicateNameMenuItemsError } from "@/modules/users/domain/exceptions/CategoryItems/DuplicateNameError";
import { InactiveMenuItems } from "@/modules/users/domain/exceptions/MenuItems/InactiveMenuError";
import { MenuAlreadyActivateError } from "@/modules/users/domain/exceptions/MenuItems/MenuAlreadyActiveError";
import { MenuAlreadyDeactivateError } from "@/modules/users/domain/exceptions/MenuItems/MenuAlreadyDeactivateError";
import { MenuItemsNotFoundError } from "@/modules/users/domain/exceptions/MenuItems/MenuItemsNotFoundError";
import { Request, Response } from "express";

export class MenuItemsController {
  constructor(
    private readonly registerMenuItems: RegisterMenuItemsUseCase,
    private readonly updateMenuItems: UpdateMenuItemsUseCase,
    private readonly activateMenuItems: ActivateMenuItemsUseCase,
    private readonly deactivateMenuItems: deactivaMenuItemsUseCase,
    private readonly softDeleteMenuItems: softDeleteMenuItemsUseCase,
    private readonly getByIdMenuItems: getByIdMenuItemsUseCase,
    private readonly getAllMenuItems: getAllMenuItemsUseCase,
    private readonly getAllMenuItemsFotBot: getAllForBotUseCase,
  ) {}
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const items = await this.getByIdMenuItems.execute(id);
      res.status(200).json(items);
      return;
    } catch (error) {
      if (error instanceof MenuItemsNotFoundError) {
        res.status(404).json({ message: error.message });
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
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const company_id = req.user.company_id as string;

      let is_active: boolean | undefined;
      let name: string | undefined;
      // parse boolean
      if (req.query.is_active === "true") is_active = true;
      else if (req.query.is_active === "false") is_active = false;

      // parse string safely
      if (typeof req.query.name === "string") {
        name = req.query.name;
      }
      //paginacion
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const items = await this.getAllMenuItems.execute(company_id, { is_active, name }, { page, limit });
      res.status(200).json(items);
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "error interno del servidor" });
    }
  }
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
  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const data = req.body;
      const items = await this.updateMenuItems.execute(id, data);
      res.status(200).json(items);
      return;
    } catch (error) {
      if (error instanceof MenuItemsNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error instanceof InactiveMenuItems) {
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
      const items = await this.activateMenuItems.execute(id);
      res.status(200).json(items);
      return;
    } catch (error) {
      if (error instanceof MenuAlreadyActivateError) {
        res.status(409).json({ message: error.message });
        return;
      }
      if (error instanceof MenuItemsNotFoundError) {
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
      const items = await this.deactivateMenuItems.execute(id);
      res.status(200).json(items);
      return;
    } catch (error) {
      if (error instanceof MenuAlreadyDeactivateError) {
        res.status(409).json({ messsage: error.message });
        return;
      }
      if (error instanceof MenuItemsNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      console.error(error);
      res.status(500).json({ message: "error interno del servidor" });
      return;
    }
  }
  async softDelete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      await this.softDeleteMenuItems.execute(id);
      res.status(200).json({ message: "items eliminado con exito" });
      return;
    } catch (error) {
      if (error instanceof MenuItemsNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      console.error(error);
      res.status(500).json({ message: "error interno del servidor" });
      return;
    }
  }

  async getAllforBot(req: Request, res: Response): Promise<void> {
    try {
      const company_id = req.user.company_id as string;
      const menuItems = await this.getAllMenuItemsFotBot.execute(company_id);
      res.status(200).json(menuItems);
      return;
    } catch (error) {
      if (error instanceof MenuItemsNotFoundError) {
        res.status(404).json({ message: error.message });
      }
      console.error(error);
      res.status(500).json({ message: "error interno del servidor" });
      return;
    }
  }
}
