import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../api/auth';

interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'LIBRARIAN' | 'MEMBER';
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('slrms_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('slrms_user');
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const res = await authApi.login({ email, password });
    const { token: newToken, user: newUser } = res.data.data;
    localStorage.setItem('slrms_token', newToken);
    localStorage.setItem('slrms_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const register = async (name: string, email: string, password: string, role?: string): Promise<void> => {
    const res = await authApi.register({ name, email, password, role });
    const { token: newToken, user: newUser } = res.data.data;
    localStorage.setItem('slrms_token', newToken);
    localStorage.setItem('slrms_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = (): void => {
    localStorage.removeItem('slrms_token');
    localStorage.removeItem('slrms_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
