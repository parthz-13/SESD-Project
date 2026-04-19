// Domain model interfaces — represent the shape of database entities in the application layer

export enum UserRole {
  ADMIN = 'ADMIN',
  LIBRARIAN = 'LIBRARIAN',
  MEMBER = 'MEMBER',
}

export interface User {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SafeUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
}
