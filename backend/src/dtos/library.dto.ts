// ─── Borrowing DTOs ──────────────────────────────────────────────────────────

export interface CreateBorrowingDTO {
  memberId: string;
  bookId: number;
  issuedBy: string;
  dueDate: Date;
}

export interface UpdateBorrowingDTO {
  returnDate?: Date;
  status?: string;
}

// ─── Reservation DTOs ────────────────────────────────────────────────────────

export interface CreateReservationDTO {
  memberId: string;
  bookId: number;
  expiryDate: Date;
}

export interface UpdateReservationDTO {
  status?: string;
}

// ─── Fine DTOs ───────────────────────────────────────────────────────────────

export interface CreateFineDTO {
  borrowingId: number;
  memberId: string;
  amount: number;
}

// ─── Notification DTOs ───────────────────────────────────────────────────────

export interface CreateNotificationDTO {
  userId: number;
  title: string;
  message: string;
  type: string;
}
