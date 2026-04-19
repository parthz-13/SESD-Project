import { PrismaClient } from '@prisma/client';
import { Fine, FineStatus } from '../models';
import { CreateFineDTO } from '../dtos';
import { IFineRepository } from './interfaces';
import { AppError } from '../errors/AppError';

/**
 * FineRepository — Prisma implementation of IFineRepository.
 */
export class FineRepository implements IFineRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findById(id: number): Promise<Fine | null> {
    return this.prisma.fine.findUnique({
      where: { id },
      include: { borrowing: { include: { book: true } }, member: true },
    }) as unknown as Fine | null;
  }

  async findByMember(memberId: string): Promise<Fine[]> {
    return this.prisma.fine.findMany({
      where: { memberId },
      include: { borrowing: { include: { book: true } } },
      orderBy: { createdAt: 'desc' },
    }) as unknown as Fine[];
  }

  async findUnpaid(memberId: string): Promise<Fine[]> {
    return this.prisma.fine.findMany({
      where: { memberId, status: FineStatus.UNPAID },
      include: { borrowing: { include: { book: true } } },
    }) as unknown as Fine[];
  }

  async findAll(): Promise<Fine[]> {
    return this.prisma.fine.findMany({
      include: {
        member: { include: { user: true } },
        borrowing: { include: { book: true } },
      },
      orderBy: { createdAt: 'desc' },
    }) as unknown as Fine[];
  }

  async create(data: CreateFineDTO): Promise<Fine> {
    return this.prisma.fine.create({
      data,
      include: { borrowing: true, member: true },
    }) as unknown as Fine;
  }

  async markAsPaid(id: number): Promise<Fine> {
    try {
      return await (this.prisma.fine.update({
        where: { id },
        data: { status: FineStatus.PAID, paidOn: new Date() },
      }) as unknown as Fine);
    } catch {
      throw AppError.notFound(`Fine with id ${id} not found`);
    }
  }
}
