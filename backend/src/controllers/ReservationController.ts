import { Request, Response, NextFunction } from 'express';
import { ReservationService } from '../services/ReservationService';
import { StatusCodes } from 'http-status-codes';

export class ReservationController {
  private readonly reservationService: ReservationService;

  constructor(reservationService: ReservationService) {
    this.reservationService = reservationService;
  }

  reserve = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { memberId, bookId } = req.body;
      const reservation = await this.reservationService.reserveBook(memberId, bookId);
      res.status(StatusCodes.CREATED).json({ success: true, message: 'Book reserved', data: reservation });
    } catch (error) {
      next(error);
    }
  };

  cancel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { memberId } = req.body;
      const reservation = await this.reservationService.cancelReservation(parseInt(req.params.id), memberId);
      res.status(StatusCodes.OK).json({ success: true, message: 'Reservation cancelled', data: reservation });
    } catch (error) {
      next(error);
    }
  };

  fulfill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const reservation = await this.reservationService.fulfillReservation(parseInt(req.params.id));
      res.status(StatusCodes.OK).json({ success: true, message: 'Reservation fulfilled', data: reservation });
    } catch (error) {
      next(error);
    }
  };

  getMemberReservations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const reservations = await this.reservationService.getMemberReservations(req.params.memberId);
      res.status(StatusCodes.OK).json({ success: true, data: reservations });
    } catch (error) {
      next(error);
    }
  };

  getAllPending = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const reservations = await this.reservationService.getAllPendingReservations();
      res.status(StatusCodes.OK).json({ success: true, data: reservations });
    } catch (error) {
      next(error);
    }
  };
}
