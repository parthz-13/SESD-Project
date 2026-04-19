import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { booksApi } from '../api/books';
import { borrowingsApi } from '../api/library';
import { BookOpen, BookMarked, Receipt, AlertTriangle } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const { data: booksData } = useQuery({
    queryKey: ['books'],
    queryFn: () => booksApi.getAll(),
  });

  const { data: activeData } = useQuery({
    queryKey: ['borrowings', 'active'],
    queryFn: () => borrowingsApi.getActive(),
    enabled: user?.role !== 'MEMBER',
  });

  const { data: overdueData } = useQuery({
    queryKey: ['borrowings', 'overdue'],
    queryFn: () => borrowingsApi.getOverdue(),
    enabled: user?.role !== 'MEMBER',
  });

  const stats = [
    { label: 'Total Books', value: booksData?.data?.count ?? '—', icon: BookOpen, color: 'var(--accent-blue)' },
    { label: 'Active Borrowings', value: activeData?.data?.count ?? '—', icon: BookMarked, color: 'var(--accent-green)' },
    { label: 'Overdue', value: overdueData?.data?.count ?? '—', icon: AlertTriangle, color: 'var(--accent-amber)' },
    { label: 'Fines Pending', value: '—', icon: Receipt, color: 'var(--accent-red)' },
  ];

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1>Dashboard</h1>
          <p>Welcome back, <strong>{user?.name}</strong> ({user?.role})</p>
        </div>
        <div className="stats-grid">
          {stats.map((stat) => (
            <div className="stat-card" key={stat.label}>
              <div className="stat-icon" style={{ background: `${stat.color}22`, color: stat.color }}>
                <stat.icon size={24} />
              </div>
              <div className="stat-body">
                <p className="stat-label">{stat.label}</p>
                <h2 className="stat-value">{stat.value}</h2>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
