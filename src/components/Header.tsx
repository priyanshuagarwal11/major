import { NavLink } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

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

  return (
    <header className="header-shell">
      <div className="brand">
        <div className="logo-icon">🚀</div>
        <div className="brand-text">
          <strong>AI Career Copilot</strong>
          <span>Elevating Student Growth</span>
        </div>
      </div>

      <nav className="nav-links">
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
        <div 
          style={{ 
            fontSize: '0.85rem', 
            fontWeight: 600, 
            background: 'rgba(56, 189, 248, 0.1)', 
            color: 'var(--primary)', 
            padding: '4px 10px', 
            borderRadius: '9999px',
            border: '1px solid rgba(56, 189, 248, 0.15)'
          }}
          title="Dynamic Resume Alignment Score"
        >
          Score: {resumeScore}%
        </div>
        
        <button 
          type="button" 
          className="theme-toggle-btn" 
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}
