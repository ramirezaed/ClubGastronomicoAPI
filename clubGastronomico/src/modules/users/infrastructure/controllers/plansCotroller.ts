import { Request, Response } from "express";
import { getAllPlansUseCase } from "@/modules/users/application/use-cases/plan/getAllPlansUseCase";
import { SubscriptionPlan } from "@/modules/users/domain/entities/SubscriptionPlan";
import { SubscriptionPlanNotFoundError } from "@/modules/users/domain/exceptions/subscription/SubscriptionPlanNotFoundError";

export class PlanController {
  constructor(private readonly getAllPlans: getAllPlansUseCase) {}

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      //   const id = req.user.id as string;
      const planes = await this.getAllPlans.execute();
      res.status(200).json(planes);
    } catch (error) {
      if (error instanceof SubscriptionPlanNotFoundError) {
        res.status(404).json({ message: error.message });
      }
      console.error(error);
      res.status(500).json({ message: "error interno del servidor" });
    }
  }
}
