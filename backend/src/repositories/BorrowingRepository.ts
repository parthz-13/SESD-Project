import { PrismaClient } from '@prisma/client';
import { Borrowing, BorrowingStatus } from '../models';
import { CreateBorrowingDTO, UpdateBorrowingDTO } from '../dtos';
import { IBorrowingRepository } from './interfaces';
import { AppError } from '../errors/AppError';

/**
 * BorrowingRepository — Prisma implementation of IBorrowingRepository.
 * Handles all borrowing-related database operations.
 */
export class BorrowingRepository implements IBorrowingRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findById(id: number): Promise<Borrowing | null> {
    return this.prisma.borrowing.findUnique({
      where: { id },
      include: { member: true, book: true, librarian: true },
    }) as unknown as Borrowing | null;
  }

  async findByMember(memberId: string): Promise<Borrowing[]> {
    return this.prisma.borrowing.findMany({
      where: { memberId },
      include: { book: true },
      orderBy: { issueDate: 'desc' },
    }) as unknown as Borrowing[];
  }

  async findByBook(bookId: number): Promise<Borrowing[]> {
    return this.prisma.borrowing.findMany({
      where: { bookId },
      include: { member: true },
    }) as unknown as Borrowing[];
  }

  async findActive(): Promise<Borrowing[]> {
    return this.prisma.borrowing.findMany({
      where: { status: BorrowingStatus.ISSUED },
      include: { member: { include: { user: true } }, book: true },
      orderBy: { dueDate: 'asc' },
    }) as unknown as Borrowing[];
  }

  async findOverdue(): Promise<Borrowing[]> {
    return this.prisma.borrowing.findMany({
      where: {
        status: { in: [BorrowingStatus.ISSUED, BorrowingStatus.OVERDUE] },
        dueDate: { lt: new Date() },
      },
      include: { member: { include: { user: true } }, book: true },
    }) as unknown as Borrowing[];
  }

  async create(data: CreateBorrowingDTO): Promise<Borrowing> {
    return this.prisma.borrowing.create({
      data,
      include: { book: true, member: true },
    }) as unknown as Borrowing;
  }

  async update(id: number, data: UpdateBorrowingDTO): Promise<Borrowing> {
    try {
      return await (this.prisma.borrowing.update({
        where: { id },
        data,
        include: { book: true, member: true, fine: true },
      }) as unknown as Borrowing);
    } catch {
      throw AppError.notFound(`Borrowing record with id ${id} not found`);
    }
  }
}
