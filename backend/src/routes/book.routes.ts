import { Router } from 'express';
import { prisma } from '../config/database';
import { BookRepository, AuthorRepository, CategoryRepository } from '../repositories/BookRepository';
import { BookService } from '../services/BookService';
import { BookController } from '../controllers/BookController';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { UserRole } from '../models';

const router = Router();
const bookRepository = new BookRepository(prisma);
const authorRepository = new AuthorRepository(prisma);
const categoryRepository = new CategoryRepository(prisma);
const bookService = new BookService(bookRepository, authorRepository, categoryRepository);
const bookController = new BookController(bookService);

// ─── Books ────────────────────────────────────────────────────────────────────
// GET /api/books — public
router.get('/', bookController.getAllBooks);

// GET /api/books/:id — public
router.get('/:id', bookController.getBook);

// POST /api/books — admin/librarian
router.post('/', authenticate, authorize(UserRole.ADMIN, UserRole.LIBRARIAN), bookController.addBook);

// PUT /api/books/:id — admin/librarian
router.put('/:id', authenticate, authorize(UserRole.ADMIN, UserRole.LIBRARIAN), bookController.updateBook);

// DELETE /api/books/:id — admin/librarian
router.delete('/:id', authenticate, authorize(UserRole.ADMIN, UserRole.LIBRARIAN), bookController.deleteBook);

// ─── Authors ──────────────────────────────────────────────────────────────────
router.get('/authors/all', bookController.getAllAuthors);
router.post('/authors', authenticate, authorize(UserRole.ADMIN, UserRole.LIBRARIAN), bookController.addAuthor);
router.put('/authors/:id', authenticate, authorize(UserRole.ADMIN, UserRole.LIBRARIAN), bookController.updateAuthor);
router.delete('/authors/:id', authenticate, authorize(UserRole.ADMIN), bookController.deleteAuthor);

// ─── Categories ───────────────────────────────────────────────────────────────
router.get('/categories/all', bookController.getAllCategories);
router.post('/categories', authenticate, authorize(UserRole.ADMIN, UserRole.LIBRARIAN), bookController.addCategory);
router.put('/categories/:id', authenticate, authorize(UserRole.ADMIN, UserRole.LIBRARIAN), bookController.updateCategory);
router.delete('/categories/:id', authenticate, authorize(UserRole.ADMIN), bookController.deleteCategory);

export default router;
