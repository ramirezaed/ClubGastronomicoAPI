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
import { UpdateCompanyUseCase } from "@/modules/users/application/use-cases/company/updateCompanyUseCase";
import { UpdateCompanyDTO } from "@/modules/users/application/dtos/company/updateCompanyDTO";
import { CompanyInactiveError } from "@/modules/users/domain/exceptions/Company/CompanyInactiveError";
import { SoftDeleteCompanyUseCase } from "@/modules/users/application/use-cases/company/softDeleteCompanyUseCase";
import { ActivateCompanyUseCase } from "@/modules/users/application/use-cases/company/activateCompanyUseCase";
import { DeactivateCompanyUseCase } from "@/modules/users/application/use-cases/company/deactivateCompanyUseCase";
import { CompanyAlreadyActivateError } from "@/modules/users/domain/exceptions/Company/CompayAlreadyActivateError";
import { CompanyAlreadyDeactivateError } from "@/modules/users/domain/exceptions/Company/CompanyAlreadyDeactivateError";
import { changePlanCompanyUseCase } from "@/modules/users/application/use-cases/company/changePlanCompanyUseCase";
import { CompanyAlreadyHasThisPlanError } from "@/modules/users/domain/exceptions/Company/CompanyAlreadyHasThisPlanError";
import { findCompanyUseCase } from "@/modules/users/application/use-cases/company/findCompanyUseCase";

export class CompanyController {
  constructor(
    private readonly registerCompany: RegisterCompanyUseCase,
    private readonly getAllCompany: GetAllCompanyUseCase,
    private readonly findByIdCompany: findByIdCompanyUseCase,
    private readonly meCompany: meCompanyUseCase,
    private readonly updateCompany: UpdateCompanyUseCase,
    private readonly softdelete: SoftDeleteCompanyUseCase,
    private readonly activate: ActivateCompanyUseCase,
    private readonly deactivate: DeactivateCompanyUseCase,
    private readonly changePlan: changePlanCompanyUseCase,
    private readonly findCompany: findCompanyUseCase,
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
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const company = await this.getAllCompany.execute({ page, limit });
      res.status(200).json({ message: "Lista de Empresas", company });
    } catch (error) {
      console.error(error);
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
  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = req.user.company_id as string;
      const data = req.body as UpdateCompanyDTO;

      const companyUpdate = await this.updateCompany.execute(id, data);
      res.status(200).json({ companyUpdate });
      return;
    } catch (error) {
      if (error instanceof CompanyNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error instanceof CompanyInactiveError) {
        res.status(403).json({ message: error.message });
        return;
      }
      console.error(error);
      res.status(500).json({ message: "error interno del servidor" });
      return;
    }
  }
  async Softdelete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      await this.softdelete.execute(id);
      res.status(200).json({ message: "Compañia Eliminada" });
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
  async Activate(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const companyActiva = await this.activate.execute(id);
      res.status(200).json(companyActiva);
      return;
    } catch (error) {
      if (error instanceof CompanyNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error instanceof CompanyAlreadyActivateError) {
        res.status(409).json({ message: error.message });
        return;
      }
      console.error(error);
      res.status(500).json({ message: "error interno del servidor" });
      return;
    }
  }
  async Deactivate(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const companyDeactivate = await this.deactivate.execute(id);
      res.status(200).json(companyDeactivate);
      return;
    } catch (error) {
      if (error instanceof CompanyNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error instanceof CompanyAlreadyDeactivateError) {
        res.status(409).json({ message: error.message });
        return;
      }
      console.error(error);
      res.status(500).json({ message: "error interno del servidor" });
      return;
    }
  }
  async ChangePlan(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const { plan_id } = req.body;
      const companyActualizada = await this.changePlan.execute(id, plan_id);
      res.status(200).json(companyActualizada);
      return;
    } catch (error) {
      if (error instanceof CompanyNotFoundError) {
        res.status(404).json({ meessage: error.message });
        return;
      }
      if (error instanceof SubscriptionPlanNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error instanceof CompanyAlreadyHasThisPlanError) {
        res.status(403).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "error interno del servidor" });
      return;
    }
  }
  async findCompan(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;
      const company = await this.findCompany.execute({ name });
      res.status(200).json(company);

      return;
    } catch (error) {
      res.status(500).json({ message: "error interno del servidor" });
      return;
    }
  }
}
