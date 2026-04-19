import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { borrowingsApi } from '../api/library';
import Sidebar from '../components/Sidebar';
import { format } from 'date-fns';
import { BookMarked } from 'lucide-react';

const BorrowingsPage: React.FC = () => {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ['borrowings', 'active'],
    queryFn: () => borrowingsApi.getActive(),
    enabled: user?.role !== 'MEMBER',
  });

  const borrowings = data?.data?.data || [];

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1>Active Borrowings</h1>
          <p>All currently issued books</p>
        </div>
        {isLoading ? (
          <div className="loading-state"><div className="spinner" /></div>
        ) : borrowings.length === 0 ? (
          <div className="empty-state"><BookMarked size={48} /><p>No active borrowings</p></div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Member</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {borrowings.map((b: {
                  id: number;
                  book?: { title?: string };
                  member?: { user?: { name?: string } };
                  issueDate: string;
                  dueDate: string;
                  status: string;
                }) => (
                  <tr key={b.id}>
                    <td>{b.book?.title ?? '—'}</td>
                    <td>{b.member?.user?.name ?? '—'}</td>
                    <td>{format(new Date(b.issueDate), 'dd MMM yyyy')}</td>
                    <td>{format(new Date(b.dueDate), 'dd MMM yyyy')}</td>
                    <td>
                      <span className={`badge badge-${b.status === 'OVERDUE' ? 'danger' : b.status === 'RETURNED' ? 'success' : 'info'}`}>
                        {b.status}
                      </span>
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

export default BorrowingsPage;
