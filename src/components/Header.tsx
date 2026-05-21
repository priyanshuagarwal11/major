import { NavLink } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/career', label: 'Career Hub' },
  { path: '/resume', label: 'Resume' },
  { path: '/interview', label: 'Interview' },
  { path: '/jobs', label: 'Job Tracker' },
  { path: '/roadmap', label: 'Roadmap' },
  { path: '/about', label: 'About' }
];

export default function Header() {
  const { theme, toggleTheme } = useAppContext();

  return (
    <header className="header-shell">
      <div className="brand">
        <strong>AI Career Copilot</strong>
        <span>Career growth assistant</span>
      </div>

      <nav className="nav-links">
        {navItems.map((item) => (
          <NavLink key={item.path} to={item.path} className={({ isActive }) => (isActive ? 'active' : '')}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button type="button" className="theme-toggle" onClick={toggleTheme}>
        {theme === 'dark' ? 'Light mode' : 'Dark mode'}
      </button>
    </header>
  );
}
