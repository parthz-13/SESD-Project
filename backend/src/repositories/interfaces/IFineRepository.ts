import { Fine } from '../../models';
import { CreateFineDTO } from '../../dtos';

/**
 * IFineRepository — Contract for fine data access.
 */
export interface IFineRepository {
  findById(id: number): Promise<Fine | null>;
  findByMember(memberId: string): Promise<Fine[]>;
  findUnpaid(memberId: string): Promise<Fine[]>;
  findAll(): Promise<Fine[]>;
  create(data: CreateFineDTO): Promise<Fine>;
  markAsPaid(id: number): Promise<Fine>;
}
