import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthLoading, authError } = useAuthContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(email, password);
      navigate('/career');
    } catch {
      // error already stored in context
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <span className="status-badge primary">Welcome Back</span>

        <h1>Login to AI Career Copilot</h1>
        <p>
          Continue your resume analysis, interview practice, roadmap progress, and job tracking.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
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
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {authError && <div className="auth-error">{authError}</div>}

          <button type="submit" className="btn-primary" disabled={isAuthLoading}>
            {isAuthLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-switch">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </section>
  );
}