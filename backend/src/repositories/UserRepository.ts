import { PrismaClient } from '@prisma/client';
import { User } from '../models';
import { CreateUserDTO, UpdateUserDTO } from '../dtos';
import { IUserRepository } from './interfaces';
import { AppError } from '../errors/AppError';

/**
 * UserRepository — Prisma implementation of IUserRepository.
 * Encapsulates all database operations for the User entity.
 */
export class UserRepository implements IUserRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } }) as Promise<User | null>;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } }) as Promise<User | null>;
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    }) as Promise<User[]>;
  }

  async create(data: CreateUserDTO): Promise<User> {
    return this.prisma.user.create({ data }) as Promise<User>;
  }

  async update(id: number, data: UpdateUserDTO): Promise<User> {
    try {
      return await (this.prisma.user.update({ where: { id }, data }) as Promise<User>);
    } catch {
      throw AppError.notFound(`User with id ${id} not found`);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.prisma.user.delete({ where: { id } });
    } catch {
      throw AppError.notFound(`User with id ${id} not found`);
    }
  }
}
