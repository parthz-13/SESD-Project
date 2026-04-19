export enum MembershipType {
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM',
  STUDENT = 'STUDENT',
}

export interface Member {
  id: string;
  userId: number;
  membershipNumber: string;
  membershipType: MembershipType;
  membershipExpiry: Date;
  outstandingFine: number;
  createdAt: Date;
}

export interface Book {
  id: number;
  title: string;
  isbn: string;
  publisher: string;
  year: number;
  totalCopies: number;
  availableCopies: number;
  description?: string;
  coverImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Author {
  id: number;
  name: string;
  bio?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}
