import { Request, Response, NextFunction } from 'express';
import { BorrowingService } from '../services/BorrowingService';
import { StatusCodes } from 'http-status-codes';

interface AuthRequest extends Request {
  user?: { userId: number; role: string; librarianId?: string };
}

/**
 * BorrowingController — Handles HTTP requests for borrowing operations.
 */
export class BorrowingController {
  private readonly borrowingService: BorrowingService;

  constructor(borrowingService: BorrowingService) {
    this.borrowingService = borrowingService;
  }

  issueBook = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { memberId, bookId } = req.body;
      const librarianId = req.body.librarianId;
      const borrowing = await this.borrowingService.issueBook(memberId, bookId, librarianId);
      res.status(StatusCodes.CREATED).json({ success: true, message: 'Book issued', data: borrowing });
    } catch (error) {
      next(error);
    }
  };

  returnBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.borrowingService.returnBook(parseInt(req.params.id));
      res.status(StatusCodes.OK).json({ success: true, message: 'Book returned', data: result });
    } catch (error) {
      next(error);
    }
  };

  getMemberHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const history = await this.borrowingService.getMemberHistory(req.params.memberId);
      res.status(StatusCodes.OK).json({ success: true, data: history });
    } catch (error) {
      next(error);
    }
  };

  getActive = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const active = await this.borrowingService.getActiveBorrowings();
      res.status(StatusCodes.OK).json({ success: true, data: active, count: active.length });
    } catch (error) {
      next(error);
    }
  };

  getOverdue = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const overdue = await this.borrowingService.getOverdueBorrowings();
      res.status(StatusCodes.OK).json({ success: true, data: overdue, count: overdue.length });
    } catch (error) {
      next(error);
    }
  };
}
