import { useAppContext } from '../context/AppContext';

export default function Interview() {
  const { interviewConfidence, roadmap } = useAppContext();

  return (
    <section className="page-interview">
      <div className="content-header">
        <div>
          <span className="eyebrow">Mock Interviews</span>
          <h2>Practice with confidence and clear readiness metrics.</h2>
          <p>AI-guided prompts help you prepare for behavioral, technical, and culture-fit rounds.</p>
        </div>
      </div>

      <div className="feature-grid">
        <article className="dashboard-card">
          <h3>Confidence level</h3>
          <p>{interviewConfidence}</p>
        </article>
        <article className="dashboard-card">
          <h3>Upcoming focus</h3>
          <p>{roadmap[1]?.focus ?? 'Refine your interview approach.'}</p>
        </article>
      </div>

      <div className="section-summary">
        <h3>Interview readiness checklist</h3>
        <ul className="summary-list">
          <li>Practice storytelling for STAR responses</li>
          <li>Review relevant technical concepts</li>
          <li>Prepare thoughtful questions for the hiring team</li>
        </ul>
      </div>
    </section>
  );
}
