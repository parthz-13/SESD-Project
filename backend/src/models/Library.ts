export enum BorrowingStatus {
  ISSUED = 'ISSUED',
  RETURNED = 'RETURNED',
  OVERDUE = 'OVERDUE',
}

export enum ReservationStatus {
  PENDING = 'PENDING',
  FULFILLED = 'FULFILLED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export enum FineStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
}

export enum NotificationType {
  DUE_REMINDER = 'DUE_REMINDER',
  OVERDUE_ALERT = 'OVERDUE_ALERT',
  AVAILABILITY = 'AVAILABILITY',
  GENERAL = 'GENERAL',
}

export interface Borrowing {
  id: number;
  memberId: string;
  bookId: number;
  issuedBy: string;
  issueDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: BorrowingStatus;
  createdAt: Date;
}

export interface Reservation {
  id: number;
  memberId: string;
  bookId: number;
  reservedOn: Date;
  expiryDate: Date;
  status: ReservationStatus;
  createdAt: Date;
}

export interface Fine {
  id: number;
  borrowingId: number;
  memberId: string;
  amount: number;
  status: FineStatus;
  paidOn?: Date;
  createdAt: Date;
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
}
