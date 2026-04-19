import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen, LayoutDashboard, BookMarked, ClipboardList,
  Bell, Users, LogOut, Receipt, Library,
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'LIBRARIAN', 'MEMBER'] },
    { label: 'Books', path: '/books', icon: BookOpen, roles: ['ADMIN', 'LIBRARIAN', 'MEMBER'] },
    { label: 'Borrowings', path: '/borrowings', icon: BookMarked, roles: ['ADMIN', 'LIBRARIAN'] },
    { label: 'Reservations', path: '/reservations', icon: ClipboardList, roles: ['ADMIN', 'LIBRARIAN', 'MEMBER'] },
    { label: 'Fines', path: '/fines', icon: Receipt, roles: ['ADMIN', 'LIBRARIAN', 'MEMBER'] },
    { label: 'Notifications', path: '/notifications', icon: Bell, roles: ['ADMIN', 'LIBRARIAN', 'MEMBER'] },
    { label: 'Users', path: '/users', icon: Users, roles: ['ADMIN'] },
  ];

  const visibleNav = navItems.filter(item => item.roles.includes(user?.role || ''));

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Library size={28} className="brand-icon" />
        <span className="brand-text">SLRMS</span>
      </div>
      <nav className="sidebar-nav">
        {visibleNav.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          <div className="user-details">
            <p className="user-name">{user?.name}</p>
            <p className="user-role">{user?.role}</p>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
