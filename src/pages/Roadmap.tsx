import { useAppContext } from '../context/AppContext';

export default function Roadmap() {
  const { roadmap } = useAppContext();

  return (
    <section className="page-roadmap">
      <div className="content-header">
        <div>
          <span className="eyebrow">Learning Roadmap</span>
          <h2>Follow a personalized plan to build the skills employers want.</h2>
          <p>Use structured milestones to close gaps and demonstrate progress in interviews.</p>
        </div>
      </div>

      <div className="feature-grid">
        {roadmap.map((step) => (
          <article key={step.id} className="dashboard-card">
            <h3>{step.title}</h3>
            <p>{step.focus}</p>
            <small>Due in {step.due}</small>
          </article>
        ))}
      </div>
    </section>
  );
}
