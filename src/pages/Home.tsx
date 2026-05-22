import { Link } from 'react-router-dom';
import FeatureCard from '../components/FeatureCard';
import { useAppContext } from '../context/AppContext';

export default function Home() {
  const { features, resumeScore, interviewConfidence, jobs, roadmap } = useAppContext();

  return (
    <section style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Hero Panel Section */}
      <div className="hero-panel" style={{ marginTop: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <span className="status-badge primary" style={{ alignSelf: 'flex-start' }}>
            ✨ Introducing Version 2.0
          </span>
          
          <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.04em' }}>
            Accelerate your career with <span style={{ background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI intelligence.</span>
          </h1>
          
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: '1.6', maxWidth: '580px' }}>
            Unlock interactive resume analysis, mock audio interviews, skill gap detection, browser-compiled coding practice, and Kanban job tracking — unified for student success.
          </p>

          <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
            <Link to="/career" className="btn-primary" style={{ padding: '12px 28px' }}>
              Launch Career Hub 🚀
            </Link>
            <Link to="/about" className="btn-secondary" style={{ padding: '12px 28px' }}>
              Platform Overview
            </Link>
          </div>
        </div>

        {/* Visual Outcome Dashboard */}
        <div className="hero-visual">
          <div 
            className="dashboard-card" 
            style={{ 
              width: '100%', 
              background: 'linear-gradient(135deg, rgba(16, 23, 38, 0.8), rgba(22, 32, 53, 0.8))',
              border: '1px solid var(--border-hover)',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            <div className="status-badge success" style={{ marginBottom: '14px' }}>Outcome Signals</div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '8px' }}>Ready for Market?</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              AI compiles your actions across modules to calculate real-world recruiting confidence.
            </p>

            <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li style={{ display: 'flex', justifySelf: 'space-between', justifyContent: 'space-between', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>📝 Resume Score</span>
                <strong style={{ color: 'var(--primary)' }}>{resumeScore}% (Optimized)</strong>
              </li>
              <li style={{ display: 'flex', justifySelf: 'space-between', justifyContent: 'space-between', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>🗣️ Interview Level</span>
                <strong style={{ color: 'var(--secondary)' }}>{interviewConfidence}</strong>
              </li>
              <li style={{ display: 'flex', justifySelf: 'space-between', justifyContent: 'space-between', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>💼 Saved Tracker Jobs</span>
                <strong style={{ color: 'var(--accent-light)' }}>{jobs.length} applications</strong>
              </li>
              <li style={{ display: 'flex', justifySelf: 'space-between', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>📚 Active Roadmap Milestones</span>
                <strong style={{ color: 'var(--warning)' }}>{roadmap.length} Milestones</strong>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Feature Grid Divider */}
      <div style={{ margin: '64px 0 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Explore Copilot Capabilities</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '6px' }}>
          Interactive tools engineered to close skill gaps and streamline workflow.
        </p>
      </div>

      <div className="feature-grid">
        {features.map((feature) => (
          <FeatureCard key={feature.id} {...feature} />
        ))}
      </div>
    </section>
  );
}
