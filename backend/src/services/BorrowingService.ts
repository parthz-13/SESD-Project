import { IBorrowingRepository, IBookRepository } from '../repositories/interfaces';
import { CreateBorrowingDTO } from '../dtos';
import { Borrowing, BorrowingStatus } from '../models';
import { FineService } from './FineService';
import { NotificationService } from './NotificationService';
import { AppError } from '../errors/AppError';

/**
 * BorrowingService — Core borrowing workflow logic.
 * Demonstrates:
 *   - Dependency Injection (BorrowingRepo, BookRepo, FineService, NotificationService)
 *   - Composition: delegates fine and notification responsibilities to specialized services
 *   - Business rule enforcement (availableCopies check, overdue fine calculation)
 */
export class BorrowingService {
  private readonly borrowingRepository: IBorrowingRepository;
  private readonly bookRepository: IBookRepository;
  private readonly fineService: FineService;
  private readonly notificationService: NotificationService;
  private readonly defaultBorrowingDays: number = 14;

  constructor(
    borrowingRepository: IBorrowingRepository,
    bookRepository: IBookRepository,
    fineService: FineService,
    notificationService: NotificationService,
  ) {
    this.borrowingRepository = borrowingRepository;
    this.bookRepository = bookRepository;
    this.fineService = fineService;
    this.notificationService = notificationService;
  }

  async issueBook(memberId: string, bookId: number, librarianId: string): Promise<Borrowing> {
    const book = await this.bookRepository.findById(bookId);
    if (!book) {
      throw AppError.notFound(`Book with id ${bookId} not found`);
    }
    if (book.availableCopies <= 0) {
      throw AppError.badRequest(`"${book.title}" has no available copies. Please reserve it instead.`);
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + this.defaultBorrowingDays);

    const createData: CreateBorrowingDTO = {
      memberId,
      bookId,
      issuedBy: librarianId,
      dueDate,
    };

    const borrowing = await this.borrowingRepository.create(createData);
    await this.bookRepository.decrementCopies(bookId);

    // Send due date reminder notification (non-blocking)
    this.notificationService
      .sendDueReminder(
        parseInt(memberId, 10),
        book.title,
        dueDate,
      )
      .catch(console.error);

    return borrowing;
  }

  async returnBook(borrowingId: number): Promise<{ borrowing: Borrowing; fine?: unknown }> {
    const borrowing = await this.borrowingRepository.findById(borrowingId);
    if (!borrowing) {
      throw AppError.notFound(`Borrowing record with id ${borrowingId} not found`);
    }
    if (borrowing.status === BorrowingStatus.RETURNED) {
      throw AppError.badRequest('This book has already been returned');
    }

    const returnDate = new Date();
    let fine = undefined;

    // Check if overdue and calculate fine
    if (returnDate > borrowing.dueDate) {
      const fineAmount = this.fineService.calculateFine(borrowing.dueDate, returnDate);
      if (fineAmount > 0) {
        fine = await this.fineService.createFine({
          borrowingId: borrowing.id,
          memberId: borrowing.memberId,
          amount: fineAmount,
        });

        this.notificationService
          .sendOverdueAlert(parseInt(borrowing.memberId, 10), 'your book')
          .catch(console.error);
      }
    }

    const updatedBorrowing = await this.borrowingRepository.update(borrowingId, {
      returnDate,
      status: BorrowingStatus.RETURNED,
    });

    await this.bookRepository.incrementCopies(borrowing.bookId);

    return { borrowing: updatedBorrowing, fine };
  }

  async getOverdueBorrowings(): Promise<Borrowing[]> {
    return this.borrowingRepository.findOverdue();
  }

  async getActiveBorrowings(): Promise<Borrowing[]> {
    return this.borrowingRepository.findActive();
  }

  async getMemberHistory(memberId: string): Promise<Borrowing[]> {
    return this.borrowingRepository.findByMember(memberId);
  }

  async getBorrowingById(id: number): Promise<Borrowing> {
    const borrowing = await this.borrowingRepository.findById(id);
    if (!borrowing) {
      throw AppError.notFound(`Borrowing record with id ${id} not found`);
    }
    return borrowing;
  }
}
