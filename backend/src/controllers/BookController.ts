import { Request, Response, NextFunction } from 'express';
import { BookService } from '../services/BookService';
import { StatusCodes } from 'http-status-codes';

/**
 * BookController — Handles HTTP requests for book, author, and category endpoints.
 */
export class BookController {
  private readonly bookService: BookService;

  constructor(bookService: BookService) {
    this.bookService = bookService;
  }

  getAllBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = {
        title: req.query.title as string,
        isbn: req.query.isbn as string,
        authorId: req.query.authorId ? parseInt(req.query.authorId as string) : undefined,
        categoryId: req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined,
        availableOnly: req.query.availableOnly === 'true',
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      };
      const books = await this.bookService.getAllBooks(filters);
      res.status(StatusCodes.OK).json({ success: true, data: books, count: books.length });
    } catch (error) {
      next(error);
    }
  };

  getBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const book = await this.bookService.getBookById(parseInt(req.params.id));
      res.status(StatusCodes.OK).json({ success: true, data: book });
    } catch (error) {
      next(error);
    }
  };

  addBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const book = await this.bookService.addBook(req.body);
      res.status(StatusCodes.CREATED).json({ success: true, message: 'Book added', data: book });
    } catch (error) {
      next(error);
    }
  };

  updateBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const book = await this.bookService.updateBook(parseInt(req.params.id), req.body);
      res.status(StatusCodes.OK).json({ success: true, message: 'Book updated', data: book });
    } catch (error) {
      next(error);
    }
  };

  deleteBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.bookService.deleteBook(parseInt(req.params.id));
      res.status(StatusCodes.OK).json({ success: true, message: 'Book deleted' });
    } catch (error) {
      next(error);
    }
  };

  // ─── Authors ─────────────────────────────────────────────────────────────

  getAllAuthors = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authors = await this.bookService.getAllAuthors();
      res.status(StatusCodes.OK).json({ success: true, data: authors });
    } catch (error) {
      next(error);
    }
  };

  addAuthor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const author = await this.bookService.addAuthor(req.body);
      res.status(StatusCodes.CREATED).json({ success: true, data: author });
    } catch (error) {
      next(error);
    }
  };

  updateAuthor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const author = await this.bookService.updateAuthor(parseInt(req.params.id), req.body);
      res.status(StatusCodes.OK).json({ success: true, data: author });
    } catch (error) {
      next(error);
    }
  };

  deleteAuthor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.bookService.deleteAuthor(parseInt(req.params.id));
      res.status(StatusCodes.OK).json({ success: true, message: 'Author deleted' });
    } catch (error) {
      next(error);
    }
  };

  // ─── Categories ──────────────────────────────────────────────────────────

  getAllCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categories = await this.bookService.getAllCategories();
      res.status(StatusCodes.OK).json({ success: true, data: categories });
    } catch (error) {
      next(error);
    }
  };

  addCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const category = await this.bookService.addCategory(req.body);
      res.status(StatusCodes.CREATED).json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  };

  updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const category = await this.bookService.updateCategory(parseInt(req.params.id), req.body);
      res.status(StatusCodes.OK).json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  };

  deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.bookService.deleteCategory(parseInt(req.params.id));
      res.status(StatusCodes.OK).json({ success: true, message: 'Category deleted' });
    } catch (error) {
      next(error);
    }
  };
}
