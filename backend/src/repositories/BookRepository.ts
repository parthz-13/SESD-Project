import { PrismaClient } from '@prisma/client';
import { Book, Author, Category } from '../models';
import { CreateBookDTO, UpdateBookDTO, BookFilterDTO, CreateAuthorDTO, UpdateAuthorDTO, CreateCategoryDTO, UpdateCategoryDTO } from '../dtos';
import { IBookRepository, IAuthorRepository, ICategoryRepository } from './interfaces';
import { AppError } from '../errors/AppError';

/**
 * BookRepository — Prisma implementation of IBookRepository.
 * Handles all book-related database operations including author/category relations.
 */
export class BookRepository implements IBookRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findById(id: number): Promise<Book | null> {
    return this.prisma.book.findUnique({
      where: { id },
      include: {
        authors: { include: { author: true } },
        categories: { include: { category: true } },
      },
    }) as unknown as Book | null;
  }

  async findAll(filters?: BookFilterDTO): Promise<Book[]> {
    const where: Record<string, unknown> = {};

    if (filters?.title) {
      where['title'] = { contains: filters.title, mode: 'insensitive' };
    }
    if (filters?.isbn) {
      where['isbn'] = filters.isbn;
    }
    if (filters?.availableOnly) {
      where['availableCopies'] = { gt: 0 };
    }
    if (filters?.categoryId) {
      where['categories'] = { some: { categoryId: filters.categoryId } };
    }
    if (filters?.authorId) {
      where['authors'] = { some: { authorId: filters.authorId } };
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    return this.prisma.book.findMany({
      where,
      skip,
      take: limit,
      include: {
        authors: { include: { author: true } },
        categories: { include: { category: true } },
      },
      orderBy: { createdAt: 'desc' },
    }) as unknown as Book[];
  }

  async create(data: CreateBookDTO): Promise<Book> {
    const { authorIds, categoryIds, ...bookData } = data;

    return this.prisma.book.create({
      data: {
        ...bookData,
        availableCopies: bookData.totalCopies,
        authors: authorIds
          ? { create: authorIds.map((authorId) => ({ authorId })) }
          : undefined,
        categories: categoryIds
          ? { create: categoryIds.map((categoryId) => ({ categoryId })) }
          : undefined,
      },
      include: {
        authors: { include: { author: true } },
        categories: { include: { category: true } },
      },
    }) as unknown as Book;
  }

  async update(id: number, data: UpdateBookDTO): Promise<Book> {
    const { authorIds, categoryIds, ...bookData } = data;
    try {
      return await (this.prisma.book.update({
        where: { id },
        data: {
          ...bookData,
          authors: authorIds
            ? {
                deleteMany: {},
                create: authorIds.map((authorId) => ({ authorId })),
              }
            : undefined,
          categories: categoryIds
            ? {
                deleteMany: {},
                create: categoryIds.map((categoryId) => ({ categoryId })),
              }
            : undefined,
        },
        include: {
          authors: { include: { author: true } },
          categories: { include: { category: true } },
        },
      }) as unknown as Book);
    } catch {
      throw AppError.notFound(`Book with id ${id} not found`);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.prisma.book.delete({ where: { id } });
    } catch {
      throw AppError.notFound(`Book with id ${id} not found`);
    }
  }

  async decrementCopies(id: number): Promise<Book> {
    return this.prisma.book.update({
      where: { id },
      data: { availableCopies: { decrement: 1 } },
    }) as Promise<Book>;
  }

  async incrementCopies(id: number): Promise<Book> {
    return this.prisma.book.update({
      where: { id },
      data: { availableCopies: { increment: 1 } },
    }) as Promise<Book>;
  }
}

/**
 * AuthorRepository — Prisma implementation of IAuthorRepository.
 */
export class AuthorRepository implements IAuthorRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findById(id: number): Promise<Author | null> {
    return this.prisma.author.findUnique({ where: { id } }) as Promise<Author | null>;
  }

  async findAll(): Promise<Author[]> {
    return this.prisma.author.findMany({ orderBy: { name: 'asc' } }) as Promise<Author[]>;
  }

  async create(data: CreateAuthorDTO): Promise<Author> {
    return this.prisma.author.create({ data }) as Promise<Author>;
  }

  async update(id: number, data: UpdateAuthorDTO): Promise<Author> {
    return this.prisma.author.update({ where: { id }, data }) as Promise<Author>;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.author.delete({ where: { id } });
  }
}

/**
 * CategoryRepository — Prisma implementation of ICategoryRepository.
 */
export class CategoryRepository implements ICategoryRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findById(id: number): Promise<Category | null> {
    return this.prisma.category.findUnique({ where: { id } }) as Promise<Category | null>;
  }

  async findAll(): Promise<Category[]> {
    return this.prisma.category.findMany({ orderBy: { name: 'asc' } }) as Promise<Category[]>;
  }

  async create(data: CreateCategoryDTO): Promise<Category> {
    return this.prisma.category.create({ data }) as Promise<Category>;
  }

  async update(id: number, data: UpdateCategoryDTO): Promise<Category> {
    return this.prisma.category.update({ where: { id }, data }) as Promise<Category>;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.category.delete({ where: { id } });
  }
}
