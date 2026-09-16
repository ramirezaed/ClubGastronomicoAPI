import { Request, Response } from "express";
import { getAllPlansUseCase } from "@/modules/users/application/use-cases/plan/getAllPlansUseCase";
import { SubscriptionPlanNotFoundError } from "@/modules/users/domain/exceptions/subscription/SubscriptionPlanNotFoundError";
import { findByIdPlansUseCase } from "@/modules/users/application/use-cases/plan/findByIdPlansUseCase";
import { registerPlanUseCase } from "@/modules/users/application/use-cases/plan/registerPlanUseCase";
import { SubscriptionPlanAlreadyExistsError } from "@/modules/users/domain/exceptions/subscription/SubscriptionPlanAlreadyExistsError";
import { SubscriptionPlanRegisterError } from "@/modules/users/domain/exceptions/subscription/SubscriptionPlanRegisterError";
import { UpdatePlanUseCase } from "@/modules/users/application/use-cases/plan/updatePlanUseCase";
import { softdeletePlanUseCase } from "@/modules/users/application/use-cases/plan/deletePlanUseCase";
import { SubscriptionPlanInUseError } from "@/modules/users/domain/exceptions/subscription/SubscriptionPlanInUseError";

export class PlanController {
  constructor(
    private readonly getAllPlans: getAllPlansUseCase,
    private readonly findByIdPlan: findByIdPlansUseCase,
    private readonly registerPlan: registerPlanUseCase,
    private readonly updatePlan: UpdatePlanUseCase,
    private readonly softDeletePlan: softdeletePlanUseCase,
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
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, price, description } = req.body;
      const plan = await this.registerPlan.execute({ name, price, description });
      res.status(201).json(plan);
      return;
    } catch (error) {
      if (error instanceof SubscriptionPlanAlreadyExistsError) {
        res.status(409).json({ message: error.message });
        return;
      }
      if (error instanceof SubscriptionPlanRegisterError) {
        res.status(400).json({ message: error.message });
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
      const { price, description } = req.body;
      const newPlan = await this.updatePlan.execute(id, { price, description });
      res.status(200).json(newPlan);
      return;
    } catch (error) {
      console.error(error);
      if (error instanceof SubscriptionPlanNotFoundError) {
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
      await this.softDeletePlan.execute(id);
      res.status(200).json({ message: "Plan Eliminado con exito" });
      return;
    } catch (error) {
      if (error instanceof SubscriptionPlanNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error instanceof SubscriptionPlanInUseError) {
        res.status(409).json({ message: error.message });
      }
      res.status(500).json({ message: "error interno en el servidor" });
      return;
    }
  }
}
