import { useAppContext } from '../context/AppContext';

export default function Jobs() {
  const { jobs } = useAppContext();

  return (
    <section className="page-jobs">
      <div className="content-header">
        <div>
          <span className="eyebrow">Job Tracker</span>
          <h2>Manage applications and stay on top of opportunities.</h2>
          <p>Track roles, statuses, and next actions from applied to offer stage.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        {jobs.map((job) => (
          <article key={job.id} className="dashboard-card">
            <span className="dashboard-tag">{job.status}</span>
            <h3>{job.title}</h3>
            <p>{job.company}</p>
            <small>{job.location}</small>
          </article>
        ))}
      </div>
    </section>
  );
}
