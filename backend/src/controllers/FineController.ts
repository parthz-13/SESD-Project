import { Request, Response, NextFunction } from 'express';
import { FineService } from '../services/FineService';
import { StatusCodes } from 'http-status-codes';

export class FineController {
  private readonly fineService: FineService;

  constructor(fineService: FineService) {
    this.fineService = fineService;
  }

  getMemberFines = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const fines = await this.fineService.getMemberFines(req.params.memberId);
      res.status(StatusCodes.OK).json({ success: true, data: fines });
    } catch (error) {
      next(error);
    }
  };

  getAllFines = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const fines = await this.fineService.getAllFines();
      res.status(StatusCodes.OK).json({ success: true, data: fines, count: fines.length });
    } catch (error) {
      next(error);
    }
  };

  payFine = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const fine = await this.fineService.payFine(parseInt(req.params.id));
      res.status(StatusCodes.OK).json({ success: true, message: 'Fine paid', data: fine });
    } catch (error) {
      next(error);
    }
  };
}
