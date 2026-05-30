import { changeStatusOrderUsecase } from "@/modules/users/application/use-cases/order/changeStatusOrderUseCase";
import { findByIdOrderUseCase } from "@/modules/users/application/use-cases/order/findByIdOrderUseCase";
import { getAllOrderUsecase } from "@/modules/users/application/use-cases/order/getAllOrderUseCase";
import { registerOrderUseCase } from "@/modules/users/application/use-cases/order/registerOrderUseCase";
import { softdeleteOrderUseCase } from "@/modules/users/application/use-cases/order/softDeleteOrderUseCase";
import { OrderStatus } from "@/modules/users/domain/entities/Order";
import { CompanyNotFoundError } from "@/modules/users/domain/exceptions/Company/CompanyNotFoundError";
import { OrderNotFoundError } from "@/modules/users/domain/exceptions/order/orderNotFoundError";
import { orderValidationError } from "@/modules/users/domain/exceptions/order/orderValidationError";
import { Request, Response } from "express";
export class OrderController {
  constructor(
    private readonly registerOrder: registerOrderUseCase,
    private readonly registerOrderForBOT: registerOrderUseCase,
    private readonly findByIdOrder: findByIdOrderUseCase,
    private readonly changeStatusOrder: changeStatusOrderUsecase,
    private readonly getAllOrder: getAllOrderUsecase,
    private readonly softDeleteOrder: softdeleteOrderUseCase,
  ) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const company_id = req.user.company_id as string;
      const data = req.body;

      const order = await this.registerOrder.execute(company_id, data);
      res.status(201).json(order);
      return;
    } catch (error) {
      if (error instanceof orderValidationError) {
        res.status(400).json({ message: error.message });
        return;
      }
      if (error instanceof CompanyNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      console.error("error al regisrar ", error);
      res.status(504).json({ message: "error interno del servidor" });
      return;
    }
  }
  async registerForBOT(req: Request, res: Response): Promise<void> {
    try {
      const company_id = req.params.id as string;
      const data = req.body;

      const order = await this.registerOrderForBOT.execute(company_id, data);
      res.status(201).json(order);
      return;
    } catch (error) {
      if (error instanceof orderValidationError) {
        res.status(400).json({ message: error.message });
        return;
      }
      if (error instanceof CompanyNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      console.error("error al regisrar ", error);
      res.status(504).json({ message: "error interno del servidor" });
      return;
    }
  }
  async findById(req: Request, res: Response): Promise<void> {
    try {
      const company_id = req.user.company_id as string;
      const order_id = req.params.id as string;
      const order = await this.findByIdOrder.execute(order_id, company_id);
      res.status(200).json(order);
      return;
    } catch (error) {
      if (error instanceof CompanyNotFoundError || error instanceof OrderNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "error interno del servidor" });
    }
  }
  async changeStatus(req: Request, res: Response): Promise<void> {
    try {
      const company_id = req.user.company_id as string;
      const order_id = req.params.id as string;
      const status = req.params.status as OrderStatus;

      const order = await this.changeStatusOrder.execute(order_id, status, company_id);
      res.status(200).json({ order });
      return;
    } catch (error) {
      if (error instanceof orderValidationError) {
        res.status(403).json({ message: error.message });
        return;
      }
      if (error instanceof CompanyNotFoundError || error instanceof OrderNotFoundError) {
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

      let status: OrderStatus | undefined;

      // parse string safely
      if (typeof req.query.status === "string") {
        status = req.query.status as OrderStatus;
      }
      //paginacion
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const items = await this.getAllOrder.execute(company_id, { status }, { page, limit });
      res.status(200).json(items);
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "error interno del servidor" });
    }
  }
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const company_id = req.user.company_id as string;
      const id = req.params.id as string;
      await this.softDeleteOrder.execute(id, company_id);

      res.status(200).json({ message: "orden cancelada" });
      return;
    } catch (error) {
      if (error instanceof CompanyNotFoundError || error instanceof OrderNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error instanceof orderValidationError) {
        res.status(400).json({ message: error.message });
        return;
      }
      console.error(error);
      res.status(500).json({ message: "error interno del servidor" });
      return;
    }
  }
}
