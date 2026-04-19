import { Book, Author, Category } from '../../models';
import { CreateBookDTO, UpdateBookDTO, BookFilterDTO, CreateAuthorDTO, UpdateAuthorDTO, CreateCategoryDTO, UpdateCategoryDTO } from '../../dtos';

/**
 * IBookRepository — Contract for book data access.
 */
export interface IBookRepository {
  findById(id: number): Promise<Book | null>;
  findAll(filters?: BookFilterDTO): Promise<Book[]>;
  create(data: CreateBookDTO): Promise<Book>;
  update(id: number, data: UpdateBookDTO): Promise<Book>;
  delete(id: number): Promise<void>;
  decrementCopies(id: number): Promise<Book>;
  incrementCopies(id: number): Promise<Book>;
}

export interface IAuthorRepository {
  findById(id: number): Promise<Author | null>;
  findAll(): Promise<Author[]>;
  create(data: CreateAuthorDTO): Promise<Author>;
  update(id: number, data: UpdateAuthorDTO): Promise<Author>;
  delete(id: number): Promise<void>;
}

export interface ICategoryRepository {
  findById(id: number): Promise<Category | null>;
  findAll(): Promise<Category[]>;
  create(data: CreateCategoryDTO): Promise<Category>;
  update(id: number, data: UpdateCategoryDTO): Promise<Category>;
  delete(id: number): Promise<void>;
}
