import { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import Loader from '../components/Loader';

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

  useEffect(() => {
    refreshCareerOverview();
  }, [refreshCareerOverview]);

  return (
    <section className="page-dashboard">
      <div className="content-header">
        <div>
          <span className="eyebrow">Career Hub</span>
          <h2>Track your journey with AI frictionless insights.</h2>
          <p>Resume, interview, and application signals are updated together for a clear next step.</p>
        </div>
        <button type="button" onClick={refreshCareerOverview} disabled={isLoading}>
          {isLoading ? 'Refreshing...' : 'Refresh insights'}
        </button>
      </div>

      {error && <div className="alert-banner">{error}</div>}
      {isLoading && <Loader />}

      <div className="feature-grid">
        <article className="dashboard-card">
          <span className="dashboard-tag">Resume</span>
          <h3>Resume score</h3>
          <p>{resumeScore}% alignment with target roles.</p>
        </article>
        <article className="dashboard-card">
          <span className="dashboard-tag">Interview</span>
          <h3>Confidence level</h3>
          <p>{interviewConfidence}</p>
        </article>
        <article className="dashboard-card">
          <span className="dashboard-tag">Next step</span>
          <h3>Action plan</h3>
          <p>{nextAction}</p>
        </article>
      </div>

      <div className="section-summary">
        <h3>Skill gaps to close</h3>
        <ul className="summary-list">
          {skillGaps.map((gap) => (
            <li key={gap}>{gap}</li>
          ))}
        </ul>
      </div>

      <div className="dashboard-grid">
        {jobs.map((job) => (
          <article key={job.id} className="dashboard-card">
            <span className="dashboard-tag">{job.status}</span>
            <h3>{job.title}</h3>
            <p>{job.company} • {job.location}</p>
          </article>
        ))}
      </div>

      <div className="section-summary">
        <h3>Current roadmap</h3>
        <div className="feature-grid">
          {roadmap.map((step) => (
            <article key={step.id} className="dashboard-card">
              <h4>{step.title}</h4>
              <p>{step.focus}</p>
              <small>{step.due}</small>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
