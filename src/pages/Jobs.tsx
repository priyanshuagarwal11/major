import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import type { JobItem } from '../types';

export default function Jobs() {
  const { jobs, setJobs } = useAppContext();
  
  // States for adding jobs
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newSalary, setNewSalary] = useState('');
  const [newStatus, setNewStatus] = useState<JobItem['status']>('Wishlist');
  const [newNotes, setNewNotes] = useState('');

  // States for AI strategy modal
  const [selectedStrategyJob, setSelectedStrategyJob] = useState<JobItem | null>(null);

  // Kanban Columns
  const columns: JobItem['status'][] = ['Wishlist', 'Applied', 'Interviewing', 'Offer', 'Rejected'];

  const handleAddJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCompany.trim()) return;

    const newJob: JobItem = {
      id: Date.now(),
      title: newTitle,
      company: newCompany,
      location: newLocation || 'Remote',
      status: newStatus,
      salary: newSalary || 'Undisclosed',
      dateApplied: newStatus !== 'Wishlist' ? new Date().toISOString().split('T')[0] : '',
      notes: newNotes
    };

    setJobs((prev) => [...prev, newJob]);
    
    // Reset form
    setNewTitle('');
    setNewCompany('');
    setNewLocation('');
    setNewSalary('');
    setNewStatus('Wishlist');
    setNewNotes('');
    setShowAddForm(false);
  };

  const moveJob = (jobId: number, direction: 'left' | 'right') => {
    setJobs((prevJobs) =>
      prevJobs.map((job) => {
        if (job.id !== jobId) return job;
        
        const currentIdx = columns.indexOf(job.status);
        let nextIdx = currentIdx;
        
        if (direction === 'left' && currentIdx > 0) nextIdx = currentIdx - 1;
        if (direction === 'right' && currentIdx < columns.length - 1) nextIdx = currentIdx + 1;
        
        return { 
          ...job, 
          status: columns[nextIdx],
          dateApplied: job.status === 'Wishlist' && columns[nextIdx] === 'Applied' ? new Date().toISOString().split('T')[0] : job.dateApplied
        };
      })
    );
  };

  const deleteJob = (jobId: number) => {
    if (window.confirm('Are you sure you want to remove this job application?')) {
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
    }
  };

  const getCompanyStrategy = (job: JobItem) => {
    const co = job.company.toLowerCase();
    
    if (co.includes('stripe')) {
      return {
        focus: 'Robust API Design, Webhooks & System Scaling',
        checklist: [
          'Study idempotent APIs and payment transactional retries.',
          'Prepare for active API design coding rounds: mock HTTP responses, header auth validations, and payload structures.',
          'Review concurrent worker structures and event queue queueing algorithms.',
          'Be ready to discuss standard databases (MySQL/Postgres) and partition/scaling strategies.'
        ],
        insiderTips: 'Stripe values elegant code structures, thorough testing, and handling complex failure routes (e.g. what happens if a webhook delivery fails twice?).'
      };
    }
    
    if (co.includes('labs') || co.includes('vector')) {
      return {
        focus: 'Vector Databases, Embedding Models & ML Pipelines',
        checklist: [
          'Review similarity search metric operations (Cosine Similarity, Dot Product, L2 Distance).',
          'Understand Retrieval-Augmented Generation (RAG) frameworks: LangChain, chunking sizes, and vector retrieval strategies.',
          'Master Node caching structures (e.g., Redis layer for caching frequent query embeddings).',
          'Be ready to demonstrate fast aggregate analysis using MongoDB or Postgres storage engines.'
        ],
        insiderTips: 'Focus heavily on scaling vector search pipelines, dealing with latency bottlenecks, and designing clean TypeScript structures for AI agents.'
      };
    }

    if (co.includes('iq') || co.includes('career')) {
      return {
        focus: 'NLP Architectures, Recommendation Engines & SaaS Scale',
        checklist: [
          'Review text tokenization processes and basic transformer attention concepts.',
          'Practice designing SaaS notification feeds and background job workers in Node/Express.',
          'Understand database scaling metrics: query indexes, shard boundaries, and connection pooling rules.',
          'Review Event-Driven architecture setups: PubSub messaging queues.'
        ],
        insiderTips: 'CareerIQ builds software for automated matching. Emphasize your ability to parse, classify, and filter large sets of unstructured PDF data efficiently.'
      };
    }

    // Default general advice
    return {
      focus: 'MERN Full-Stack Engineering, Big-O Efficiencies & System Operations',
      checklist: [
        'Master Express error handling middlewares and JSON Web Token (JWT) authorizations.',
        'Review MongoDB indexing strategies, aggregate frameworks, and relationship scaling theories (embedding vs referencing).',
        'Study fundamental coding data structures: HashMaps, Arrays, and binary traversals.',
        'Describe testing procedures using Jest/Supertest.'
      ],
      insiderTips: 'The hiring team values modular separation of concerns: routing controllers, schemas, services, and highly optimized layouts.'
    };
  };

  return (
    <section style={{ animation: 'fadeIn 0.4s ease-out' }}>
      {/* Page Header */}
      <div className="page-intro" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <span className="status-badge primary" style={{ marginBottom: '12px' }}>Job Application Pipeline</span>
          <h1>Job Application Kanban</h1>
          <p>
            Organize your career search pipeline visually. Drag applications from Wishlist through Offers, and unlock AI strategy prep cards.
          </p>
        </div>
        
        <button 
          type="button" 
          className="btn-primary" 
          onClick={() => setShowAddForm(true)}
        >
          ➕ Add Job Application
        </button>
      </div>

      {/* Kanban Board Container */}
      <div className="kanban-board" style={{ marginTop: '24px' }}>
        {columns.map((col) => {
          const colJobs = jobs.filter((j) => j.status === col);
          return (
            <div key={col} className="kanban-column">
              <div className="column-header">
                <span className="column-title">
                  {col === 'Wishlist' ? '📌' : 
                   col === 'Applied' ? '📥' : 
                   col === 'Interviewing' ? '🗣️' : 
                   col === 'Offer' ? '🎉' : '❌'} {col}
                </span>
                <span className="column-count">{colJobs.length}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, minHeight: '400px' }}>
                {colJobs.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', padding: '30px 10px', border: '1px dashed var(--border)', borderRadius: '10px' }}>
                    Column Empty
                  </div>
                ) : (
                  colJobs.map((job) => (
                    <article key={job.id} className="kanban-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4 style={{ color: 'var(--text)', fontSize: '0.92rem' }}>{job.title}</h4>
                        <button 
                          type="button" 
                          onClick={() => deleteJob(job.id)} 
                          style={{ fontSize: '0.8rem', color: 'var(--danger)', opacity: 0.6 }}
                          title="Remove application"
                        >
                          🗑️
                        </button>
                      </div>
                      <p style={{ fontWeight: 600, color: 'var(--primary)', margin: '2px 0 6px', fontSize: '0.82rem' }}>
                        {job.company}
                      </p>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        <span>📍 {job.location}</span>
                        <span>💵 {job.salary}</span>
                      </div>

                      {job.dateApplied && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                          📅 Applied: {job.dateApplied}
                        </div>
                      )}

                      {/* AI strategy prep card tag */}
                      <button
                        type="button"
                        onClick={() => setSelectedStrategyJob(job)}
                        style={{ 
                          width: '100%', 
                          marginTop: '12px', 
                          padding: '6px', 
                          background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.05), rgba(236, 72, 153, 0.05))',
                          border: '1px solid var(--border)',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          color: 'var(--primary)',
                          textAlign: 'center'
                        }}
                      >
                        ⚡ AI Strategy Guide
                      </button>

                      {/* Card movements buttons */}
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
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Move Status</span>
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

      {/* Strategy Guide Modal popup */}
      {selectedStrategyJob && (
        <div className="modal-overlay" onClick={() => setSelectedStrategyJob(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ borderTop: '4px solid var(--primary)' }}>
            <button type="button" className="modal-close" onClick={() => setSelectedStrategyJob(null)}>❌</button>
            
            <span className="status-badge success" style={{ marginBottom: '12px' }}>AI Interview Blueprint</span>
            <h2>{selectedStrategyJob.company} Interview Playbook</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Specialized roadmap prep targeting your application for the <strong>{selectedStrategyJob.title}</strong> role.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h4 style={{ color: 'var(--primary)', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                  🎯 Technical Core Focus
                </h4>
                <div style={{ background: 'var(--surface-alt)', padding: '12px 16px', borderRadius: '8px', fontWeight: 600, fontSize: '0.92rem' }}>
                  {getCompanyStrategy(selectedStrategyJob).focus}
                </div>
              </div>

              <div>
                <h4 style={{ color: 'var(--secondary)', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                  📝 Specialized Checklist
                </h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '16px', listStyleType: 'disc' }}>
                  {getCompanyStrategy(selectedStrategyJob).checklist.map((item, index) => (
                    <li key={index} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ background: 'rgba(56, 189, 248, 0.03)', border: '1px dashed var(--border-hover)', padding: '16px', borderRadius: '10px' }}>
                <h4 style={{ color: 'var(--accent-light)', fontSize: '0.9rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  💡 Insider Talent Tips
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
              Acknowledged, Start Practicing! 🚀
            </button>
          </div>
        </div>
      )}

      {/* Add Job Form Drawer Modal */}
      {showAddForm && (
        <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setShowAddForm(false)}>❌</button>
            
            <h2>Track New Opportunity</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Add a new company job record to your active tracker pipeline columns.
            </p>

            <form onSubmit={handleAddJobSubmit}>
              <div className="form-group">
                <label>Job Title*</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Backend Software Intern"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Company*</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Stripe or Google"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
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
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Salary Package</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. $120k/yr or $45/hr"
                    value={newSalary}
                    onChange={(e) => setNewSalary(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Application Stage Category</label>
                <select 
                  className="form-select"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                >
                  <option value="Wishlist">📌 Wishlist / Bookmarked</option>
                  <option value="Applied">📥 Applied</option>
                  <option value="Interviewing">🗣️ Interviewing</option>
                  <option value="Offer">🎉 Offer Received</option>
                  <option value="Rejected">❌ Rejected</option>
                </select>
              </div>

              <div className="form-group">
                <label>Developer Research Notes</label>
                <textarea 
                  className="textarea-box" 
                  style={{ minHeight: '80px' }}
                  placeholder="Insert referral contact names, follow-up dates, or specialized skill stacks."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowAddForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  Add to Columns 📥
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
