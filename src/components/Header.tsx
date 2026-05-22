import { NavLink, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useAuthContext } from '../context/AuthContext';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/career', label: 'Career Hub' },
  { path: '/resume', label: 'Resume' },
  { path: '/interview', label: 'Interview' },
  { path: '/jobs', label: 'Job Tracker' },
  { path: '/roadmap', label: 'Roadmap' },
  { path: '/sandbox', label: 'Coding Sandbox' },
  { path: '/about', label: 'About' }
];

export default function Header() {
  const { theme, toggleTheme, resumeScore } = useAppContext();
  const { user, isAuthenticated, logout } = useAuthContext();

  return (
    <header className="header-shell">
      <Link to="/" className="brand" aria-label="AI Career Copilot home">
        <div className="brand-logo">
          <span>AI</span>
        </div>

        <div className="brand-text">
          <strong>Career Copilot</strong>
          <span>AI placement assistant</span>
        </div>
      </Link>

      <nav className="nav-links" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="header-actions">
        <div className="score-pill" title="Dynamic Resume Alignment Score">
          <span>Score</span>
          <strong>{resumeScore}%</strong>
        </div>

        {isAuthenticated ? (
          <div className="auth-actions">
            <span className="user-chip">Hi, {user?.name}</span>
            <button type="button" className="btn-secondary header-btn" onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-actions">
            <Link to="/login" className="btn-secondary header-btn">
              Login
            </Link>
            <Link to="/signup" className="btn-primary header-btn">
              Sign up
            </Link>
          </div>
        )}

        <button
          type="button"
          className={`theme-mode-toggle ${theme === 'dark' ? 'dark-active' : 'light-active'}`}
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          title={theme === 'dark' ? 'Dark theme active' : 'Light theme active'}
        >
          <span className="theme-toggle-track">
            <span className="theme-toggle-thumb">{theme === 'dark' ? '🌙' : '☀️'}</span>
          </span>
        </button>
      </div>
    </header>
  );
}