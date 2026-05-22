import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

export default function Signup() {
  const navigate = useNavigate();
  const { signup, isAuthLoading, authError } = useAuthContext();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signup(name, email, password);
      navigate('/career');
    } catch {
      // error already stored in context
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <span className="status-badge success">Start Free</span>

        <h1>Create your account</h1>
        <p>
          Build your career profile and start tracking resume score, interviews, jobs, and roadmaps.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Name</label>
            <input
              className="form-input"
              type="text"
              placeholder="Kritarth"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              className="form-input"
              type="email"
              placeholder="kritarth@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {authError && <div className="auth-error">{authError}</div>}

          <button type="submit" className="btn-primary" disabled={isAuthLoading}>
            {isAuthLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </section>
  );
}