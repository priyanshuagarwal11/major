import { useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import type { JobItem } from '../types';

const columns: JobItem['status'][] = ['Wishlist', 'Applied', 'Interviewing', 'Offer', 'Rejected'];

const emptyJobForm = {
  title: '',
  company: '',
  location: '',
  salary: '',
  status: 'Wishlist' as JobItem['status'],
  notes: '',
  dateApplied: ''
};

export default function Jobs() {
  const { jobs, setJobs } = useAppContext();

  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<JobItem | null>(null);
  const [jobForm, setJobForm] = useState(emptyJobForm);

  const [selectedStrategyJob, setSelectedStrategyJob] = useState<JobItem | null>(null);

  const pipelineStats = useMemo(() => {
    return columns.map((status) => ({
      status,
      count: jobs.filter((job) => job.status === status).length
    }));
  }, [jobs]);

  const updateJobForm = (field: keyof typeof emptyJobForm, value: string) => {
    setJobForm((current) => ({
      ...current,
      [field]: value
    }));
  };

  const resetJobForm = () => {
    setJobForm(emptyJobForm);
    setEditingJob(null);
    setShowJobForm(false);
  };

  const openAddForm = () => {
    setEditingJob(null);
    setJobForm(emptyJobForm);
    setShowJobForm(true);
  };

  const openEditForm = (job: JobItem) => {
    setEditingJob(job);
    setJobForm({
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary || '',
      status: job.status,
      notes: job.notes || '',
      dateApplied: job.dateApplied || ''
    });
    setShowJobForm(true);
  };

  const handleJobFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!jobForm.title.trim() || !jobForm.company.trim()) return;

    if (editingJob) {
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === editingJob.id
            ? {
                ...job,
                title: jobForm.title.trim(),
                company: jobForm.company.trim(),
                location: jobForm.location.trim() || 'Remote',
                salary: jobForm.salary.trim() || 'Undisclosed',
                status: jobForm.status,
                dateApplied:
                  jobForm.dateApplied ||
                  (jobForm.status !== 'Wishlist'
                    ? new Date().toISOString().split('T')[0]
                    : ''),
                notes: jobForm.notes.trim()
              }
            : job
        )
      );

      resetJobForm();
      return;
    }

    const newJob: JobItem = {
      id: Date.now(),
      title: jobForm.title.trim(),
      company: jobForm.company.trim(),
      location: jobForm.location.trim() || 'Remote',
      status: jobForm.status,
      salary: jobForm.salary.trim() || 'Undisclosed',
      dateApplied:
        jobForm.dateApplied ||
        (jobForm.status !== 'Wishlist' ? new Date().toISOString().split('T')[0] : ''),
      notes: jobForm.notes.trim()
    };

    setJobs((prev) => [...prev, newJob]);
    resetJobForm();
  };

  const moveJob = (jobId: number, direction: 'left' | 'right') => {
    setJobs((prevJobs) =>
      prevJobs.map((job) => {
        if (job.id !== jobId) return job;

        const currentIdx = columns.indexOf(job.status);
        let nextIdx = currentIdx;

        if (direction === 'left' && currentIdx > 0) nextIdx = currentIdx - 1;
        if (direction === 'right' && currentIdx < columns.length - 1) nextIdx = currentIdx + 1;

        const nextStatus = columns[nextIdx];

        return {
          ...job,
          status: nextStatus,
          dateApplied:
            job.status === 'Wishlist' && nextStatus === 'Applied'
              ? new Date().toISOString().split('T')[0]
              : job.dateApplied
        };
      })
    );
  };

  const deleteJob = (jobId: number) => {
    if (window.confirm('Remove this job application from your tracker?')) {
      setJobs((prev) => prev.filter((job) => job.id !== jobId));
    }
  };

  const getCompanyStrategy = (job: JobItem) => {
    const co = job.company.toLowerCase();

    if (co.includes('stripe')) {
      return {
        focus: 'Robust API Design, Webhooks & System Scaling',
        checklist: [
          'Study idempotent APIs and payment transactional retries.',
          'Prepare for API design rounds with auth headers, payload validation, and mock HTTP responses.',
          'Review concurrent workers and event queue algorithms.',
          'Be ready to discuss SQL databases and partition/scaling strategies.'
        ],
        insiderTips:
          'Stripe values elegant code, strong testing, and careful handling of failure paths like webhook retries.'
      };
    }

    if (co.includes('labs') || co.includes('vector')) {
      return {
        focus: 'Vector Databases, Embedding Models & ML Pipelines',
        checklist: [
          'Review cosine similarity, dot product, and L2 distance.',
          'Understand RAG systems: LangChain, chunking sizes, and retrieval strategy.',
          'Review Redis caching for frequent embeddings.',
          'Practice MongoDB aggregation and indexing examples.'
        ],
        insiderTips:
          'Focus on vector search latency, scalable retrieval, and clean TypeScript service structure.'
      };
    }

    if (co.includes('iq') || co.includes('career')) {
      return {
        focus: 'NLP Architectures, Recommendation Engines & SaaS Scale',
        checklist: [
          'Review tokenization and basic transformer attention concepts.',
          'Practice SaaS notification feeds and background jobs in Node/Express.',
          'Understand query indexes, sharding boundaries, and connection pooling.',
          'Review event-driven architecture and PubSub messaging.'
        ],
        insiderTips:
          'Emphasize parsing, classifying, and filtering large sets of unstructured resume/job data.'
      };
    }

    return {
      focus: 'MERN Full-Stack Engineering, Big-O Efficiencies & System Operations',
      checklist: [
        'Master Express error middleware and JWT authorization.',
        'Review MongoDB indexing, aggregation, and embedding vs referencing.',
        'Study HashMaps, Arrays, Trees, and binary traversals.',
        'Prepare testing examples using Jest/Supertest.'
      ],
      insiderTips:
        'Hiring teams like modular code: routes, controllers, schemas, services, and optimized layouts.'
    };
  };

  return (
    <section style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <div
        className="page-intro"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div>
          <span className="status-badge primary" style={{ marginBottom: '12px' }}>
            Job Application Pipeline
          </span>
          <h1>Job Application Kanban</h1>
          <p>
            Organize your career search pipeline visually. Add, edit, move, and save job
            applications locally until the backend is ready.
          </p>
        </div>

        <button type="button" className="btn-primary" onClick={openAddForm}>
          Add Job Application
        </button>
      </div>

      <div className="dashboard-card col-12" style={{ marginTop: '18px' }}>
        <div className="card-title">Pipeline Summary</div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, minmax(120px, 1fr))',
            gap: '12px'
          }}
        >
          {pipelineStats.map((item) => (
            <div
              key={item.status}
              style={{
                background: 'var(--surface-alt)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '14px'
              }}
            >
              <strong style={{ display: 'block', fontSize: '1.35rem', color: 'var(--primary)' }}>
                {item.count}
              </strong>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="kanban-board" style={{ marginTop: '24px' }}>
        {columns.map((col) => {
          const colJobs = jobs.filter((job) => job.status === col);

          return (
            <div key={col} className="kanban-column">
              <div className="column-header">
                <span className="column-title">
                  {col === 'Wishlist'
                    ? '📌'
                    : col === 'Applied'
                      ? '📥'
                      : col === 'Interviewing'
                        ? '🗣️'
                        : col === 'Offer'
                          ? '🎉'
                          : '❌'}{' '}
                  {col}
                </span>
                <span className="column-count">{colJobs.length}</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  flex: 1,
                  minHeight: '400px'
                }}
              >
                {colJobs.length === 0 ? (
                  <div
                    style={{
                      textAlign: 'center',
                      color: 'var(--text-muted)',
                      fontSize: '0.8rem',
                      padding: '30px 10px',
                      border: '1px dashed var(--border)',
                      borderRadius: '10px'
                    }}
                  >
                    Column Empty
                  </div>
                ) : (
                  colJobs.map((job) => (
                    <article key={job.id} className="kanban-card">
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: '10px'
                        }}
                      >
                        <div>
                          <h4 style={{ color: 'var(--text)', fontSize: '0.92rem' }}>
                            {job.title}
                          </h4>
                          <p
                            style={{
                              fontWeight: 600,
                              color: 'var(--primary)',
                              margin: '2px 0 6px',
                              fontSize: '0.82rem'
                            }}
                          >
                            {job.company}
                          </p>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button
                            type="button"
                            onClick={() => openEditForm(job)}
                            style={{
                              fontSize: '0.78rem',
                              color: 'var(--primary)',
                              fontWeight: 700
                            }}
                            title="Edit application"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteJob(job.id)}
                            style={{
                              fontSize: '0.78rem',
                              color: 'var(--danger)',
                              fontWeight: 700
                            }}
                            title="Remove application"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: '10px',
                          fontSize: '0.75rem',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        <span>📍 {job.location}</span>
                        <span>💵 {job.salary}</span>
                      </div>

                      {job.dateApplied && (
                        <div
                          style={{
                            fontSize: '0.72rem',
                            color: 'var(--text-muted)',
                            marginTop: '8px'
                          }}
                        >
                          📅 Applied: {job.dateApplied}
                        </div>
                      )}

                      {job.notes && (
                        <p style={{ fontSize: '0.78rem', marginTop: '8px', lineHeight: 1.45 }}>
                          {job.notes}
                        </p>
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedStrategyJob(job)}
                        style={{
                          width: '100%',
                          marginTop: '12px',
                          padding: '6px',
                          background:
                            'linear-gradient(135deg, rgba(56, 189, 248, 0.05), rgba(236, 72, 153, 0.05))',
                          border: '1px solid var(--border)',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          color: 'var(--primary)',
                          textAlign: 'center'
                        }}
                      >
                        AI Strategy Guide
                      </button>

                      <div className="kanban-card-footer" style={{ padding: '8px 0 0', marginTop: '8px' }}>
                        <button
                          type="button"
                          className="btn-secondary"
                          style={{ padding: '2px 8px', fontSize: '0.75rem', borderRadius: '4px' }}
                          disabled={col === 'Wishlist'}
                          onClick={() => moveJob(job.id, 'left')}
                        >
                          ◀
                        </button>

                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          Move Status
                        </span>

                        <button
                          type="button"
                          className="btn-secondary"
                          style={{ padding: '2px 8px', fontSize: '0.75rem', borderRadius: '4px' }}
                          disabled={col === 'Rejected'}
                          onClick={() => moveJob(job.id, 'right')}
                        >
                          ▶
                        </button>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedStrategyJob && (
        <div className="modal-overlay" onClick={() => setSelectedStrategyJob(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ borderTop: '4px solid var(--primary)' }}
          >
            <button type="button" className="modal-close" onClick={() => setSelectedStrategyJob(null)}>
              ❌
            </button>

            <span className="status-badge success" style={{ marginBottom: '12px' }}>
              AI Interview Blueprint
            </span>
            <h2>{selectedStrategyJob.company} Interview Playbook</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Specialized roadmap prep targeting your application for the{' '}
              <strong>{selectedStrategyJob.title}</strong> role.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h4
                  style={{
                    color: 'var(--primary)',
                    fontSize: '0.95rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '8px'
                  }}
                >
                  Technical Core Focus
                </h4>
                <div
                  style={{
                    background: 'var(--surface-alt)',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.92rem'
                  }}
                >
                  {getCompanyStrategy(selectedStrategyJob).focus}
                </div>
              </div>

              <div>
                <h4
                  style={{
                    color: 'var(--secondary)',
                    fontSize: '0.95rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '8px'
                  }}
                >
                  Specialized Checklist
                </h4>
                <ul
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    paddingLeft: '16px',
                    listStyleType: 'disc'
                  }}
                >
                  {getCompanyStrategy(selectedStrategyJob).checklist.map((item) => (
                    <li
                      key={item}
                      style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div
                style={{
                  background: 'rgba(56, 189, 248, 0.03)',
                  border: '1px dashed var(--border-hover)',
                  padding: '16px',
                  borderRadius: '10px'
                }}
              >
                <h4
                  style={{
                    color: 'var(--accent-light)',
                    fontSize: '0.9rem',
                    marginBottom: '6px'
                  }}
                >
                  Insider Talent Tips
                </h4>
                <p style={{ fontSize: '0.85rem', lineHeight: '1.5', margin: 0, fontStyle: 'italic' }}>
                  "{getCompanyStrategy(selectedStrategyJob).insiderTips}"
                </p>
              </div>
            </div>

            <button
              type="button"
              className="btn-primary"
              onClick={() => setSelectedStrategyJob(null)}
              style={{ width: '100%', marginTop: '24px', justifyContent: 'center' }}
            >
              Acknowledged, Start Practicing
            </button>
          </div>
        </div>
      )}

      {showJobForm && (
        <div className="modal-overlay" onClick={resetJobForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close" onClick={resetJobForm}>
              ❌
            </button>

            <h2>{editingJob ? 'Edit Opportunity' : 'Track New Opportunity'}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
              {editingJob
                ? 'Update company details, stage, date, and preparation notes.'
                : 'Add a new company job record to your active tracker pipeline.'}
            </p>

            <form onSubmit={handleJobFormSubmit}>
              <div className="form-group">
                <label>Job Title*</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Backend Software Intern"
                  value={jobForm.title}
                  onChange={(e) => updateJobForm('title', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Company*</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Stripe or Google"
                  value={jobForm.company}
                  onChange={(e) => updateJobForm('company', e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Remote or NYC"
                    value={jobForm.location}
                    onChange={(e) => updateJobForm('location', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Salary Package</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. $120k/yr or $45/hr"
                    value={jobForm.salary}
                    onChange={(e) => updateJobForm('salary', e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div className="form-group">
                  <label>Application Stage</label>
                  <select
                    className="form-select"
                    value={jobForm.status}
                    onChange={(e) => updateJobForm('status', e.target.value as JobItem['status'])}
                  >
                    <option value="Wishlist">Wishlist / Bookmarked</option>
                    <option value="Applied">Applied</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offer">Offer Received</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Date Applied</label>
                  <input
                    type="date"
                    className="form-input"
                    value={jobForm.dateApplied}
                    onChange={(e) => updateJobForm('dateApplied', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Developer Research Notes</label>
                <textarea
                  className="textarea-box"
                  style={{ minHeight: '80px' }}
                  placeholder="Insert referral contact names, follow-up dates, or specialized skill stacks."
                  value={jobForm.notes}
                  onChange={(e) => updateJobForm('notes', e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={resetJobForm}
                >
                  Cancel
                </button>

                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  {editingJob ? 'Save Changes' : 'Add to Columns'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}