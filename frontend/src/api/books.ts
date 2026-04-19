import api from './axiosInstance';

export const booksApi = {
  getAll: (params?: Record<string, unknown>) => api.get('/books', { params }),
  getById: (id: number) => api.get(`/books/${id}`),
  create: (data: unknown) => api.post('/books', data),
  update: (id: number, data: unknown) => api.put(`/books/${id}`, data),
  delete: (id: number) => api.delete(`/books/${id}`),
  getAuthors: () => api.get('/books/authors/all'),
  createAuthor: (data: unknown) => api.post('/books/authors', data),
  getCategories: () => api.get('/books/categories/all'),
  createCategory: (data: unknown) => api.post('/books/categories', data),
};
