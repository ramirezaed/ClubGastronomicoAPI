import { getAllOrderCancellationUseCase } from "@/modules/users/application/use-cases/orderCancellation.ts/getAllOrderCancellationUseCase";
import { getByIdOrdercancellationUseCase } from "@/modules/users/application/use-cases/orderCancellation.ts/getByIdOrderCancellationUseCase";
import { Cancellation_Reason } from "@/modules/users/domain/entities/OrderCancellation";
import { ValidationCancellationError } from "@/modules/users/domain/exceptions/cancellationOrder/validationCancellation";
import { CompanyNotFoundError } from "@/modules/users/domain/exceptions/Company/CompanyNotFoundError";
import { Request, Response } from "express";
export class OrderCancellationController {
  constructor(
    private readonly getAllOrder: getAllOrderCancellationUseCase,
    private readonly getByID: getByIdOrdercancellationUseCase,
  ) {}

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const company_id = req.user.company_id as string;

      let reason: Cancellation_Reason | undefined;
      let start_date: Date | undefined;
      let end_date: Date | undefined;

      if (typeof req.query.reason === "string") {
        reason = req.query.reason as Cancellation_Reason;
      }

      if (typeof req.query.start_date === "string") {
        start_date = new Date(req.query.start_date);
      }

      if (typeof req.query.end_date === "string") {
        end_date = new Date(req.query.end_date);
      }

      // paginación
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const items = await this.getAllOrder.execute(company_id, { reason, start_date, end_date }, { page, limit });

      res.status(200).json(items);
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "error interno del servidor" });
    }
  }
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const order_id = req.params.id as string;
      const company_id = req.user.company_id as string;
      const order = await this.getByID.execute(order_id, company_id);
      res.status(200).json(order);
      return;
    } catch (error) {
      if (error instanceof CompanyNotFoundError || error instanceof ValidationCancellationError) {
        res.status(404).json({ message: error.message });
        return;
      }
      console.error(error);
      res.status(500).json({ message: "error interno del servidor" });
    }
  }
}
