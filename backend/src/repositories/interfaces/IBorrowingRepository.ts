import { Borrowing } from '../../models';
import { CreateBorrowingDTO, UpdateBorrowingDTO } from '../../dtos';

/**
 * IBorrowingRepository — Contract for borrowing data access.
 */
export interface IBorrowingRepository {
  findById(id: number): Promise<Borrowing | null>;
  findByMember(memberId: string): Promise<Borrowing[]>;
  findByBook(bookId: number): Promise<Borrowing[]>;
  findActive(): Promise<Borrowing[]>;
  findOverdue(): Promise<Borrowing[]>;
  create(data: CreateBorrowingDTO): Promise<Borrowing>;
  update(id: number, data: UpdateBorrowingDTO): Promise<Borrowing>;
}
