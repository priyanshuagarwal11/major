import { useAppContext } from '../context/AppContext';

export default function Resume() {
  const { resumeScore, nextAction, skillGaps } = useAppContext();

  return (
    <section className="page-resume">
      <div className="content-header">
        <div>
          <span className="eyebrow">Resume Assistant</span>
          <h2>Improve your resume with AI recommendations.</h2>
          <p>Get alignment feedback, score insights, and a prioritized action list for stronger applications.</p>
        </div>
      </div>

      <div className="feature-grid">
        <article className="dashboard-card">
          <h3>Resume score</h3>
          <p>{resumeScore}% match against target roles.</p>
        </article>
        <article className="dashboard-card">
          <h3>Next improvement</h3>
          <p>{nextAction}</p>
        </article>
      </div>

      <div className="section-summary">
        <h3>Priority skill areas</h3>
        <ul className="summary-list">
          {skillGaps.map((gap) => (
            <li key={gap}>{gap}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
