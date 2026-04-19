import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Library, User, Mail, Lock } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'MEMBER' });
  const [isPending, setIsPending] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      toast.success('Account created! Welcome to SLRMS.');
      navigate('/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: { message?: string } } } };
      toast.error(error.response?.data?.error?.message || 'Registration failed');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo"><Library size={36} /></div>
          <h1>Create Account</h1>
          <p>Join the Smart Library System</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <div className="input-wrapper">
              <User size={16} className="input-icon" />
              <input id="reg-name" name="name" type="text" placeholder="Your full name"
                value={form.name} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <div className="input-wrapper">
              <Mail size={16} className="input-icon" />
              <input id="reg-email" name="email" type="email" placeholder="your@email.com"
                value={form.email} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock size={16} className="input-icon" />
              <input id="reg-password" name="password" type="password" placeholder="Min 8 characters"
                value={form.password} onChange={handleChange} required minLength={8} />
            </div>
          </div>
          <div className="form-group">
            <label>Role</label>
            <select id="reg-role" name="role" value={form.role} onChange={handleChange} className="input-select">
              <option value="MEMBER">Member</option>
              <option value="LIBRARIAN">Librarian</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <button id="reg-submit" type="submit" className="btn btn-primary" disabled={isPending}>
            {isPending ? <span className="btn-spinner" /> : 'Create Account'}
          </button>
        </form>
        <p className="auth-footer">Already have an account? <Link to="/login">Sign In</Link></p>
      </div>
    </div>
  );
};

export default RegisterPage;
