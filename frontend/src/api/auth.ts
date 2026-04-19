import api from './axiosInstance';

export interface LoginData { email: string; password: string; }
export interface RegisterData { name: string; email: string; password: string; role?: string; }

export const authApi = {
  register: (data: RegisterData) => api.post('/auth/register', data),
  login: (data: LoginData) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};
