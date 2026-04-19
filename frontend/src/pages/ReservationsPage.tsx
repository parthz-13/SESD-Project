import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationsApi, type Reservation } from '../api/reservations';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { Bookmark, Trash2, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

const ReservationsPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['reservations', user?.memberId],
    queryFn: () => reservationsApi.getMemberReservations(user?.memberId as string),
    enabled: !!user?.memberId,
  });

  const cancelMutation = useMutation({
    mutationFn: (id: number) => reservationsApi.cancel(id, user?.memberId as string),
    onSuccess: () => {
      toast.success('Reservation cancelled');
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to cancel reservation');
    },
  });

  const reservations = data?.data?.data || [];

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1>My Reservations</h1>
          <p>Books you have put on hold</p>
        </div>

        {isLoading ? (
          <div className="loading-state"><div className="spinner" /></div>
        ) : reservations.length === 0 ? (
          <div className="empty-state">
            <Bookmark size={48} />
            <p>You have no active reservations</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Reserved On</th>
                  <th>Expires</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation: Reservation) => (
                  <tr key={reservation.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '56px', background: 'var(--bg-overlay)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', color: 'var(--accent-blue)' }}>
                          <BookOpen size={20} />
                        </div>
                        <span style={{ fontWeight: 500 }}>{reservation.book?.title || `Book #${reservation.bookId}`}</span>
                      </div>
                    </td>
                    <td>{new Date(reservation.reservedOn).toLocaleDateString()}</td>
                    <td>{new Date(reservation.expiryDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge badge-${reservation.status === 'PENDING' ? 'warning' : reservation.status === 'FULFILLED' ? 'success' : 'danger'}`}>
                        {reservation.status}
                      </span>
                    </td>
                    <td>
                      {reservation.status === 'PENDING' && (
                        <button
                          className="btn btn-sm"
                          style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--accent-red)' }}
                          onClick={() => cancelMutation.mutate(reservation.id)}
                          disabled={cancelMutation.isPending}
                        >
                          <Trash2 size={16} /> Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default ReservationsPage;
