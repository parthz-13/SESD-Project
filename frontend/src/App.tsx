import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BooksPage from './pages/BooksPage';
import BorrowingsPage from './pages/BorrowingsPage';
import FinesPage from './pages/FinesPage';
import ReservationsPage from './pages/ReservationsPage';
import NotificationsPage from './pages/NotificationsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected — all roles */}
            <Route path="/dashboard" element={
              <ProtectedRoute><DashboardPage /></ProtectedRoute>
            } />
            <Route path="/books" element={
              <ProtectedRoute><BooksPage /></ProtectedRoute>
            } />
            <Route path="/fines" element={
              <ProtectedRoute><FinesPage /></ProtectedRoute>
            } />
            <Route path="/reservations" element={
              <ProtectedRoute><ReservationsPage /></ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute><NotificationsPage /></ProtectedRoute>
            } />

            {/* Protected — admin/librarian only */}
            <Route path="/borrowings" element={
              <ProtectedRoute roles={['ADMIN', 'LIBRARIAN']}><BorrowingsPage /></ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border)' },
            success: { iconTheme: { primary: 'var(--accent-green)', secondary: 'var(--bg-surface)' } },
            error: { iconTheme: { primary: 'var(--accent-red)', secondary: 'var(--bg-surface)' } },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
