import { MembershipType } from '../models';

// ─── Book DTOs ───────────────────────────────────────────────────────────────

export interface CreateBookDTO {
  title: string;
  isbn: string;
  publisher: string;
  year: number;
  totalCopies: number;
  description?: string;
  coverImage?: string;
  authorIds?: number[];
  categoryIds?: number[];
}

export interface UpdateBookDTO {
  title?: string;
  publisher?: string;
  year?: number;
  totalCopies?: number;
  description?: string;
  coverImage?: string;
  authorIds?: number[];
  categoryIds?: number[];
}

export interface BookFilterDTO {
  title?: string;
  isbn?: string;
  authorId?: number;
  categoryId?: number;
  availableOnly?: boolean;
  page?: number;
  limit?: number;
}

// ─── Member DTOs ─────────────────────────────────────────────────────────────

export interface CreateMemberDTO {
  userId: number;
  membershipType: MembershipType;
  membershipExpiry: Date;
}

// ─── Author DTOs ─────────────────────────────────────────────────────────────

export interface CreateAuthorDTO {
  name: string;
  bio?: string;
}

export interface UpdateAuthorDTO {
  name?: string;
  bio?: string;
}

// ─── Category DTOs ───────────────────────────────────────────────────────────

export interface CreateCategoryDTO {
  name: string;
  description?: string;
}

export interface UpdateCategoryDTO {
  name?: string;
  description?: string;
}
