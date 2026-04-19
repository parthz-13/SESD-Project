import { UserRole } from '../models';

// ─── Auth DTOs ───────────────────────────────────────────────────────────────

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponseDTO {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: UserRole;
  };
}

export interface JwtPayload {
  userId: number;
  role: UserRole;
  iat?: number;
  exp?: number;
}

// ─── User DTOs ───────────────────────────────────────────────────────────────

export interface CreateUserDTO {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  role?: UserRole;
  isActive?: boolean;
}
