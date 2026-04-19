import { Reservation } from '../../models';
import { CreateReservationDTO, UpdateReservationDTO } from '../../dtos';

/**
 * IReservationRepository — Contract for reservation data access.
 */
export interface IReservationRepository {
  findById(id: number): Promise<Reservation | null>;
  findByMember(memberId: string): Promise<Reservation[]>;
  findByBook(bookId: number): Promise<Reservation[]>;
  findPending(): Promise<Reservation[]>;
  create(data: CreateReservationDTO): Promise<Reservation>;
  update(id: number, data: UpdateReservationDTO): Promise<Reservation>;
}
