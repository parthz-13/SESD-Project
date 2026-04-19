import { PrismaClient } from '@prisma/client';
import { Reservation, ReservationStatus } from '../models';
import { CreateReservationDTO, UpdateReservationDTO } from '../dtos';
import { IReservationRepository } from './interfaces';
import { AppError } from '../errors/AppError';

/**
 * ReservationRepository — Prisma implementation of IReservationRepository.
 */
export class ReservationRepository implements IReservationRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findById(id: number): Promise<Reservation | null> {
    return this.prisma.reservation.findUnique({
      where: { id },
      include: { book: true, member: true },
    }) as unknown as Reservation | null;
  }

  async findByMember(memberId: string): Promise<Reservation[]> {
    return this.prisma.reservation.findMany({
      where: { memberId },
      include: { book: true },
      orderBy: { reservedOn: 'desc' },
    }) as unknown as Reservation[];
  }

  async findByBook(bookId: number): Promise<Reservation[]> {
    return this.prisma.reservation.findMany({
      where: { bookId, status: ReservationStatus.PENDING },
      include: { member: { include: { user: true } } },
      orderBy: { reservedOn: 'asc' },
    }) as unknown as Reservation[];
  }

  async findPending(): Promise<Reservation[]> {
    return this.prisma.reservation.findMany({
      where: { status: ReservationStatus.PENDING },
      include: { book: true, member: { include: { user: true } } },
    }) as unknown as Reservation[];
  }

  async create(data: CreateReservationDTO): Promise<Reservation> {
    return this.prisma.reservation.create({
      data,
      include: { book: true, member: true },
    }) as unknown as Reservation;
  }

  async update(id: number, data: UpdateReservationDTO): Promise<Reservation> {
    try {
      return await (this.prisma.reservation.update({
        where: { id },
        data,
      }) as unknown as Reservation);
    } catch {
      throw AppError.notFound(`Reservation with id ${id} not found`);
    }
  }
}
