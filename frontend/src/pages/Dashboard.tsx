import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Dashboard() {
  const {
    resumeScore,
    interviewConfidence,
    nextAction,
    jobs,
    roadmap,
    skillGaps,
    isLoading,
    error,
    refreshCareerOverview
  } = useAppContext();

  const navigate = useNavigate();

  useEffect(() => {
    refreshCareerOverview();
  }, [refreshCareerOverview]);

  // Aggregate job counts by status
  const appliedCount = jobs.filter(j => j.status === 'Applied').length;
  const interviewingCount = jobs.filter(j => j.status === 'Interviewing').length;
  const offerCount = jobs.filter(j => j.status === 'Offer').length;

  return (
    <section style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <div className="page-intro" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <span className="status-badge primary" style={{ marginBottom: '12px' }}>AI Insights Activated</span>
          <h1>Your Career Hub</h1>
          <p>
            Real-time visual insights, skill indicators, and application metrics unified by intelligent analytics.
          </p>
        </div>
        <button 
          type="button" 
          className="btn-primary" 
          onClick={refreshCareerOverview} 
          disabled={isLoading}
        >
          {isLoading ? 'Syncing...' : '🔄 Re-Sync AI'}
        </button>
      </div>

      {error && (
        <div className="status-badge danger" style={{ width: '100%', padding: '12px 18px', marginBottom: '24px', borderRadius: '8px' }}>
          ⚠️ {error}
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="dashboard-grid">
        {/* Resume Score Card */}
        <div 
          className="dashboard-card col-4" 
          onClick={() => navigate('/resume')}
          style={{ cursor: 'pointer' }}
        >
          <div className="card-title">
            <span>📝</span> Resume Health
          </div>
          <div className="circular-progress-container">
            <div className="circular-progress" style={{ '--percentage': resumeScore } as React.CSSProperties}>
              <div className="circular-progress-value">{resumeScore}%</div>
            </div>
            <div className="summary-widget">
              <span className="summary-label">Target Match</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--accent-light)', fontWeight: 600 }}>Optimized</span>
            </div>
          </div>
        </div>

        {/* Interview Confidence Card */}
        <div 
          className="dashboard-card col-4" 
          onClick={() => navigate('/interview')}
          style={{ cursor: 'pointer' }}
        >
          <div className="card-title">
            <span>🗣️</span> Interview Readiness
          </div>
          <div className="summary-widget" style={{ padding: '10px 0' }}>
            <span className="summary-value" style={{ color: 'var(--secondary)' }}>
              {interviewConfidence}
            </span>
            <span className="summary-label">Confidence Indicator</span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              Next mock: STAR responses
            </span>
          </div>
        </div>

        {/* Action Board Card */}
        <div 
          className="dashboard-card col-4" 
          style={{ background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.05), rgba(236, 72, 153, 0.05))' }}
        >
          <div className="card-title" style={{ color: 'var(--warning)' }}>
            <span>⚡</span> Priority Action
          </div>
          <p style={{ fontSize: '0.95rem', margin: '8px 0 16px', lineHeight: '1.6', color: 'var(--text)' }}>
            {"\""}{nextAction}{"\""}
          </p>
          <Link to="/resume" className="btn-secondary btn-sm">
            Optimize Bullets 🚀
          </Link>
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginTop: '24px' }}>
        {/* Active Pipeline Board */}
        <div className="dashboard-card col-8">
          <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <span>💼 Active Pipeline Summary</span>
            <Link to="/jobs" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
              Open Board →
            </Link>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', margin: '20px 0' }}>
            <div style={{ background: 'var(--surface-alt)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
              <h4 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>{appliedCount}</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Applied</span>
            </div>
            <div style={{ background: 'var(--surface-alt)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
              <h4 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--secondary)' }}>{interviewingCount}</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Interviews</span>
            </div>
            <div style={{ background: 'var(--surface-alt)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
              <h4 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent)' }}>{offerCount}</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Offers</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {jobs.slice(0, 3).map((job) => (
              <div 
                key={job.id} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  background: 'var(--surface-alt)', 
                  padding: '12px 18px', 
                  borderRadius: '10px',
                  border: '1px solid var(--border)'
                }}
              >
                <div>
                  <h5 style={{ fontSize: '0.92rem', fontWeight: 700 }}>{job.title}</h5>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{job.company} • {job.location}</p>
                </div>
                <span className={`status-badge ${
                  job.status === 'Offer' ? 'success' : 
                  job.status === 'Interviewing' ? 'warning' : 
                  job.status === 'Applied' ? 'primary' : ''
                }`}>
                  {job.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Gap Analysis Widget */}
        <div className="dashboard-card col-4">
          <div className="card-title">
            <span>🎯 Target Skill Gaps</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Identified gaps matching target job requirements. Click to master them.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {skillGaps.map((gap, index) => (
              <div 
                key={gap} 
                onClick={() => navigate('/roadmap')}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  background: 'rgba(255, 255, 255, 0.02)', 
                  padding: '12px', 
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>{index + 1}.</span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 500 }}>{gap}</span>
                </div>
                <span style={{ fontSize: '1rem' }}>⚡</span>
              </div>
            ))}
          </div>
          <Link to="/sandbox" className="btn-primary" style={{ width: '100%', marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
            Practice Coding Sandbox 💻
          </Link>
        </div>
      </div>

      {/* Mini Learning Path Panel */}
      <div className="dashboard-card" style={{ marginTop: '24px' }}>
        <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <span>📚 Career Roadmap Timeline</span>
          <Link to="/roadmap" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
            Full Roadmap →
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '16px' }}>
          {roadmap.map((step) => (
            <div 
              key={step.id} 
              onClick={() => navigate('/roadmap')}
              style={{ 
                background: 'var(--surface-alt)', 
                padding: '18px', 
                borderRadius: '12px', 
                border: '1px solid var(--border)',
                position: 'relative',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className={`status-badge ${step.status === 'completed' ? 'success' : step.status === 'active' ? 'primary' : ''}`}>
                  {step.status}
                </span>
                <small style={{ color: 'var(--text-secondary)' }}>Due: {step.due}</small>
              </div>
              <h4 style={{ fontSize: '0.98rem', fontWeight: 700, marginBottom: '6px' }}>{step.title}</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{step.focus}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
