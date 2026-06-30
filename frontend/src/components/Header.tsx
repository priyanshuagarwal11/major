import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useAuthContext } from '../context/AuthContext';

export default function Header() {
  const { theme, toggleTheme, resumeScore } = useAppContext();
  const { user, isAuthenticated, logout } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();

  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const lastScrollY = useRef(0);

  const isLandingPage = location.pathname === '/';

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const threshold = 20;

      if (Math.abs(currentScrollY - lastScrollY.current) < threshold) {
        return;
      }

      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setIsHeaderHidden(true);
      } else {
        setIsHeaderHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerVariants = {
    hidden: { y: -120, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.header
      initial="visible"
      animate={isHeaderHidden ? 'hidden' : 'visible'}
      variants={headerVariants}
      transition={{ duration: 0.45, ease: 'easeInOut' }}
      className={`header-shell glass-card ${isHeaderHidden ? 'header-hidden' : ''}`}
    >
      <Link to="/" className="brand" aria-label="AI Career Copilot home">
        <div className="logo-icon">
          <span>Ω</span>
        </div>

        <div className="brand-text">
          <strong>AI Career Copilot</strong>
          <span>AI Placement Suite</span>
        </div>
      </Link>

      <nav className="nav-links" aria-label="Main navigation">
        {isLandingPage ? (
          <>
            <a href="#features" onClick={(e) => handleAnchorClick(e, 'features')}>Features</a>
            <a href="#ai-systems" onClick={(e) => handleAnchorClick(e, 'ai-systems')}>AI Architecture</a>
            <a href="#chat-preview" onClick={(e) => handleAnchorClick(e, 'chat-preview')}>AI Mentor</a>
            <a href="#pricing" onClick={(e) => handleAnchorClick(e, 'pricing')}>Pricing</a>
            <a href="#testimonials" onClick={(e) => handleAnchorClick(e, 'testimonials')}>Testimonials</a>
          </>
        ) : (
          <>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>Home</NavLink>
            <NavLink to="/career" className={({ isActive }) => (isActive ? 'active' : '')}>Career Hub</NavLink>
            <NavLink to="/resume" className={({ isActive }) => (isActive ? 'active' : '')}>Resume</NavLink>
            <NavLink to="/interview" className={({ isActive }) => (isActive ? 'active' : '')}>Interview</NavLink>
            <NavLink to="/jobs" className={({ isActive }) => (isActive ? 'active' : '')}>Job Tracker</NavLink>
            <NavLink to="/roadmap" className={({ isActive }) => (isActive ? 'active' : '')}>Roadmap</NavLink>
            <NavLink to="/sandbox" className={({ isActive }) => (isActive ? 'active' : '')}>Sandbox</NavLink>
          </>
        )}
      </nav>

      <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {!isLandingPage && (
          <div className="score-pill" title="Dynamic Resume Alignment Score" style={{
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            padding: '4px 12px',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            color: 'var(--primary)',
            display: 'flex',
            gap: '6px'
          }}>
            <span>ATS Score:</span>
            <strong>{resumeScore}%</strong>
          </div>
        )}

        {isAuthenticated ? (
          <div className="auth-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/career" className="btn-saas-outline-glow" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              Launch App 🚀
            </Link>
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={logout}
              style={{ padding: '8px 16px', fontSize: '0.85rem', background: 'transparent', border: 'none' }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/login" className="btn-saas-outline-glow" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
              Login
            </Link>
            <Link to="/signup" className="btn-saas-gradient" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
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
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border)',
            padding: '6px 10px',
            borderRadius: '9999px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>
      </div>
    </motion.header>
  );
}