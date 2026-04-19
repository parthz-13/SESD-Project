import api from './axiosInstance';

export const borrowingsApi = {
  issue: (data: { memberId: string; bookId: number; librarianId: string }) =>
    api.post('/borrowings/issue', data),
  returnBook: (id: number) => api.patch(`/borrowings/${id}/return`),
  getMemberHistory: (memberId: string) => api.get(`/borrowings/member/${memberId}`),
  getActive: () => api.get('/borrowings/active'),
  getOverdue: () => api.get('/borrowings/overdue'),
};

export const reservationsApi = {
  reserve: (data: { memberId: string; bookId: number }) => api.post('/reservations', data),
  cancel: (id: number, memberId: string) => api.patch(`/reservations/${id}/cancel`, { memberId }),
  fulfill: (id: number) => api.patch(`/reservations/${id}/fulfill`),
  getMemberReservations: (memberId: string) => api.get(`/reservations/member/${memberId}`),
  getPending: () => api.get('/reservations/pending'),
};

export const finesApi = {
  getAll: () => api.get('/fines'),
  getMemberFines: (memberId: string) => api.get(`/fines/member/${memberId}`),
  pay: (id: number) => api.patch(`/fines/${id}/pay`),
};

export const notificationsApi = {
  getByUser: (userId: number) => api.get(`/notifications/${userId}`),
  markAsRead: (id: number) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: (userId: number) => api.patch(`/notifications/user/${userId}/read-all`),
};
