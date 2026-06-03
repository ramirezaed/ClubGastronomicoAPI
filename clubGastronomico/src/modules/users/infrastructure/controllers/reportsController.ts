import { canceledSalesUseCase } from "@/modules/users/application/use-cases/reports/canceledSalesUseCase";
import { dailySalesUseCase } from "@/modules/users/application/use-cases/reports/dailySalesUseCase";
import { topItemsUseCase } from "@/modules/users/application/use-cases/reports/topItemsUseCase";
import { CompanyNotFoundError } from "@/modules/users/domain/exceptions/Company/CompanyNotFoundError";
import { ValidationReportsError } from "@/modules/users/domain/exceptions/reports/validationReportsError";
import { Request, Response } from "express";
import { isStringOneByteRepresentation } from "node:v8";

export class ReportsController {
  constructor(
    private readonly dailySaleReports: dailySalesUseCase,
    private readonly canceledSalesReports: canceledSalesUseCase,
    private readonly topItemsRepots: topItemsUseCase,
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
  async topItems(req: Request, res: Response): Promise<void> {
    try {
      const company_id = req.user.company_id as string;
      const { date_from, date_to } = req.query;

      const topItems = await this.topItemsRepots.execute(
        company_id,
        (date_from as string) || undefined,
        (date_to as string) || undefined,
      );
      res.status(200).json(topItems);
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
      return;
    }
  }
}
