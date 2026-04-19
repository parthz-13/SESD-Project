import { IFineRepository } from '../repositories/interfaces';
import { CreateFineDTO } from '../dtos';
import { Fine } from '../models';
import { AppError } from '../errors/AppError';

/**
 * FineService — Handles fine calculation, creation, and payment.
 * Demonstrates:
 *   - Encapsulation: private fineRatePerDay
 *   - Strategy Pattern: calculateFine is a pure calculation strategy
 *   - Single Responsibility: only fine management logic
 */
export class FineService {
  private readonly fineRepository: IFineRepository;
  private readonly fineRatePerDay: number;

  constructor(fineRepository: IFineRepository) {
    this.fineRepository = fineRepository;
    this.fineRatePerDay = parseFloat(process.env.FINE_RATE_PER_DAY || '5');
  }

  /**
   * Strategy Pattern: pure fine calculation logic, easily swappable.
   */
  calculateFine(dueDate: Date, returnDate: Date): number {
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysOverdue = Math.ceil((returnDate.getTime() - dueDate.getTime()) / msPerDay);
    return daysOverdue > 0 ? daysOverdue * this.fineRatePerDay : 0;
  }

  async createFine(data: CreateFineDTO): Promise<Fine> {
    return this.fineRepository.create(data);
  }

  async payFine(fineId: number): Promise<Fine> {
    const fine = await this.fineRepository.findById(fineId);
    if (!fine) {
      throw AppError.notFound(`Fine with id ${fineId} not found`);
    }
    if (fine.status === 'PAID') {
      throw AppError.badRequest('This fine has already been paid');
    }
    return this.fineRepository.markAsPaid(fineId);
  }

  async getMemberFines(memberId: string): Promise<Fine[]> {
    return this.fineRepository.findByMember(memberId);
  }

  async getMemberUnpaidFines(memberId: string): Promise<Fine[]> {
    return this.fineRepository.findUnpaid(memberId);
  }

  async getAllFines(): Promise<Fine[]> {
    return this.fineRepository.findAll();
  }
}
