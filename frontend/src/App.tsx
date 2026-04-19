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
            style: { background: '#1e2030', color: '#cdd6f4', border: '1px solid #313244' },
            success: { iconTheme: { primary: '#a6e3a1', secondary: '#1e2030' } },
            error: { iconTheme: { primary: '#f38ba8', secondary: '#1e2030' } },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
