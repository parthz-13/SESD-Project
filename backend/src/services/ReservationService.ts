import { IReservationRepository, IBookRepository } from '../repositories/interfaces';
import { CreateReservationDTO } from '../dtos';
import { Reservation, ReservationStatus } from '../models';
import { NotificationService } from './NotificationService';
import { AppError } from '../errors/AppError';

/**
 * ReservationService — Reserve, cancel, fulfill, and expire reservations.
 * Demonstrates:
 *   - Business rule enforcement (can't reserve available books)
 *   - Notification integration (availability alerts)
 *   - Collaboration with BookRepository via interface
 */
export class ReservationService {
  private readonly reservationRepository: IReservationRepository;
  private readonly bookRepository: IBookRepository;
  private readonly notificationService: NotificationService;
  private readonly reservationExpiryDays: number = 3;

  constructor(
    reservationRepository: IReservationRepository,
    bookRepository: IBookRepository,
    notificationService: NotificationService,
  ) {
    this.reservationRepository = reservationRepository;
    this.bookRepository = bookRepository;
    this.notificationService = notificationService;
  }

  async reserveBook(memberId: string, bookId: number): Promise<Reservation> {
    const book = await this.bookRepository.findById(bookId);
    if (!book) {
      throw AppError.notFound(`Book with id ${bookId} not found`);
    }
    if (book.availableCopies > 0) {
      throw AppError.badRequest(`"${book.title}" is currently available. Please borrow it directly.`);
    }

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + this.reservationExpiryDays);

    const createData: CreateReservationDTO = {
      memberId,
      bookId,
      expiryDate,
    };

    const reservation = await this.reservationRepository.create(createData);
    return reservation;
  }

  async cancelReservation(reservationId: number, memberId: string): Promise<Reservation> {
    const reservation = await this.reservationRepository.findById(reservationId);
    if (!reservation) {
      throw AppError.notFound(`Reservation with id ${reservationId} not found`);
    }
    if (reservation.memberId !== memberId) {
      throw AppError.forbidden('You can only cancel your own reservations');
    }
    if (reservation.status !== ReservationStatus.PENDING) {
      throw AppError.badRequest('Only pending reservations can be cancelled');
    }

    return this.reservationRepository.update(reservationId, {
      status: ReservationStatus.CANCELLED,
    });
  }

  async fulfillReservation(reservationId: number): Promise<Reservation> {
    const reservation = await this.reservationRepository.findById(reservationId);
    if (!reservation) {
      throw AppError.notFound(`Reservation with id ${reservationId} not found`);
    }
    if (reservation.status !== ReservationStatus.PENDING) {
      throw AppError.badRequest('Only pending reservations can be fulfilled');
    }

    const updated = await this.reservationRepository.update(reservationId, {
      status: ReservationStatus.FULFILLED,
    });

    const book = await this.bookRepository.findById(reservation.bookId);
    if (book) {
      this.notificationService
        .sendAvailabilityAlert(parseInt(reservation.memberId, 10), book.title)
        .catch(console.error);
    }

    return updated;
  }

  async expireReservations(): Promise<void> {
    const pending = await this.reservationRepository.findPending();
    const now = new Date();

    for (const reservation of pending) {
      if (reservation.expiryDate < now) {
        await this.reservationRepository.update(reservation.id, {
          status: ReservationStatus.EXPIRED,
        });
      }
    }
  }

  async getMemberReservations(memberId: string): Promise<Reservation[]> {
    return this.reservationRepository.findByMember(memberId);
  }

  async getAllPendingReservations(): Promise<Reservation[]> {
    return this.reservationRepository.findPending();
  }
}
