import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { booksApi } from '../api/books';
import Sidebar from '../components/Sidebar';
import { Search, BookOpen } from 'lucide-react';

const BooksPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['books', search, availableOnly],
    queryFn: () => booksApi.getAll({ title: search || undefined, availableOnly: availableOnly || undefined }),
  });

  const books = data?.data?.data || [];

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1>Book Catalogue</h1>
          <p>Browse and search the library collection</p>
        </div>
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
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-publisher">{book.publisher} · {book.year}</p>
                  <span className={`badge ${book.availableCopies > 0 ? 'badge-success' : 'badge-danger'}`}>
                    {book.availableCopies > 0 ? `${book.availableCopies}/${book.totalCopies} Available` : 'Unavailable'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default BooksPage;
