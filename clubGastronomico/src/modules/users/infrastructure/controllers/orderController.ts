import { registerOrderUseCase } from "@/modules/users/application/use-cases/order/registerOrderUseCase";
import { CompanyNotFoundError } from "@/modules/users/domain/exceptions/Company/CompanyNotFoundError";
import { orderValidationError } from "@/modules/users/domain/exceptions/order/orderValidationError";
import { Request, Response } from "express";
export class OrderController {
  constructor(private readonly registerOrder: registerOrderUseCase) {}

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
      console.error(error);
      res.status(504).json({ message: "error interno del servidor" });
      return;
    }
  }
}
