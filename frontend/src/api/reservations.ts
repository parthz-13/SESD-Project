import api from './axiosInstance';

export interface Reservation {
  id: number;
  memberId: string;
  bookId: number;
  reservedOn: string;
  expiryDate: string;
  status: 'PENDING' | 'FULFILLED' | 'CANCELLED' | 'EXPIRED';
  book?: {
    id: number;
    title: string;
    coverImage: string | null;
  };
}

export const reservationsApi = {
  reserve: (data: { memberId: string; bookId: number }) => 
    api.post('/reservations', data),

  cancel: (id: number, memberId: string) => 
    api.patch(`/reservations/${id}/cancel`, { memberId }),

  getMemberReservations: (memberId: string) => 
    api.get(`/reservations/member/${memberId}`),
};
