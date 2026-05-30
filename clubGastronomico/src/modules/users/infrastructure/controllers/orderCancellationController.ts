import { getAllOrderCancellationUseCase } from "@/modules/users/application/use-cases/orderCancellation.ts/getAllOrderCancellationUseCase";
import { Cancellation_Reason } from "@/modules/users/domain/entities/OrderCancellation";
import { Request, Response } from "express";
export class OrderCancellationController {
  constructor(private readonly getAllOrder: getAllOrderCancellationUseCase) {}

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
}
