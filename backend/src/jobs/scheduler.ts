import cron from 'node-cron';
import { prisma } from '../config/database';
import { BorrowingRepository } from '../repositories/BorrowingRepository';
import { FineRepository } from '../repositories/FineRepository';
import { NotificationRepository } from '../repositories/NotificationRepository';
import { BorrowingService } from '../services/BorrowingService';
import { FineService } from '../services/FineService';
import { NotificationService } from '../services/NotificationService';
import { ReservationRepository } from '../repositories/ReservationRepository';
import { BookRepository } from '../repositories/BookRepository';
import { ReservationService } from '../services/ReservationService';
import { BorrowingStatus } from '../models';

// Wire up services for scheduler use
const borrowingRepository = new BorrowingRepository(prisma);
const bookRepository = new BookRepository(prisma);
const fineRepository = new FineRepository(prisma);
const notificationRepository = new NotificationRepository(prisma);
const reservationRepository = new ReservationRepository(prisma);
const fineService = new FineService(fineRepository);
const notificationService = new NotificationService(notificationRepository);
const borrowingService = new BorrowingService(borrowingRepository, bookRepository, fineService, notificationService);
const reservationService = new ReservationService(reservationRepository, bookRepository, notificationService);

/**
 * Scheduler — node-cron scheduled jobs for automated library management.
 * Demonstrates: automated workflows, separation of concerns, scheduled processing.
 */
export class Scheduler {
  /**
   * Job 1: Mark overdue borrowings — runs every hour.
   * Finds all ISSUED borrowings past their due date and marks them OVERDUE.
   */
  private static scheduleOverdueDetection(): void {
    cron.schedule('0 * * * *', async () => {
      console.log('[Scheduler] Running overdue detection...');
      try {
        await prisma.borrowing.updateMany({
          where: {
            status: BorrowingStatus.ISSUED,
            dueDate: { lt: new Date() },
          },
          data: { status: BorrowingStatus.OVERDUE },
        });
        console.log('[Scheduler] Overdue detection complete');
      } catch (err) {
        console.error('[Scheduler] Overdue detection error:', err);
      }
    });
  }

  /**
   * Job 2: Auto-generate fines for overdue borrowings — runs daily at midnight.
   */
  private static scheduleAutoFineGeneration(): void {
    cron.schedule('0 0 * * *', async () => {
      console.log('[Scheduler] Running auto fine generation...');
      try {
        const overdueBorrowings = await borrowingRepository.findOverdue();
        for (const borrowing of overdueBorrowings) {
          const existingFine = await prisma.fine.findUnique({
            where: { borrowingId: borrowing.id },
          });
          if (!existingFine) {
            const fineAmount = fineService.calculateFine(borrowing.dueDate, new Date());
            if (fineAmount > 0) {
              await fineService.createFine({
                borrowingId: borrowing.id,
                memberId: borrowing.memberId,
                amount: fineAmount,
              });
            }
          }
        }
        console.log(`[Scheduler] Fine generation complete. Processed ${overdueBorrowings.length} overdue items.`);
      } catch (err) {
        console.error('[Scheduler] Fine generation error:', err);
      }
    });
  }

  /**
   * Job 3: Send due date reminders — runs daily at 8 AM.
   * Notifies members whose books are due in the next 2 days.
   */
  private static scheduleDueReminders(): void {
    cron.schedule('0 8 * * *', async () => {
      console.log('[Scheduler] Sending due date reminders...');
      try {
        const twoDaysFromNow = new Date();
        twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
        const today = new Date();

        const dueSoon = await prisma.borrowing.findMany({
          where: {
            status: BorrowingStatus.ISSUED,
            dueDate: { gte: today, lte: twoDaysFromNow },
          },
          include: { book: true, member: { include: { user: true } } },
        });

        for (const borrowing of dueSoon) {
          const b = borrowing as typeof borrowing & {
            book: { title: string };
            member: { user: { id: number } };
          };
          await notificationService.sendDueReminder(
            b.member.user.id,
            b.book.title,
            borrowing.dueDate,
          );
        }
        console.log(`[Scheduler] Sent ${dueSoon.length} due date reminders`);
      } catch (err) {
        console.error('[Scheduler] Due reminder error:', err);
      }
    });
  }

  /**
   * Job 4: Expire stale reservations — runs daily at midnight.
   */
  private static scheduleReservationExpiry(): void {
    cron.schedule('5 0 * * *', async () => {
      console.log('[Scheduler] Running reservation expiry...');
      try {
        await reservationService.expireReservations();
        console.log('[Scheduler] Reservation expiry complete');
      } catch (err) {
        console.error('[Scheduler] Reservation expiry error:', err);
      }
    });
  }

  /**
   * Start all scheduled jobs.
   */
  public static start(): void {
    Scheduler.scheduleOverdueDetection();
    Scheduler.scheduleAutoFineGeneration();
    Scheduler.scheduleDueReminders();
    Scheduler.scheduleReservationExpiry();
    console.log('[Scheduler] All scheduled jobs registered ✓');
  }
}
