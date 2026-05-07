import { Request, Response } from "express";
import { RegisterCompanyUseCase } from "@/modules/users/application/use-cases/company/registerCompanyUseCase";
import { IRegisterCompanyDTO } from "@/modules/users/application/dtos/company/registerCompanyDTO";
import { CompanyAlreadyExistsError } from "@/modules/users/domain/exceptions/Company/CompanyAlreadyExistsError";
import { SubscriptionPlanNotFoundError } from "@/modules/users/domain/exceptions/subscription/SubscriptionPlanNotFoundError";
import { RegisterCompanyError } from "@/modules/users/domain/exceptions/Company/registerCompanyError";

export class CompanyController {
  constructor(private readonly registerCompany: RegisterCompanyUseCase) {}
  async register(req: Request, res: Response): Promise<void> {
    const ownerId = req.user.id;
    const data = req.body as IRegisterCompanyDTO;
    try {
      const newCompany = await this.registerCompany.execute(ownerId, data);
      res.status(201).json(newCompany);
      return;
    } catch (error) {
      if (error instanceof CompanyAlreadyExistsError) {
        res.status(409).json({ message: error.message });
        return;
      }
      if (error instanceof SubscriptionPlanNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error instanceof RegisterCompanyError) {
        res.status(400).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "error interno del servidor" });
      return;
    }
  }
}
