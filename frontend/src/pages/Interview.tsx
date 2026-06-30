import { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

export default function Interview() {
  const { 
    interviewSession, 
    startNewInterview, 
    submitInterviewAnswer, 
    resetInterview,
    interviewConfidence
  } = useAppContext();

  // Wizard selections
  const [selectedRole, setSelectedRole] = useState('frontend');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Junior');
  const [selectedMode, setSelectedMode] = useState<'technical' | 'behavioral' | 'systems'>('technical');

  // Input states
  const [answerInput, setAnswerInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [speechTimer, setSpeechTimer] = useState<ReturnType<typeof setInterval> | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat feed
  useEffect(() => {
    if (interviewSession?.chatHistory?.length) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [interviewSession?.chatHistory]);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    startNewInterview(selectedRole, selectedDifficulty, selectedMode);
  };

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerInput.trim() || isSending) return;

    setIsSending(true);
    const tempText = answerInput;
    setAnswerInput('');
    
    // Stop mic if active
    if (isMicActive) {
      toggleMic();
    }

    await submitInterviewAnswer(tempText);
    setIsSending(false);
  };

  const toggleMic = () => {
    if (isMicActive) {
      // Deactivating mic - simulate generating transcribed voice text
      setIsMicActive(false);
      if (speechTimer) clearInterval(speechTimer);
      
      const mockTranscripts = [
        "In my experience, I always use useMemo for heavy calculations and use Virtualization tags to only render visible DOM nodes. We also lazy load route structures.",
        "To build a rate limiter, I would write a Redis Lua script storing tokens inside a bucket metadata index. This protects against service overload.",
        "We designed a multi-producer Kafka queue that buffers alerts. Workers consume blocks asynchronously, pushing updates over WebSocket connections."
      ];
      const randomT = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
      setAnswerInput(prev => (prev ? `${prev} ${randomT}` : randomT));
    } else {
      // Activating mic - simulate voice detection
      setIsMicActive(true);
      const timer = setInterval(() => {
        // Just keep the wave pulsing
      }, 100);
      setSpeechTimer(timer);
    }
  };

  return (
    <section style={{ animation: 'fadeIn 0.4s ease-out' }}>
      {/* Page Header */}
      <div className="page-intro">
        <span className="status-badge primary" style={{ marginBottom: '12px' }}>AI Simulation Portal</span>
        <h1>Mock Interview Lab</h1>
        <p>
          Rehearse high-pressure technical, systems, and behavioral questions. Interact with smart recruiter profiles and get instant scoring analysis.
        </p>
      </div>

      {!interviewSession ? (
        /* Wizard Setup Form */
        <div className="dashboard-card col-12" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div className="card-title">
            <span>⚙️ Configure Your Custom Interview Session</span>
          </div>
          
          <form onSubmit={handleStart} style={{ marginTop: '20px' }}>
            <div className="form-group">
              <label>Select Target Discipline</label>
              <select 
                className="form-select" 
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="frontend">Frontend Software Engineer (React / JS)</option>
                <option value="backend">Backend Systems Architect (Node / databases)</option>
                <option value="systems">Distributed Cloud Engineer (Scalability / Microservices)</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <div className="form-group">
                <label>Experience Tier</label>
                <select 
                  className="form-select"
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                >
                  <option value="Junior">Entry / Intern / Junior (Basic logic & STAR)</option>
                  <option value="Senior">Mid / Senior Lead (Big-O scaling & tradeoffs)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Round Strategy</label>
                <select 
                  className="form-select"
                  value={selectedMode}
                  onChange={(e) => setSelectedMode(e.target.value as 'technical' | 'behavioral' | 'systems')}
                >
                  <option value="technical">Technical Coding & Syntax Core</option>
                  <option value="behavioral">HR Behavioral (STAR Storytelling)</option>
                  <option value="systems">Distributed Systems & API Architectures</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px', justifyContent: 'center' }}>
              Begin Interview Simulation 🎙️
            </button>
          </form>
        </div>
      ) : (
        /* Active Interview Simulator Workspace */
        <div className="dashboard-grid">
          {/* Interview Chat Panel */}
          <div className="interview-chat-shell col-8">
            {/* Recruiter Header */}
            <div className="interview-header">
              <div className="avatar-info">
                <div className="avatar-circle">
                  {interviewSession.recruiterName.charAt(0)}
                  <div className="online-dot"></div>
                </div>
                <div>
                  <div className="avatar-name">{interviewSession.recruiterName}</div>
                  <div className="avatar-title">{interviewSession.recruiterRole}</div>
                </div>
              </div>
              <span className="status-badge warning">
                Q {Math.min(interviewSession.currentQuestionIndex + 1, interviewSession.questions.length)} of {interviewSession.questions.length}
              </span>
            </div>

            {/* Chat Messages */}
            <div className="chat-messages-container">
              {interviewSession.chatHistory.map((msg) => (
                <div key={msg.id} className={`message-bubble ${msg.sender}`}>
                  <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                  <small style={{ display: 'block', alignSelf: 'flex-end', fontSize: '0.7rem', color: msg.sender === 'user' ? '#e0f2fe' : 'var(--text-muted)', marginTop: '6px', textAlign: 'right' }}>
                    {msg.timestamp}
                  </small>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Audio waveforms if listening */}
            {isMicActive && (
              <div style={{ padding: '8px 24px', background: 'rgba(236, 72, 153, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: 600 }}>🎤 Listening to response transcript...</span>
                <div className="audio-waveform-container">
                  <div className="waveform-bar animated"></div>
                  <div className="waveform-bar animated"></div>
                  <div className="waveform-bar animated"></div>
                  <div className="waveform-bar animated"></div>
                  <div className="waveform-bar animated"></div>
                  <div className="waveform-bar animated"></div>
                </div>
              </div>
            )}

            {/* Text Input Row */}
            <form onSubmit={handleAnswerSubmit} className="chat-input-bar">
              <button 
                type="button" 
                className={`mic-btn ${isMicActive ? 'active' : ''}`}
                onClick={toggleMic}
                title={isMicActive ? 'Click to transcribe speaking' : 'Click to practice with voice microphone simulation'}
              >
                {isMicActive ? '⏹️' : '🎤'}
              </button>
              
              <input 
                type="text" 
                className="chat-input-text" 
                placeholder={isMicActive ? "Speak clearly... or type standard input here" : "Type your answer and explain your tradeoffs..."}
                value={answerInput}
                onChange={(e) => setAnswerInput(e.target.value)}
                disabled={isSending}
              />
              
              <button 
                type="submit" 
                className="btn-primary" 
                style={{ padding: '8px 16px', borderRadius: '20px' }}
                disabled={isSending || !answerInput.trim()}
              >
                {isSending ? 'Evaluating...' : 'Send 📤'}
              </button>
            </form>
          </div>

          {/* AI Live Reports Sheet */}
          <div className="col-4" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div className="dashboard-card" style={{ flex: 1 }}>
              <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>📋 Live Evaluation Sheets</span>
                <span className="status-badge success">{interviewConfidence}</span>
              </div>
              
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Receive immediate grading matrices for completed question sections.
              </p>

              {Object.keys(interviewSession.evaluations).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📊</div>
                  <h4>No evaluations yet</h4>
                  <small>Answer the recruiter&apos;s prompt to generate your first score audit report.</small>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
                  {Object.entries(interviewSession.evaluations).map(([indexStr, evalData]) => {
                    const qIdx = parseInt(indexStr);
                    return (
                      <div 
                        key={qIdx}
                        style={{ 
                          background: 'var(--surface-alt)', 
                          border: '1px solid var(--border)', 
                          padding: '14px', 
                          borderRadius: '12px' 
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Question {qIdx + 1}</span>
                          <span className={`status-badge ${evalData.score >= 8 ? 'success' : 'warning'}`}>
                            Score: {evalData.score}/10
                          </span>
                        </div>
                        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '8px' }}>
                          {"\""}{interviewSession.questions[qIdx]}{"\""}
                        </p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '8px' }}>
                          <div>
                            <strong style={{ color: 'var(--accent-light)' }}>👍 Strengths:</strong> {evalData.strengths}
                          </div>
                          <div style={{ margin: '4px 0' }}>
                            <strong style={{ color: 'var(--warning)' }}>⚠️ Gaps:</strong> {evalData.gaps}
                          </div>
                          <div style={{ background: 'rgba(56, 189, 248, 0.04)', padding: '8px', borderRadius: '6px', border: '1px solid rgba(56, 189, 248, 0.1)' }}>
                            <strong style={{ color: 'var(--primary)' }}>💡 Pro Version:</strong> {evalData.proAnswer}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <button type="button" className="btn-secondary" onClick={resetInterview} style={{ justifyContent: 'center' }}>
              ↩️ Leave Simulation Room
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
