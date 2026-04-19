import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { finesApi } from '../api/library';
import Sidebar from '../components/Sidebar';
import toast from 'react-hot-toast';
import { Receipt } from 'lucide-react';

const FinesPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['fines'],
    queryFn: () => user?.role === 'ADMIN' ? finesApi.getAll() : finesApi.getMemberFines(''),
  });

  const payMutation = useMutation({
    mutationFn: (id: number) => finesApi.pay(id),
    onSuccess: () => {
      toast.success('Fine paid successfully');
      queryClient.invalidateQueries({ queryKey: ['fines'] });
    },
    onError: () => toast.error('Failed to pay fine'),
  });

  const fines = data?.data?.data || [];

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1>Fines</h1>
          <p>Manage outstanding and paid library fines</p>
        </div>
        {isLoading ? (
          <div className="loading-state"><div className="spinner" /></div>
        ) : fines.length === 0 ? (
          <div className="empty-state"><Receipt size={48} /><p>No fines found</p></div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Paid On</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {fines.map((f: { id: number; amount: number; status: string; paidOn?: string }) => (
                  <tr key={f.id}>
                    <td>#{f.id}</td>
                    <td>₹{f.amount.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${f.status === 'PAID' ? 'badge-success' : 'badge-danger'}`}>
                        {f.status}
                      </span>
                    </td>
                    <td>{f.paidOn ? new Date(f.paidOn).toLocaleDateString() : '—'}</td>
                    <td>
                      {f.status === 'UNPAID' && (
                        <button
                          id={`pay-fine-${f.id}`}
                          className="btn btn-sm btn-primary"
                          onClick={() => payMutation.mutate(f.id)}
                          disabled={payMutation.isPending}
                        >
                          Pay
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

export default FinesPage;
