import { User } from '../../models';
import { CreateUserDTO, UpdateUserDTO } from '../../dtos';

/**
 * IUserRepository — Contract for user data access.
 * Decouples business logic from the database implementation (Dependency Inversion Principle).
 */
export interface IUserRepository {
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  create(data: CreateUserDTO): Promise<User>;
  update(id: number, data: UpdateUserDTO): Promise<User>;
  delete(id: number): Promise<void>;
}
