import { useState } from 'react';
import { analyzeResume } from '../api/apiResume';
import type { ResumeAnalysis } from '../api/apiResume';
import { useAppContext } from '../context/AppContext';

export default function Resume() {
  const { resumeScore, nextAction, skillGaps, optimizeBullet } = useAppContext();

  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [fileName, setFileName] = useState('');
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);

  const [rawBullet, setRawBullet] = useState('');
  const [optimizedResult, setOptimizedResult] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);

  const bulletPresets = [
    {
      label: 'Built a React website',
      value: 'I built a React website with some custom pages and a profile page.'
    },
    {
      label: 'Fixed database queries',
      value: 'I fixed slow database queries in MongoDB and cleaned up records.'
    },
    {
      label: 'Added tests',
      value: 'I added some unit tests to our server to catch bugs before push.'
    }
  ];

  const runResumeAnalysis = async (file: File) => {
    setFileName(file.name);
    setIsScanning(true);
    setScanProgress(0);
    setResumeUploaded(false);
    setAnalysis(null);

    const progressTimer = window.setInterval(() => {
      setScanProgress((prev) => Math.min(prev + 20, 95));
    }, 250);

    try {
      const result = await analyzeResume(file);
      setAnalysis(result);
      setResumeUploaded(true);
      setScanProgress(100);
    } finally {
      window.clearInterval(progressTimer);
      setIsScanning(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await runResumeAnalysis(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();

    const file = e.dataTransfer.files?.[0];

    if (file) {
      await runResumeAnalysis(file);
      return;
    }

    const mockFile = new File(['mock resume content'], 'resume_portfolio_v2.pdf', {
      type: 'application/pdf'
    });

    await runResumeAnalysis(mockFile);
  };

  const handleOptimizeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawBullet.trim()) return;

    setIsOptimizing(true);

    setTimeout(() => {
      const result = optimizeBullet(rawBullet);
      setOptimizedResult(result);
      setIsOptimizing(false);
    }, 800);
  };

  const handlePresetClick = (presetValue: string) => {
    setRawBullet(presetValue);
    setOptimizedResult('');
  };

  const roleFitScore = analysis?.atsScore ?? resumeScore;
  const formattingScore = analysis?.formattingScore ?? 90;
  const impactScore = analysis?.impactScore ?? 72;
  const completenessScore = analysis?.completenessScore ?? 80;
  const displayedMissingSkills = analysis?.missingSkills ?? skillGaps;

  return (
    <section style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <div className="page-intro">
        <span className="status-badge primary" style={{ marginBottom: '12px' }}>
          Resume Scanner
        </span>
        <h1>AI Resume Intelligence</h1>
        <p>
          Audit formatting, score keywords against target job specs, and optimize bullet points
          with a backend-ready AI analysis flow.
        </p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card col-6">
          <div className="card-title">
            <span>Upload Resume for AI Audit</span>
          </div>

          <div
            className="dropzone"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{ position: 'relative' }}
          >
            {isScanning && <div className="scanner-beam"></div>}

            <input
              type="file"
              id="resume-file-input"
              accept=".pdf,.docx,.txt"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />

            <label htmlFor="resume-file-input" style={{ cursor: 'pointer', display: 'block' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📄</div>

              {isScanning ? (
                <div>
                  <h4 style={{ color: 'var(--primary)', marginBottom: '8px' }}>
                    Scanning Resume Assets...
                  </h4>

                  <div
                    style={{
                      width: '80%',
                      height: '6px',
                      background: 'var(--surface-alt)',
                      borderRadius: '99px',
                      margin: '12px auto 0',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        width: `${scanProgress}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                        transition: 'width 0.2s ease'
                      }}
                    />
                  </div>

                  <small style={{ color: 'var(--text-secondary)' }}>
                    {scanProgress}% - Parsing keywords and scoring ATS signals
                  </small>
                </div>
              ) : resumeUploaded ? (
                <div>
                  <h4 style={{ color: 'var(--accent-light)' }}>File Successfully Parsed</h4>
                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                      margin: '8px 0'
                    }}
                  >
                    "{fileName}"
                  </p>
                  <small style={{ textDecoration: 'underline', color: 'var(--primary)' }}>
                    Click to upload a different draft
                  </small>
                </div>
              ) : (
                <div>
                  <h4>Drag and drop your resume file here</h4>
                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                      margin: '8px 0 16px'
                    }}
                  >
                    Supports PDF, DOCX, or plain TXT up to 10MB
                  </p>
                  <span className="btn-secondary" style={{ display: 'inline-flex' }}>
                    Browse Files
                  </span>
                </div>
              )}
            </label>
          </div>

          <div style={{ marginTop: '24px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px' }}>
              AI Compliance Report Card
            </h4>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px'
              }}
            >
              <div
                style={{
                  background: 'var(--surface-alt)',
                  padding: '14px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <span style={{ fontSize: '1.25rem', color: 'var(--accent)' }}>✅</span>
                <div>
                  <h5 style={{ fontSize: '0.88rem', fontWeight: 700 }}>Format Check</h5>
                  <small style={{ color: 'var(--text-secondary)' }}>
                    {formattingScore}% structure score
                  </small>
                </div>
              </div>

              <div
                style={{
                  background: 'var(--surface-alt)',
                  padding: '14px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <span style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>📝</span>
                <div>
                  <h5 style={{ fontSize: '0.88rem', fontWeight: 700 }}>ATS Keywords</h5>
                  <small style={{ color: 'var(--text-secondary)' }}>
                    {roleFitScore}% matching score
                  </small>
                </div>
              </div>

              <div
                style={{
                  background: 'var(--surface-alt)',
                  padding: '14px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <span style={{ fontSize: '1.25rem', color: 'var(--warning)' }}>⚠️</span>
                <div>
                  <h5 style={{ fontSize: '0.88rem', fontWeight: 700 }}>Impact Metrics</h5>
                  <small style={{ color: 'var(--text-secondary)' }}>
                    {impactScore}% quantified
                  </small>
                </div>
              </div>

              <div
                style={{
                  background: 'var(--surface-alt)',
                  padding: '14px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <span style={{ fontSize: '1.25rem', color: 'var(--secondary)' }}>🔗</span>
                <div>
                  <h5 style={{ fontSize: '0.88rem', fontWeight: 700 }}>Completeness</h5>
                  <small style={{ color: 'var(--text-secondary)' }}>
                    {completenessScore}% profile complete
                  </small>
                </div>
              </div>
            </div>

            {analysis && (
              <div style={{ marginTop: '18px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '10px' }}>
                  Extracted Skills
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {analysis.extractedSkills.map((skill) => (
                    <span key={skill} className="status-badge success">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-card col-6">
          <div className="card-title">
            <span>Interactive Audit Critiques</span>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              margin: '12px 0 24px',
              textAlign: 'center',
              gap: '12px',
              flexWrap: 'wrap'
            }}
          >
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                {roleFitScore}%
              </div>
              <small style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                Role Fit
              </small>
            </div>

            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent)' }}>
                {formattingScore}%
              </div>
              <small style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                Formatting
              </small>
            </div>

            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--secondary)' }}>
                {impactScore}%
              </div>
              <small style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                Metrics/Impact
              </small>
            </div>

            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--warning)' }}>
                {completenessScore}%
              </div>
              <small style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                Completeness
              </small>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.05)',
                border: '1px solid rgba(16, 185, 129, 0.15)',
                padding: '14px',
                borderRadius: '10px'
              }}
            >
              <span className="status-badge success" style={{ marginBottom: '6px' }}>
                Strength
              </span>
              <p style={{ fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
                {analysis?.strengths[0] ??
                  'Strong developer identity. Your MERN stack, React Hooks, and Git workflow skills are explicitly listed under the technical section.'}
              </p>
            </div>

            <div
              style={{
                background: 'rgba(245, 158, 11, 0.05)',
                border: '1px solid rgba(245, 158, 11, 0.15)',
                padding: '14px',
                borderRadius: '10px'
              }}
            >
              <span className="status-badge warning" style={{ marginBottom: '6px' }}>
                Improvement
              </span>
              <p style={{ fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
                {analysis?.improvements[0] ?? nextAction}
              </p>
            </div>

            <div
              style={{
                background: 'rgba(239, 68, 68, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.15)',
                padding: '14px',
                borderRadius: '10px'
              }}
            >
              <span className="status-badge danger" style={{ marginBottom: '6px' }}>
                Missing Skill Gaps
              </span>
              <p style={{ fontSize: '0.85rem', lineHeight: '1.5', margin: '0 0 8px' }}>
                Your resume lacks references to the following high-value skills.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {displayedMissingSkills.map((gap) => (
                  <span
                    key={gap}
                    style={{
                      fontSize: '0.72rem',
                      background: 'rgba(239, 68, 68, 0.12)',
                      color: 'var(--danger)',
                      padding: '2px 8px',
                      borderRadius: '99px'
                    }}
                  >
                    {gap}
                  </span>
                ))}
              </div>
            </div>

            {analysis && (
              <div
                style={{
                  background: 'rgba(56, 189, 248, 0.05)',
                  border: '1px solid rgba(56, 189, 248, 0.16)',
                  padding: '14px',
                  borderRadius: '10px'
                }}
              >
                <span className="status-badge primary" style={{ marginBottom: '8px' }}>
                  Next Fixes
                </span>

                <ul
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    paddingLeft: '18px',
                    color: 'var(--text-secondary)',
                    fontSize: '0.85rem'
                  }}
                >
                  {analysis.improvements.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="dashboard-card col-12" style={{ marginTop: '24px' }}>
        <div className="card-title">
          <span>AI Resume Bullet Point Optimizer</span>
        </div>

        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Paste a generic, passive bullet point below. The optimizer will rebuild it using Google's{' '}
          <strong>X-Y-Z formula</strong>:
          <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
            {' '}
            "Accomplished [X] as measured by [Y], by doing [Z]"
          </span>
          .
        </p>

        <div className="bullet-optimizer-container">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Try Presets:</span>

            {bulletPresets.map((preset) => (
              <button
                type="button"
                key={preset.label}
                className="btn-secondary"
                onClick={() => handlePresetClick(preset.value)}
                style={{ padding: '6px 14px', fontSize: '0.82rem' }}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <form
            onSubmit={handleOptimizeSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            <textarea
              className="textarea-box"
              placeholder="Example: I worked on the MongoDB database and made query loading fast."
              value={rawBullet}
              onChange={(e) => setRawBullet(e.target.value)}
            />

            <button
              type="submit"
              className="btn-primary"
              style={{ alignSelf: 'flex-start' }}
              disabled={isOptimizing || !rawBullet.trim()}
            >
              {isOptimizing ? 'Refactoring Sentence...' : 'Optimize Bullet Point'}
            </button>
          </form>

          {optimizedResult && (
            <div className="optimized-output" style={{ marginTop: '16px' }}>
              <h4
                style={{
                  fontSize: '0.9rem',
                  color: 'var(--accent-light)',
                  marginBottom: '6px'
                }}
              >
                AI Recommended Revision:
              </h4>

              <p
                style={{
                  fontSize: '0.98rem',
                  lineHeight: '1.6',
                  fontWeight: 500,
                  margin: 0,
                  color: 'var(--text)'
                }}
              >
                "{optimizedResult}"
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: '20px',
                  marginTop: '12px',
                  borderTop: '1px solid rgba(16, 185, 129, 0.15)',
                  paddingTop: '12px',
                  fontSize: '0.78rem',
                  color: 'var(--text-secondary)',
                  flexWrap: 'wrap'
                }}
              >
                <div>
                  <strong style={{ color: 'var(--secondary)' }}>[X] Accomplished:</strong>{' '}
                  Built or improved a real feature
                </div>
                <div>
                  <strong style={{ color: 'var(--primary)' }}>[Y] Measured:</strong> Added
                  visible impact numbers
                </div>
                <div>
                  <strong style={{ color: 'var(--accent-light)' }}>[Z] Actions:</strong> Explained
                  tools and implementation
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}