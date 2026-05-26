import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

export default function CodingSandbox() {
  const { codingProblems, solvedProblems, submitCodingSolution } = useAppContext();
  
  // Active problem selection
  const [activeProblemId, setActiveProblemId] = useState('code-1');
  const [userCode, setUserCode] = useState('');
  
  // Execution output states
  const [consoleOutput, setConsoleOutput] = useState('');
  const [aiAudit, setAiAudit] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);

  const problem = codingProblems.find((p) => p.id === activeProblemId) || codingProblems[0];

  // Load problem template when active problem changes
  useEffect(() => {
    if (problem) {
      setUserCode(problem.codeTemplate);
      setConsoleOutput('');
      setAiAudit('');
    }
  }, [activeProblemId, problem]);

  const handleRunCode = () => {
    if (!userCode.trim()) return;
    
    setIsCompiling(true);
    setConsoleOutput('Compiling compiler stack...\nInitializing VM scope...\n');
    
    setTimeout(() => {
      const result = submitCodingSolution(problem.id, userCode);
      setConsoleOutput(result.output);
      setIsCompiling(false);
    }, 800);
  };

  const handleSubmitCode = () => {
    if (!userCode.trim()) return;
    
    setIsCompiling(true);
    setIsAuditing(true);
    setConsoleOutput('Running full testing suite...\nAuditing lexical memory structures...\n');
    
    setTimeout(() => {
      const result = submitCodingSolution(problem.id, userCode);
      setConsoleOutput(result.output);
      setIsCompiling(false);
      
      // Load AI analysis audit feedback
      setTimeout(() => {
        setAiAudit(result.audit);
        setIsAuditing(false);
      }, 500);
    }, 1000);
  };

  // Generate line numbers matching userCode content
  const lineCount = userCode.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 12) }, (_, i) => i + 1);

  return (
    <section style={{ animation: 'fadeIn 0.4s ease-out' }}>
      {/* Intro Header */}
      <div className="page-intro" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <span className="status-badge primary" style={{ marginBottom: '12px' }}>Interactive Sandbox</span>
          <h1>Algorithm Playgrounds</h1>
          <p>
            Prove your coding mastery right in the browser. Solve system challenges, pass unit test assertions, and audit complexity metrics.
          </p>
        </div>

        {/* Problem selector dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Select Algorithm:</span>
          <select 
            className="form-select" 
            style={{ width: '220px', padding: '6px 12px' }}
            value={activeProblemId}
            onChange={(e) => setActiveProblemId(e.target.value)}
          >
            {codingProblems.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.difficulty}) {solvedProblems.includes(p.id) ? '✅' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Split Pane Sandbox Workspace */}
      <div className="sandbox-split-view" style={{ marginTop: '24px' }}>
        
        {/* Left Pane: Instructions */}
        <div className="sandbox-pane">
          <div className="pane-header">
            <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>📝 Challenge Requirements</span>
            <span className={`status-badge ${
              problem.difficulty === 'Easy' ? 'success' : 
              problem.difficulty === 'Medium' ? 'warning' : 'danger'
            }`}>
              {problem.difficulty}
            </span>
          </div>

          <div className="pane-content">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '12px' }}>
              {problem.title}
            </h3>
            
            <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text)', whiteSpace: 'pre-wrap', marginBottom: '24px' }}>
              {problem.description}
            </p>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                🧪 Static Assertions Suite
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {problem.testCases.map((tc, idx) => (
                  <div 
                    key={idx} 
                    style={{ 
                      fontFamily: 'var(--font-mono)', 
                      fontSize: '0.78rem', 
                      background: 'var(--surface-alt)', 
                      padding: '8px 12px', 
                      borderRadius: '6px',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span style={{ color: 'var(--text-secondary)' }}>Input: {tc.input}</span>
                    <span style={{ color: 'var(--accent-light)' }}>Expected: {tc.expected}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI complexity audits */}
            {aiAudit && (
              <div 
                style={{ 
                  marginTop: '24px', 
                  background: 'rgba(56, 189, 248, 0.03)', 
                  border: '1px dashed var(--border-hover)', 
                  padding: '16px', 
                  borderRadius: '10px',
                  animation: 'fadeIn 0.3s ease-out'
                }}
              >
                <h4 style={{ color: 'var(--primary)', fontSize: '0.9rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  🧠 AI Static Complexity Audit
                </h4>
                <p style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', lineHeight: '1.6', margin: 0, whiteSpace: 'pre-wrap' }}>
                  {aiAudit}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Code Editor */}
        <div className="sandbox-pane">
          <div className="pane-header">
            <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>💻 Javascript Editor Sandbox</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>index.js</span>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Custom Code Editor Box */}
            <div className="code-editor-area" style={{ flex: 1, overflow: 'hidden' }}>
              <div className="editor-line-numbers">
                {lineNumbers.map((num) => (
                  <div key={num}>{num}</div>
                ))}
              </div>
              <textarea
                className="code-textarea"
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                spellCheck={false}
                disabled={isCompiling}
              />
            </div>

            {/* Editor Bottom Actions Bar */}
            <div style={{ padding: '12px 20px', background: 'var(--surface-alt)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={handleRunCode}
                disabled={isCompiling || !userCode.trim()}
              >
                {isCompiling ? 'Running...' : 'Run Test Cases 🧪'}
              </button>

              <button 
                type="button" 
                className="btn-primary" 
                onClick={handleSubmitCode}
                disabled={isCompiling || !userCode.trim()}
              >
                {isCompiling ? 'Executing VM...' : 'Submit & AI Audit 🚀'}
              </button>
            </div>

            {/* Test console logs output */}
            {consoleOutput && (
              <div style={{ padding: '16px', background: '#04070e', borderTop: '1px solid var(--border)', maxHeight: '160px', overflowY: 'auto' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                  Console Outputs
                </span>
                <pre style={{ margin: '8px 0 0', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: consoleOutput.includes('❌') || consoleOutput.includes('Error') ? 'var(--danger)' : '#a3be8c', whiteSpace: 'pre-wrap' }}>
                  {consoleOutput}
                </pre>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
