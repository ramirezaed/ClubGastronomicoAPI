import { Request, Response } from "express";
import { getAllPlansUseCase } from "@/modules/users/application/use-cases/plan/getAllPlansUseCase";
import { SubscriptionPlan } from "@/modules/users/domain/entities/SubscriptionPlan";
import { SubscriptionPlanNotFoundError } from "@/modules/users/domain/exceptions/subscription/SubscriptionPlanNotFoundError";
import { findByIdCompanyUseCase } from "@/modules/users/application/use-cases/company/findByIdCompanyUseCase";
import { findByIdPlansUseCase } from "@/modules/users/application/use-cases/plan/findByIdPlansUseCase";

export class PlanController {
  constructor(
    private readonly getAllPlans: getAllPlansUseCase,
    private readonly findByIdPlan: findByIdPlansUseCase,
  ) {}

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      //   const id = req.user.id as string;
      const planes = await this.getAllPlans.execute();
      res.status(200).json(planes);
      return;
    } catch (error) {
      if (error instanceof SubscriptionPlanNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      console.error(error);
      res.status(500).json({ message: "error interno del servidor" });
      return;
    }
  }
  async findById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const plan = await this.findByIdPlan.execute(id);
      res.status(200).json(plan);
      return;
    } catch (error) {
      if (error instanceof SubscriptionPlanNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      console.error(error);
      res.status(500).json({ message: "error interno del servidor" });
      return;
    }
  }
}
