import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi, type Notification } from '../api/notifications';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { Bell, Check, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: () => notificationsApi.getUserNotifications(user?.id as number),
    enabled: !!user?.id,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: number) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(user?.id as number),
    onSuccess: () => {
      toast.success('All marked as read');
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const notifications = data?.data?.data || [];
  const unreadCount = notifications.filter((n: Notification) => !n.isRead).length;

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Notifications</h1>
            <p>Stay updated on your library activities</p>
          </div>
          {unreadCount > 0 && (
            <button 
              className="btn" 
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              onClick={() => markAllAsReadMutation.mutate()}
              disabled={markAllAsReadMutation.isPending}
            >
              <CheckCircle2 size={16} /> Mark all as read
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="loading-state"><div className="spinner" /></div>
        ) : notifications.length === 0 ? (
          <div className="empty-state">
            <Bell size={48} />
            <p>You have no notifications</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {notifications.map((notification: Notification) => (
              <div 
                key={notification.id} 
                style={{
                  background: 'var(--bg-surface)',
                  border: `1px solid ${notification.isRead ? 'var(--border)' : 'var(--accent-blue)'}`,
                  padding: '20px',
                  borderRadius: 'var(--radius)',
                  display: 'flex',
                  gap: '16px',
                  opacity: notification.isRead ? 0.7 : 1,
                  boxShadow: notification.isRead ? 'none' : 'var(--shadow)',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ 
                  width: '48px', height: '48px', 
                  borderRadius: '50%', 
                  background: 'var(--bg-overlay)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: notification.isRead ? 'var(--text-muted)' : 'var(--accent-blue)',
                  flexShrink: 0
                }}>
                  <Bell size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {notification.title}
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '12px' }}>
                    {notification.message}
                  </p>
                  
                  {!notification.isRead && (
                    <button 
                      onClick={() => markAsReadMutation.mutate(notification.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--accent-blue)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: 0
                      }}
                      disabled={markAsReadMutation.isPending}
                    >
                      <Check size={14} /> Mark as read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default NotificationsPage;
