import { Request, Response } from "express";
import { RegisterCompanyUseCase } from "@/modules/users/application/use-cases/company/registerCompanyUseCase";
import { IRegisterCompanyDTO } from "@/modules/users/application/dtos/company/registerCompanyDTO";
import { CompanyAlreadyExistsError } from "@/modules/users/domain/exceptions/Company/CompanyAlreadyExistsError";
import { SubscriptionPlanNotFoundError } from "@/modules/users/domain/exceptions/subscription/SubscriptionPlanNotFoundError";
import { RegisterCompanyError } from "@/modules/users/domain/exceptions/Company/registerCompanyError";
import { GetAllCompanyUseCase } from "@/modules/users/application/use-cases/company/getAllCompanyUseCase";
import { findByIdCompanyUseCase } from "@/modules/users/application/use-cases/company/findByIdCompanyUseCase";
import { CompanyNotFoundError } from "@/modules/users/domain/exceptions/Company/CompanyNotFoundError";
import { meCompanyUseCase } from "@/modules/users/application/use-cases/company/meCompanyUseCase";

export class CompanyController {
  constructor(
    private readonly registerCompany: RegisterCompanyUseCase,
    private readonly getAllCompany: GetAllCompanyUseCase,
    private readonly findByIdCompany: findByIdCompanyUseCase,
    private readonly meCompany: meCompanyUseCase,
  ) {}
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
  async getAll(req: Request, res: Response): Promise<void> {
    const id = req.user.id as string;
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const company = await this.getAllCompany.execute({ page, limit });
      res.status(200).json(company);
    } catch (error) {
      console.log("error get", error);
      res.status(500).json({ messsage: "error interno del servidor" });
    }
  }
  async findById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const company = await this.findByIdCompany.execute(id);
      res.status(200).json({ company });
    } catch (error) {
      if (error instanceof CompanyNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      console.error(error);
      res.status(500).json({ message: "error interno del servidor" });
      return;
    }
  }
  async MeCompany(req: Request, res: Response): Promise<void> {
    try {
      // const id = req.params.id as string;
      const id = req.user.company_id as string;
      const company = await this.meCompany.excute(id);
      res.status(200).json(company);
      return;
    } catch (error) {
      if (error instanceof CompanyNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      console.error(error);
      res.status(500).json({ message: "error interno del servidor" });
      return;
    }
  }
}
