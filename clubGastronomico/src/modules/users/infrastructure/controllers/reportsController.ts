import { canceledSalesUseCase } from "@/modules/users/application/use-cases/reports/canceledSalesUseCase";
import { dailySalesUseCase } from "@/modules/users/application/use-cases/reports/dailySalesUseCase";
import { CompanyNotFoundError } from "@/modules/users/domain/exceptions/Company/CompanyNotFoundError";
import { ValidationReportsError } from "@/modules/users/domain/exceptions/reports/validationReportsError";
import { Request, Response } from "express";

export class ReportsController {
  constructor(
    private readonly dailySaleReports: dailySalesUseCase,
    private readonly canceledSalesReports: canceledSalesUseCase,
  ) {}

  async dailySales(req: Request, res: Response): Promise<void> {
    try {
      const company = req.user.company_id as string;
      const { date } = req.query;
      const reports = await this.dailySaleReports.execute(company, date as string);
      res.status(200).json(reports);
      return;
    } catch (error) {
      if (error instanceof ValidationReportsError) {
        res.status(400).json({ message: error.message });
        return;
      }
      if (error instanceof CompanyNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      console.error(error);
      res.status(500).json({ message: "error interno del servidor" });
      return;
    }
  }
  async canceledReports(req: Request, res: Response): Promise<void> {
    try {
      const company_id = req.user.company_id as string;
      const { date } = req.query;
      const canceledSales = await this.canceledSalesReports.execute(company_id, date as string);
      res.status(200).json(canceledSales);
      return;
    } catch (error) {
      if (error instanceof CompanyNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
      }
      if (error instanceof ValidationReportsError) {
        res.status(400).json({ message: error.message });
        return;
      }
      console.error(error);
      res.status(500).json({ message: "error interno del servidor" });
    }
  }
}
