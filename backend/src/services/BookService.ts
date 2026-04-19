import { IBookRepository, IAuthorRepository, ICategoryRepository } from '../repositories/interfaces';
import { CreateBookDTO, UpdateBookDTO, BookFilterDTO, CreateAuthorDTO, UpdateAuthorDTO, CreateCategoryDTO, UpdateCategoryDTO } from '../dtos';
import { Book, Author, Category } from '../models';
import { AppError } from '../errors/AppError';

/**
 * BookService — Business logic for book, author, and category management.
 * Demonstrates:
 *   - Dependency Injection via constructor
 *   - Single Responsibility Principle (only book management logic)
 *   - Open/Closed: extensible filters without modifying internals
 */
export class BookService {
  private readonly bookRepository: IBookRepository;
  private readonly authorRepository: IAuthorRepository;
  private readonly categoryRepository: ICategoryRepository;

  constructor(
    bookRepository: IBookRepository,
    authorRepository: IAuthorRepository,
    categoryRepository: ICategoryRepository,
  ) {
    this.bookRepository = bookRepository;
    this.authorRepository = authorRepository;
    this.categoryRepository = categoryRepository;
  }

  async getAllBooks(filters?: BookFilterDTO): Promise<Book[]> {
    return this.bookRepository.findAll(filters);
  }

  async getBookById(id: number): Promise<Book> {
    const book = await this.bookRepository.findById(id);
    if (!book) {
      throw AppError.notFound(`Book with id ${id} not found`);
    }
    return book;
  }

  async addBook(data: CreateBookDTO): Promise<Book> {
    return this.bookRepository.create(data);
  }

  async updateBook(id: number, data: UpdateBookDTO): Promise<Book> {
    await this.getBookById(id); // ensure exists
    return this.bookRepository.update(id, data);
  }

  async deleteBook(id: number): Promise<void> {
    await this.getBookById(id); // ensure exists
    await this.bookRepository.delete(id);
  }

  // ─── Author Management ───────────────────────────────────────────────────

  async getAllAuthors(): Promise<Author[]> {
    return this.authorRepository.findAll();
  }

  async addAuthor(data: CreateAuthorDTO): Promise<Author> {
    return this.authorRepository.create(data);
  }

  async updateAuthor(id: number, data: UpdateAuthorDTO): Promise<Author> {
    return this.authorRepository.update(id, data);
  }

  async deleteAuthor(id: number): Promise<void> {
    return this.authorRepository.delete(id);
  }

  // ─── Category Management ─────────────────────────────────────────────────

  async getAllCategories(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }

  async addCategory(data: CreateCategoryDTO): Promise<Category> {
    return this.categoryRepository.create(data);
  }

  async updateCategory(id: number, data: UpdateCategoryDTO): Promise<Category> {
    return this.categoryRepository.update(id, data);
  }

  async deleteCategory(id: number): Promise<void> {
    return this.categoryRepository.delete(id);
  }
}
