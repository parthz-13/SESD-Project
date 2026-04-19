import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { booksApi } from '../api/books';
import { reservationsApi } from '../api/reservations';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { Search, BookOpen, BookmarkPlus, Plus, X, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Author { id: number; name: string; }
interface Category { id: number; name: string; }

interface AddBookForm {
  title: string;
  isbn: string;
  publisher: string;
  year: string;
  totalCopies: string;
  description: string;
  authorIds: number[];
  categoryIds: number[];
}

const EMPTY_FORM: AddBookForm = {
  title: '',
  isbn: '',
  publisher: '',
  year: new Date().getFullYear().toString(),
  totalCopies: '1',
  description: '',
  authorIds: [],
  categoryIds: [],
};

const BooksPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState<AddBookForm>(EMPTY_FORM);

  const { user } = useAuth();
  const queryClient = useQueryClient();

  const isLibrarian = user?.role === 'LIBRARIAN' || user?.role === 'ADMIN';

  // ─── Fetch catalogue ───────────────────────────────────────────────────────
  const { data, isLoading } = useQuery({
    queryKey: ['books', search, availableOnly],
    queryFn: () => booksApi.getAll({ title: search || undefined, availableOnly: availableOnly || undefined }),
  });

  // ─── Fetch authors + categories for the modal ─────────────────────────────
  const { data: authorsData } = useQuery({
    queryKey: ['authors'],
    queryFn: () => booksApi.getAuthors(),
    enabled: showAddModal,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => booksApi.getCategories(),
    enabled: showAddModal,
  });

  const authors: Author[] = authorsData?.data?.data ?? [];
  const categories: Category[] = categoriesData?.data?.data ?? [];

  // ─── Reserve mutation ─────────────────────────────────────────────────────
  const reserveMutation = useMutation({
    mutationFn: (bookId: number) =>
      reservationsApi.reserve({ memberId: user?.memberId as string, bookId }),
    onSuccess: () => {
      toast.success('Book reserved successfully!');
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to reserve book');
    },
  });

  // ─── Add book mutation ────────────────────────────────────────────────────
  const addBookMutation = useMutation({
    mutationFn: (payload: object) => booksApi.create(payload),
    onSuccess: () => {
      toast.success('Book added to catalogue!');
      queryClient.invalidateQueries({ queryKey: ['books'] });
      setShowAddModal(false);
      setForm(EMPTY_FORM);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add book');
    },
  });

  // ─── Delete book mutation ─────────────────────────────────────────────────
  const deleteBookMutation = useMutation({
    mutationFn: (id: number) => booksApi.delete(id),
    onSuccess: () => {
      toast.success('Book deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete book');
    },
  });

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const toggleId = (list: number[], id: number): number[] =>
    list.includes(id) ? list.filter((x) => x !== id) : [...list, id];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.isbn.trim() || !form.publisher.trim()) {
      toast.error('Title, ISBN, and Publisher are required.');
      return;
    }
    addBookMutation.mutate({
      title: form.title.trim(),
      isbn: form.isbn.trim(),
      publisher: form.publisher.trim(),
      year: parseInt(form.year),
      totalCopies: parseInt(form.totalCopies),
      description: form.description.trim() || undefined,
      authorIds: form.authorIds,
      categoryIds: form.categoryIds,
    });
  };

  const books = data?.data?.data || [];

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">

        {/* ── Page Header ── */}
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1>Book Catalogue</h1>
            <p>Browse and search the library collection</p>
          </div>
          {isLibrarian && (
            <button
              id="add-book-btn"
              className="btn btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={16} /> Add Book
            </button>
          )}
        </div>

        {/* ── Toolbar ── */}
        <div className="toolbar">
          <div className="search-wrapper">
            <Search size={16} className="search-icon" />
            <input
              id="book-search"
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          <label className="checkbox-label">
            <input
              id="available-only-toggle"
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
            />
            Available only
          </label>
        </div>

        {/* ── Books Grid ── */}
        {isLoading ? (
          <div className="loading-state"><div className="spinner" /></div>
        ) : books.length === 0 ? (
          <div className="empty-state">
            <BookOpen size={48} />
            <p>No books found</p>
          </div>
        ) : (
          <div className="books-grid">
            {books.map((book: {
              id: number;
              title: string;
              publisher: string;
              year: number;
              availableCopies: number;
              totalCopies: number;
            }) => (
              <div key={book.id} className="book-card">
                <div className="book-cover">
                  <BookOpen size={32} />
                </div>
                <div className="book-info">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 className="book-title">{book.title}</h3>
                    {isLibrarian && (
                      <button
                        className="btn-icon text-danger"
                        title="Delete Book"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('Are you sure you want to delete this book?')) {
                            deleteBookMutation.mutate(book.id);
                          }
                        }}
                        disabled={deleteBookMutation.isPending}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <p className="book-publisher">{book.publisher} · {book.year}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                    <span className={`badge ${book.availableCopies > 0 ? 'badge-success' : 'badge-danger'}`}>
                      {book.availableCopies > 0
                        ? `${book.availableCopies}/${book.totalCopies} Available`
                        : 'Unavailable'}
                    </span>
                    {user?.role === 'MEMBER' && book.availableCopies === 0 && (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          reserveMutation.mutate(book.id);
                        }}
                        disabled={reserveMutation.isPending || !user.memberId}
                      >
                        <BookmarkPlus size={14} /> Reserve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ═══════════════════════════════════════════
          ADD BOOK MODAL
      ═══════════════════════════════════════════ */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div
            className="modal-panel"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-book-title"
          >
            {/* Header */}
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="modal-icon">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h2 id="add-book-title" className="modal-title">Add New Book</h2>
                  <p className="modal-subtitle">Fill in the details to add to the catalogue</p>
                </div>
              </div>
              <button
                id="close-add-book-modal"
                className="modal-close-btn"
                onClick={() => setShowAddModal(false)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form id="add-book-form" onSubmit={handleSubmit} className="modal-body">

              {/* Row 1: Title + ISBN */}
              <div className="modal-row">
                <div className="form-group">
                  <label htmlFor="book-title">Title *</label>
                  <input
                    id="book-title"
                    type="text"
                    className="modal-input"
                    placeholder="e.g. Clean Code"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="book-isbn">ISBN *</label>
                  <input
                    id="book-isbn"
                    type="text"
                    className="modal-input"
                    placeholder="e.g. 978-3-16-148410-0"
                    value={form.isbn}
                    onChange={(e) => setForm({ ...form, isbn: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Row 2: Publisher + Year + Copies */}
              <div className="modal-row">
                <div className="form-group" style={{ flex: 2 }}>
                  <label htmlFor="book-publisher">Publisher *</label>
                  <input
                    id="book-publisher"
                    type="text"
                    className="modal-input"
                    placeholder="e.g. Prentice Hall"
                    value={form.publisher}
                    onChange={(e) => setForm({ ...form, publisher: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="book-year">Year</label>
                  <input
                    id="book-year"
                    type="number"
                    className="modal-input"
                    min={1000}
                    max={new Date().getFullYear()}
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="book-copies">Total Copies</label>
                  <input
                    id="book-copies"
                    type="number"
                    className="modal-input"
                    min={1}
                    value={form.totalCopies}
                    onChange={(e) => setForm({ ...form, totalCopies: e.target.value })}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label htmlFor="book-description">Description</label>
                <textarea
                  id="book-description"
                  className="modal-input modal-textarea"
                  placeholder="Optional short description..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                />
              </div>

              {/* Authors */}
              <div className="form-group">
                <label>Authors</label>
                {authors.length === 0 ? (
                  <p className="modal-hint">No authors found. Add authors first via the API.</p>
                ) : (
                  <div className="chip-group">
                    {authors.map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        id={`author-chip-${a.id}`}
                        className={`chip ${form.authorIds.includes(a.id) ? 'chip-active' : ''}`}
                        onClick={() => setForm({ ...form, authorIds: toggleId(form.authorIds, a.id) })}
                      >
                        {a.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Categories */}
              <div className="form-group">
                <label>Categories</label>
                {categories.length === 0 ? (
                  <p className="modal-hint">No categories found. Add categories first via the API.</p>
                ) : (
                  <div className="chip-group">
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        id={`category-chip-${c.id}`}
                        className={`chip ${form.categoryIds.includes(c.id) ? 'chip-active' : ''}`}
                        onClick={() => setForm({ ...form, categoryIds: toggleId(form.categoryIds, c.id) })}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="modal-footer">
                <button
                  type="button"
                  id="cancel-add-book"
                  className="btn btn-ghost"
                  onClick={() => { setShowAddModal(false); setForm(EMPTY_FORM); }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="submit-add-book"
                  className="btn btn-primary"
                  disabled={addBookMutation.isPending}
                >
                  {addBookMutation.isPending
                    ? <><span className="btn-spinner" /> Adding…</>
                    : <><Plus size={16} /> Add Book</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksPage;
