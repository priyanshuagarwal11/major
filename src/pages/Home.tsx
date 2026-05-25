import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useAuthContext } from '../context/AuthContext';

interface Message {
  sender: 'user' | 'assistant';
  text: string;
}

interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  rating: number;
}

export default function Home() {
  const { resumeScore, interviewConfidence, jobs, roadmap } = useAppContext();
  const { login, signup, isAuthenticated, isAuthLoading, authError } = useAuthContext();
  const navigate = useNavigate();

  // Pricing Toggle State
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');

  // Resume Scanner Simulator State
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scannerLogs, setScannerLogs] = useState<string[]>([
    'Ready to analyze. Drag & drop or upload resume...'
  ]);
  const [selectedResumeFile, setSelectedResumeFile] = useState<string | null>(null);

  // Radar Competency Chart State (Target Role selector)
  const [targetRole, setTargetRole] = useState<'backend' | 'frontend' | 'ai'>('backend');

  // Live Chat Widget State
  const [chatMessages, setChatMessages] = useState<Message[]>([
    { sender: 'assistant', text: "Hello! I am your AI Career Mentor. Click any prompt below to test my skills, or type your own question about placements, interviews, or engineering topics!" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Testimonials Carousel State
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Auth Modals State
  const [authModal, setAuthModal] = useState<'login' | 'signup' | null>(null);
  const [authTab, setAuthTab] = useState<'google' | 'github' | 'email'>('google');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [localAuthError, setLocalAuthError] = useState<string | null>(null);

  // Advanced Systems Flow State
  const [selectedSystemNode, setSelectedSystemNode] = useState<string | null>('rag');

  // Auto-scroll chat window
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  // Simulated Resume Scanner Process
  const handleStartResumeScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setScannerLogs(['Initializing parsing engine...']);
    setSelectedResumeFile('Resume_JohnDoe_SDE.pdf');

    const logs = [
      'Extracting structural sections (Education, Skills, Experience)...',
      'Scanning skill density (14 identified core competencies)...',
      'Matching keywords against Target: Senior Backend Engineer...',
      'Compiling ATS layout index scores...',
      'Comparing grammar alignment and tone density...',
      'Resolving skill gaps: Kubernetes & System Design missing...',
      'Scan finished! Finalizing report scores...'
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setScannerLogs((prevLogs) => [
            ...prevLogs,
            '✅ Analysis completed! Score: 85/100.',
            '💡 Action Required: Add bullet points describing distributed cache clusters or load balancers.'
          ]);
          return 100;
        }
        
        // Add log entries sequentially based on progress
        const logIndex = Math.floor((prev / 100) * logs.length);
        if (logIndex > currentStep && logs[logIndex]) {
          setScannerLogs((prevLogs) => [...prevLogs, logs[logIndex]]);
          currentStep = logIndex;
        }

        return prev + 2;
      });
    }, 80);
  };

  // Preset Chat prompts
  const chatPresets = [
    {
      prompt: "How do I optimize system scaling for interviews?",
      response: "To explain horizontal scaling in an interview:\n1. **Define the Load**: State how request rates (QPS) require separating read and write flows.\n2. **Database Sharding**: Explain partition keys to split tables across nodes.\n3. **Caching Tier**: Introduce Redis/Memcached with consistent hashing to prevent cache stampedes.\n4. **Load Balancers**: Explain Nginx/HAProxy round-robin or least-connections distribution."
    },
    {
      prompt: "Explain the difference between JWT and Session cookies.",
      response: "Here is a simple breakdown:\n• **JWT (Stateless)**: The server verifies the token signature without database queries. Fast, scalable, but hard to revoke before expiration.\n• **Session ID (Stateful)**: The server stores session data in Redis/DB. Easily revocable, highly secure, but adds DB query overhead on every request."
    },
    {
      prompt: "What is the STAR method for behavioral reviews?",
      response: "The STAR method structures your narrative:\n• **Situation**: The context of the problem (e.g., 'API latency increased by 400%').\n• **Task**: What your responsibility was ('I had to debug and restore server performance').\n• **Action**: The technical actions you took ('Reconfigured DB pool size and added query indexes').\n• **Result**: Measurable success ('Reduced latency by 85% and saved $4K in hosting costs')."
    }
  ];

  // AI Chat streaming simulation
  const handleChatPresetClick = (presetIndex: number) => {
    if (isTyping) return;
    const preset = chatPresets[presetIndex];
    
    // Add user message
    setChatMessages((prev) => [...prev, { sender: 'user', text: preset.prompt }]);
    setIsTyping(true);

    // Simulate typing answer
    setTimeout(() => {
      const words = preset.response.split(' ');
      let currentMsg = '';
      let wordIndex = 0;

      // Add empty assistant response
      setChatMessages((prev) => [...prev, { sender: 'assistant', text: '' }]);

      const streamInterval = setInterval(() => {
        if (wordIndex >= words.length) {
          clearInterval(streamInterval);
          setIsTyping(false);
          return;
        }
        
        currentMsg += (wordIndex === 0 ? '' : ' ') + words[wordIndex];
        setChatMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { sender: 'assistant', text: currentMsg };
          return updated;
        });
        wordIndex++;
      }, 60);
    }, 600);
  };

  // Handle custom user text input in preview chat widget
  const handleCustomChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isTyping) return;

    const userText = chatInput;
    setChatInput('');
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setIsTyping(true);

    setTimeout(() => {
      const responseText = `That is an excellent career question! To give you a customized evaluation on "${userText}", I need to examine your full profile. Sign up or log in, upload your resume, and let's dissect your target roles in our advanced workspace!`;
      const words = responseText.split(' ');
      let currentMsg = '';
      let wordIndex = 0;

      setChatMessages((prev) => [...prev, { sender: 'assistant', text: '' }]);

      const streamInterval = setInterval(() => {
        if (wordIndex >= words.length) {
          clearInterval(streamInterval);
          setIsTyping(false);
          return;
        }

        currentMsg += (wordIndex === 0 ? '' : ' ') + words[wordIndex];
        setChatMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { sender: 'assistant', text: currentMsg };
          return updated;
        });
        wordIndex++;
      }, 50);
    }, 700);
  };

  // Testimonials Array
  const testimonials: Testimonial[] = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      company: "Google",
      avatar: "SC",
      quote: "AI Career Copilot was a complete game-changer. The voice mock interview gave me exact confidence scoring that matched the actual loop at Google. The resume scanning fixed 12 ATS syntax faults!",
      rating: 5
    },
    {
      name: "Marcus Vance",
      role: "SDE Intern",
      company: "Amazon",
      avatar: "MV",
      quote: "The resume optimizer alone got me 4x more recruiter callbacks. The sandboxed coding workspace compiles directly in the browser and feels exactly like HackerRank tests. Exceptional SaaS tools!",
      rating: 5
    },
    {
      name: "Dr. Aris Thorne",
      role: "Director of Careers",
      company: "Stanford Engineering",
      avatar: "AT",
      quote: "As a placement coordinator, this suite optimized our student evaluations. The AI-generated roadmaps saved our counselors hundreds of hours and successfully placed 94% of our cohort.",
      rating: 5
    }
  ];

  const handleNextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auth Form Handlers
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalAuthError(null);

    if (authModal === 'login') {
      if (!authForm.email || !authForm.password) {
        setLocalAuthError('Please fill in all fields');
        return;
      }
      try {
        await login(authForm.email, authForm.password);
        setAuthModal(null);
        navigate('/career');
      } catch (err) {
        setLocalAuthError((err as Error).message || 'Invalid credentials');
      }
    } else {
      if (!authForm.name || !authForm.email || !authForm.password) {
        setLocalAuthError('Please fill in all fields');
        return;
      }
      try {
        await signup(authForm.name, authForm.email, authForm.password);
        setAuthModal(null);
        navigate('/career');
      } catch (err) {
        setLocalAuthError((err as Error).message || 'Signup failed');
      }
    }
  };

  const triggerAuthFromPlan = (type: 'login' | 'signup') => {
    setAuthForm({ name: '', email: '', password: '' });
    setLocalAuthError(null);
    setAuthModal(type);
  };

  // Radar chart SVG points based on targetRole
  const getRadarPoints = () => {
    switch (targetRole) {
      case 'backend':
        return "150,50 230,120 200,210 100,210 70,120"; // Weighted heavily towards system design / algorithms
      case 'frontend':
        return "150,90 240,110 180,220 120,200 60,140"; // Weighted towards UI layout / optimization
      case 'ai':
        return "150,30 210,130 220,190 80,190 90,130"; // Heavy algos, data systems, and system design
    }
  };

  const getSystemNodeDescription = () => {
    switch (selectedSystemNode) {
      case 'rag':
        return {
          title: "Intelligent RAG Router",
          tech: "LangChain / Semantic Router",
          desc: "Orchestrates user queries and profile metadata. Intelligently routes traffic to local agent clusters, vector systems, or database states depending on search intention."
        };
      case 'pinecone':
        return {
          title: "Vector Database DB",
          tech: "Pinecone / ChromaDB",
          desc: "Stores highly dense multi-dimensional vector embeddings of student resumes and current job market requirements. Enables fuzzy semantic mapping in < 12ms."
        };
      case 'voice':
        return {
          title: "Real-time Voice Evaluator",
          tech: "Web Speech API / Whispers",
          desc: "Processes vocal audio streams dynamically in the browser, providing instant sentiment analysis, grammatical fluency audits, and technical confidence ratios."
        };
      case 'stripe':
        return {
          title: "JWT & Stripe Infrastructure",
          tech: "JWT / Stripe Webhooks",
          desc: "Manages encrypted stateless sessions for absolute user security. Hooks into global merchant channels for fluid premium tier unlocking and automated subscription cycles."
        };
      case 'llm':
        return {
          title: "DeepMind / Anthropic Core",
          tech: "Gemini Pro / Claude 3.5 Sonnet",
          desc: "The generative mastermind. Scores ATS resumes, drafts behavioral questions, verifies browser sandboxed code compilers, and formulates high-density learning milestones."
        };
      default:
        return { title: '', tech: '', desc: '' };
    }
  };

  return (
    <div className="landing-shell" style={{ position: 'relative', overflowX: 'hidden' }}>
      
      {/* Visual background decorations */}
      <div className="saas-grid-bg"></div>
      <div className="glowing-orb orb-primary"></div>
      <div className="glowing-orb orb-secondary"></div>
      <div className="glowing-orb orb-cyan"></div>

      {/* 1. HERO SECTION */}
      <section className="hero-section" style={{
        padding: '80px 0 60px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
        zIndex: 10
      }}>
        
        <span className="status-badge primary" style={{
          marginBottom: '20px',
          animation: 'pulse-ring-glow 2s infinite alternate',
          letterSpacing: '0.08em',
          fontWeight: 700
        }}>
          ✨ THE NEXT-GEN AI PLACEMENT COMPASS
        </span>

        <h1
          className="landing-hero-title"
          style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: '-0.04em',
            maxWidth: '1000px',
            margin: '0 auto 20px'
          }}
        >
          <span className="landing-hero-title-soft">
            Your Personal AI Career Mentor for
          </span>
          <br />
          <span className="landing-hero-title-gradient">
            Placements & Dream Jobs.
          </span>
        </h1>

        <p style={{
          fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
          color: 'var(--text-secondary)',
          lineHeight: '1.6',
          maxWidth: '780px',
          margin: '0 auto 36px',
        }}>
          Upload your resume for real-time ATS optimization, simulate authentic voice interviews with generative metrics, map custom skill-roadmaps, practice in our compiled IDE, and secure offers.
        </p>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          justifyContent: 'center',
          marginBottom: '56px'
        }}>
          {isAuthenticated ? (
            <Link to="/career" className="btn-saas-gradient" style={{ padding: '14px 36px', fontSize: '1rem' }}>
              Enter Career Workspace 🚀
            </Link>
          ) : (
            <button 
              onClick={() => triggerAuthFromPlan('signup')} 
              className="btn-saas-gradient" 
              style={{ padding: '14px 36px', fontSize: '1rem' }}
            >
              Get Started Free
            </button>
          )}
          <a href="#chat-preview" className="btn-saas-outline-glow" style={{ padding: '14px 36px', fontSize: '1rem' }}>
            Try Live Chat Preview
          </a>
        </div>

        {/* Live Counter Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '24px',
          width: '100%',
          maxWidth: '960px',
          margin: '0 auto 64px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ padding: '10px' }}>
            <h4 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>50,000+</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Students Placed</p>
          </div>
          <div style={{ padding: '10px', borderLeft: '1px solid var(--border)' }}>
            <h4 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)' }}>95.4%</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ATS Match Rate</p>
          </div>
          <div style={{ padding: '10px', borderLeft: '1px solid var(--border)' }}>
            <h4 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-light)' }}>12,000+</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Interviews Hosted</p>
          </div>
          <div style={{ padding: '10px', borderLeft: '1px solid var(--border)' }}>
            <h4 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--warning)' }}>4.92 / 5</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Placement Score</p>
          </div>
        </div>

        {/* HIGH-FIDELITY INTERACTIVE DASHBOARD MOCKUP */}
        <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto' }}>
          <div className="mockup-browser">
            <div className="mockup-browser-header">
              <span className="mockup-dot red"></span>
              <span className="mockup-dot yellow"></span>
              <span className="mockup-dot green"></span>
              <div className="mockup-browser-url">copilot.ai/dashboard/alignment-metrics</div>
            </div>

            <div style={{ padding: '24px', background: 'rgba(9, 13, 22, 0.95)', display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px', textAlign: 'left' }}>
              
              {/* Left Side: ATS Scanner Simulator */}
              <div className="col-6" style={{ background: 'rgba(16, 23, 38, 0.6)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--primary)' }}>📝</span> AI ATS Resume Alignment Scanner
                  </h3>
                  <span className="status-badge success">{selectedResumeFile ? 'Active PDF' : 'Ready'}</span>
                </div>

                <div style={{
                  height: '180px',
                  background: 'rgba(3, 7, 18, 0.8)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '16px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  overflowY: 'auto',
                  border: '1px solid rgba(255,255,255,0.05)',
                  position: 'relative'
                }}>
                  {isScanning && <div className="scanner-beam"></div>}
                  {scannerLogs.map((log, idx) => (
                    <div key={idx} style={{ marginBottom: '6px', color: log.startsWith('✅') ? 'var(--accent-light)' : log.startsWith('💡') ? 'var(--warning)' : 'inherit' }}>
                      {log}
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <button 
                    onClick={handleStartResumeScan}
                    disabled={isScanning}
                    className="btn-saas-outline-glow" 
                    style={{ padding: '8px 16px', fontSize: '0.8rem', opacity: isScanning ? 0.6 : 1 }}
                  >
                    {isScanning ? `Scanning (${scanProgress}%)` : 'Start AI Scan Simulation'}
                  </button>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    File: <strong style={{ color: 'var(--text)' }}>{selectedResumeFile || 'None loaded'}</strong>
                  </span>
                </div>
              </div>

              {/* Right Side: Interactive Competency Radar & Active stats */}
              <div className="col-6" style={{ background: 'rgba(16, 23, 38, 0.6)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>📊 Competency Target Analysis</h3>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button 
                      onClick={() => setTargetRole('backend')}
                      style={{
                        padding: '4px 8px',
                        fontSize: '0.7rem',
                        borderRadius: '4px',
                        background: targetRole === 'backend' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                        color: targetRole === 'backend' ? '#000' : '#fff',
                        fontWeight: 700
                      }}
                    >
                      Backend
                    </button>
                    <button 
                      onClick={() => setTargetRole('frontend')}
                      style={{
                        padding: '4px 8px',
                        fontSize: '0.7rem',
                        borderRadius: '4px',
                        background: targetRole === 'frontend' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                        color: targetRole === 'frontend' ? '#000' : '#fff',
                        fontWeight: 700
                      }}
                    >
                      Frontend
                    </button>
                    <button 
                      onClick={() => setTargetRole('ai')}
                      style={{
                        padding: '4px 8px',
                        fontSize: '0.7rem',
                        borderRadius: '4px',
                        background: targetRole === 'ai' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                        color: targetRole === 'ai' ? '#000' : '#fff',
                        fontWeight: 700
                      }}
                    >
                      AI/LLM
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', height: '200px' }}>
                  
                  {/* Interactive SVG Radar Drawing */}
                  <svg width="220" height="200" style={{ overflow: 'visible' }}>
                    {/* Background pentagon rings */}
                    <polygon points="150,20 250,90 210,200 90,200 50,90" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                    <polygon points="150,50 220,100 190,170 110,170 80,100" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    <polygon points="150,80 190,110 170,140 130,140 110,110" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

                    {/* Central connecting axes lines */}
                    <line x1="150" y1="110" x2="150" y2="20" stroke="rgba(255,255,255,0.1)" />
                    <line x1="150" y1="110" x2="250" y2="90" stroke="rgba(255,255,255,0.1)" />
                    <line x1="150" y1="110" x2="210" y2="200" stroke="rgba(255,255,255,0.1)" />
                    <line x1="150" y1="110" x2="90" y2="200" stroke="rgba(255,255,255,0.1)" />
                    <line x1="150" y1="110" x2="50" y2="90" stroke="rgba(255,255,255,0.1)" />

                    {/* Axis Labels */}
                    <text x="150" y="12" fill="var(--text-secondary)" fontSize="8" textAnchor="middle">ATS MATCH</text>
                    <text x="260" y="94" fill="var(--text-secondary)" fontSize="8" textAnchor="start">SYSTEMS</text>
                    <text x="215" y="212" fill="var(--text-secondary)" fontSize="8" textAnchor="start">BEHAVIORAL</text>
                    <text x="85" y="212" fill="var(--text-secondary)" fontSize="8" textAnchor="end">ALGORITHMS</text>
                    <text x="40" y="94" fill="var(--text-secondary)" fontSize="8" textAnchor="end">UI DENSITY</text>

                    {/* Colored Active Polygon Area with Glow transitions */}
                    <polygon 
                      points={getRadarPoints()} 
                      fill="rgba(56, 189, 248, 0.25)" 
                      stroke="var(--primary)" 
                      strokeWidth="2" 
                      style={{ transition: 'all 0.5s ease' }} 
                    />
                    
                    {/* Glowing coordinate nodes */}
                    {getRadarPoints().split(' ').map((point, index) => {
                      const [x, y] = point.split(',');
                      return (
                        <circle 
                          key={index}
                          cx={x} 
                          cy={y} 
                          r="4" 
                          fill="var(--secondary)" 
                          stroke="#fff" 
                          strokeWidth="1"
                          style={{ transition: 'all 0.5s ease', filter: 'drop-shadow(0 0 4px var(--secondary))' }}
                        />
                      );
                    })}
                  </svg>

                  {/* Competency detail feedback card */}
                  <div style={{ flex: 1, fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Focus Role:</span>
                      <div style={{ fontWeight: 700, textTransform: 'capitalize', color: 'var(--primary)' }}>
                        {targetRole} Engineering
                      </div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-secondary)' }}>Current Alignment:</span>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text)' }}>
                        {targetRole === 'backend' ? '86% (Strong)' : targetRole === 'frontend' ? '91% (Ready)' : '78% (Growing)'}
                      </div>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', lineHeight: 1.4 }}>
                      {targetRole === 'backend' && 'Highly aligned in databases and APIs. Missing production container tools.'}
                      {targetRole === 'frontend' && 'Stunning UI composition scores. Suggest adding Webpack configuration metrics.'}
                      {targetRole === 'ai' && 'Solid neural structure knowledge. Needs additional system deployment experience.'}
                    </p>
                  </div>

                </div>

              </div>

            </div>
          </div>
        </div>

      </section>

      {/* 2. CORE FEATURES GRID */}
      <section id="features" style={{ padding: '80px 24px', position: 'relative', zIndex: 10 }}>
        
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span className="status-badge success" style={{ marginBottom: '12px' }}>
            🛠️ COMPLETE PREPARATION MODULES
          </span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Engineered to Close Every Skill Gap
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '640px', margin: '8px auto 0' }}>
            Stop juggling multiple platform subscriptions. AI Career Copilot consolidates the complete recruitment pipeline under one beautiful, automated interface.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          
          {/* Card 1: Resume Optimizer */}
          <article className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '2rem' }}>📝</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>ATS Resume Optimizer</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Submit your CV for high-fidelity scanning. Our systems score formatting, key densities, and phrasing syntax against raw industry standards, generating instant line-by-line rewrite suggestions.
            </p>
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>Active Scorecard Integration</span>
              <span className="status-badge success">Match verified</span>
            </div>
          </article>

          {/* Card 2: AI Voice Interviewer */}
          <article className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '2rem' }}>🗣️</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>AI Voice Mock Evaluator</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Simulate actual recruiters in realistic, voice-streamed mock loops. Practice technical, behavioral, or system scaling evaluations and receive instant transcript markers with sentiment metrics.
            </p>
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: 600 }}>Audio Streaming Engine</span>
              <span className="status-badge primary">Voice & Chat</span>
            </div>
          </article>

          {/* Card 3: Skill Gap Scanner */}
          <article className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '2rem' }}>🔍</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Semantic Skill Gap Detection</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Compare your experience bullet points against target job descriptions in real-time. Our vector database instantly flags missing technical toolsets and concepts before you submit applications.
            </p>
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-light)', fontWeight: 600 }}>Vector Matching Algorithms</span>
              <span className="status-badge primary">Pinecone RAG</span>
            </div>
          </article>

          {/* Card 4: Roadmap Generator */}
          <article className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '2rem' }}>📚</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Custom Interactive Roadmaps</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Receive a step-by-step personalized learning curriculum to conquer missing competencies. Features built-in mock quizzes and direct text explanations to track milestone completions smoothly.
            </p>
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--warning)', fontWeight: 600 }}>Milestone Tracking</span>
              <span className="status-badge success">{roadmap.length} Active Node</span>
            </div>
          </article>

          {/* Card 5: Sandboxed Coding IDE */}
          <article className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '2rem' }}>💻</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Sandboxed Coding Sandbox</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Practice mock algorithms in our browser-compiled, syntax-highlighted IDE. Solve code challenges and run immediate evaluations against predefined edge-case test matrix suites directly.
            </p>
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>Browser JS Compiler</span>
              <span className="status-badge danger">Sandbox Ready</span>
            </div>
          </article>

          {/* Card 6: Kanban Pipeline Tracker */}
          <article className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '2rem' }}>💼</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Kanban Job Funnel Tracker</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Stay on top of recruiting funnels with a dedicated Kanban taskboard. Log dates, add application review templates, save custom salary benchmarks, and monitor your funnel ratios smoothly.
            </p>
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-light)', fontWeight: 600 }}>Drag-and-Drop Structure</span>
              <span className="status-badge success">{jobs.length} Active Jobs</span>
            </div>
          </article>

        </div>
      </section>

      {/* 3. ADVANCED AI SYSTEMS NETWORK DIAGRAM */}
      <section id="ai-systems" style={{ padding: '80px 24px', background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', position: 'relative', zIndex: 10 }}>
        
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span className="status-badge primary" style={{ marginBottom: '12px' }}>
            ⚙️ PLATFORM ARCHITECTURE
          </span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Next-Gen RAG & Agent Coordination Flow
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '640px', margin: '8px auto 0' }}>
            Take a look under the hood. Hover or click on the core server hubs below to inspect how AI orchestrates your career roadmap metrics in real-time.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '40px', maxWidth: '1100px', margin: '0 auto', alignItems: 'center' }}>
          
          {/* Left Grid: SVG Connections mapping */}
          <div className="col-7" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'visible' }}>
            
            {/* Locked-Width Diagram Frame to prevent coordinate drift */}
            <div style={{ position: 'relative', width: '540px', height: '350px', flexShrink: 0 }}>
              
              {/* SVG connectors with active pulsing beams */}
              <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible', zIndex: 1 }}>
                
                {/* Connector Paths */}
                <path d="M 50,175 Q 120,75 220,75" fill="none" stroke="rgba(168, 85, 247, 0.25)" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M 50,175 Q 120,275 220,275" fill="none" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M 220,75 H 420" fill="none" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="2" />
                <path d="M 220,275 H 420" fill="none" stroke="rgba(168, 85, 247, 0.2)" strokeWidth="2" />
                <path d="M 420,75 Q 490,175 420,275" fill="none" stroke="rgba(16, 185, 129, 0.25)" strokeWidth="2" strokeDasharray="4 4" />

                {/* SVG Pulsing Beams (Simulated via traveling bullets along paths) */}
                <circle cx="150" cy="115" r="4" fill="var(--primary)" filter="drop-shadow(0 0 4px var(--primary))">
                  <animateMotion path="M 50,175 Q 120,75 220,75" dur="3s" repeatCount="indefinite" />
                </circle>
                
                <circle cx="150" cy="235" r="4" fill="var(--secondary)" filter="drop-shadow(0 0 4px var(--secondary))">
                  <animateMotion path="M 50,175 Q 120,275 220,275" dur="4s" repeatCount="indefinite" />
                </circle>

                <circle cx="320" cy="75" r="4" fill="var(--accent)">
                  <animateMotion path="M 220,75 H 420" dur="2s" repeatCount="indefinite" />
                </circle>
              </svg>

              {/* Dynamic Node Elements (Centered mathematically at x=50, 220, 420) */}
              <div style={{ position: 'absolute', top: '140px', left: '15px', zIndex: 10 }}>
                <button 
                  onClick={() => setSelectedSystemNode('voice')}
                  style={{
                    background: selectedSystemNode === 'voice' ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'var(--surface)',
                    border: `1px solid ${selectedSystemNode === 'voice' ? 'var(--primary)' : 'var(--border)'}`,
                    color: selectedSystemNode === 'voice' ? '#000' : '#fff',
                    width: '70px', height: '70px', borderRadius: '50%', cursor: 'pointer', fontWeight: 800, fontSize: '0.8rem',
                    boxShadow: selectedSystemNode === 'voice' ? '0 0 20px rgba(56, 189, 248, 0.4)' : 'none',
                    display: 'grid', placeItems: 'center', transition: 'all 0.3s ease'
                  }}
                >
                  🎤 Voice
                </button>
              </div>

              <div style={{ position: 'absolute', top: '54px', left: '220px', transform: 'translateX(-50%)', zIndex: 10 }}>
                <button 
                  onClick={() => setSelectedSystemNode('rag')}
                  style={{
                    background: selectedSystemNode === 'rag' ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'var(--surface)',
                    border: `1px solid ${selectedSystemNode === 'rag' ? 'var(--primary)' : 'var(--border)'}`,
                    color: selectedSystemNode === 'rag' ? '#000' : '#fff',
                    padding: '12px 20px', borderRadius: '9999px', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem',
                    boxShadow: selectedSystemNode === 'rag' ? '0 0 20px rgba(56, 189, 248, 0.4)' : 'none',
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap'
                  }}
                >
                  🛰️ RAG Coordinator
                </button>
              </div>

              <div style={{ position: 'absolute', bottom: '54px', left: '220px', transform: 'translateX(-50%)', zIndex: 10 }}>
                <button 
                  onClick={() => setSelectedSystemNode('pinecone')}
                  style={{
                    background: selectedSystemNode === 'pinecone' ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'var(--surface)',
                    border: `1px solid ${selectedSystemNode === 'pinecone' ? 'var(--primary)' : 'var(--border)'}`,
                    color: selectedSystemNode === 'pinecone' ? '#000' : '#fff',
                    padding: '12px 20px', borderRadius: '9999px', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem',
                    boxShadow: selectedSystemNode === 'pinecone' ? '0 0 20px rgba(168, 85, 247, 0.4)' : 'none',
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap'
                  }}
                >
                  💾 Pinecone DB
                </button>
              </div>

              <div style={{ position: 'absolute', top: '35px', left: '420px', transform: 'translateX(-50%)', zIndex: 10 }}>
                <button 
                  onClick={() => setSelectedSystemNode('llm')}
                  style={{
                    background: selectedSystemNode === 'llm' ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'var(--surface)',
                    border: `1px solid ${selectedSystemNode === 'llm' ? 'var(--primary)' : 'var(--border)'}`,
                    color: selectedSystemNode === 'llm' ? '#000' : '#fff',
                    width: '80px', height: '80px', borderRadius: '50%', cursor: 'pointer', fontWeight: 800, fontSize: '0.85rem',
                    boxShadow: selectedSystemNode === 'llm' ? '0 0 25px rgba(56, 189, 248, 0.4)' : 'none',
                    display: 'grid', placeItems: 'center', transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap'
                  }}
                >
                  🧠 LLM Core
                </button>
              </div>

              <div style={{ position: 'absolute', bottom: '54px', left: '420px', transform: 'translateX(-50%)', zIndex: 10 }}>
                <button 
                  onClick={() => setSelectedSystemNode('stripe')}
                  style={{
                    background: selectedSystemNode === 'stripe' ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'var(--surface)',
                    border: `1px solid ${selectedSystemNode === 'stripe' ? 'var(--primary)' : 'var(--border)'}`,
                    color: selectedSystemNode === 'stripe' ? '#000' : '#fff',
                    padding: '12px 20px', borderRadius: '9999px', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem',
                    boxShadow: selectedSystemNode === 'stripe' ? '0 0 20px rgba(168, 85, 247, 0.4)' : 'none',
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap'
                  }}
                >
                  💳 Stripe JWT
                </button>
              </div>

            </div>

          </div>

          {/* Right Grid: Explanation box */}
          <div className="col-5">
            <div className="glass-panel" style={{ padding: '32px', textAlign: 'left', minHeight: '260px' }}>
              <span className="status-badge success" style={{ marginBottom: '8px' }}>
                {getSystemNodeDescription().tech}
              </span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px', color: 'var(--text)' }}>
                {getSystemNodeDescription().title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                {getSystemNodeDescription().desc}
              </p>
              <div style={{ marginTop: '24px', display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700 }}>
                <span>✨ Connected to global endpoint nodes</span>
                <span className="status-badge success" style={{ padding: '2px 8px', fontSize: '0.65rem' }}>ONLINE</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. LIVE AI MENTOR CHAT PREVIEW WIDGET */}
      <section id="chat-preview" style={{ padding: '80px 24px', position: 'relative', zIndex: 10 }}>
        
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="status-badge primary" style={{ marginBottom: '12px' }}>
            💬 CHAT LIVE WITH MENTOR
          </span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Test Your Mentorship Copilot Below
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '640px', margin: '8px auto 0' }}>
            Ask anything about technical system design, behaviorals, or placement roadmaps. Try clicking our preset prompts to watch our real-time streaming answer simulation!
          </p>
        </div>

        <div className="glass-panel" style={{
          maxWidth: '820px',
          margin: '0 auto',
          padding: '24px',
          background: 'rgba(16, 23, 38, 0.75)',
          border: '1px solid var(--border-hover)',
          boxShadow: 'var(--shadow-glow)',
          display: 'flex',
          flexDirection: 'column',
          height: '520px',
          textAlign: 'left'
        }}>
          
          {/* Preset trigger prompts */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', alignSelf: 'center' }}>Presets:</span>
            {chatPresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleChatPresetClick(idx)}
                disabled={isTyping}
                style={{
                  padding: '6px 12px',
                  background: 'rgba(56, 189, 248, 0.05)',
                  border: '1px solid rgba(56, 189, 248, 0.15)',
                  color: 'var(--primary)',
                  fontSize: '0.78rem',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                  opacity: isTyping ? 0.6 : 1
                }}
              >
                💡 {preset.prompt}
              </button>
            ))}
          </div>

          {/* Chat Messages thread */}
          <div style={{
            flex: 1,
            background: 'rgba(3, 7, 18, 0.8)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '20px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            marginBottom: '16px'
          }}>
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div style={{
                  maxWidth: '85%',
                  background: msg.sender === 'user' ? 'linear-gradient(135deg, var(--primary), var(--primary-dark))' : 'rgba(255, 255, 255, 0.03)',
                  border: msg.sender === 'user' ? 'none' : '1px solid var(--border)',
                  color: msg.sender === 'user' ? '#000' : 'var(--text)',
                  padding: '12px 18px',
                  borderRadius: msg.sender === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                  fontSize: '0.88rem',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-line',
                  fontWeight: msg.sender === 'user' ? 600 : 400
                }}>
                  {msg.text || (isTyping && idx === chatMessages.length - 1 ? 'Typing guidance...' : '')}
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{ display: 'flex', gap: '6px', alignSelf: 'flex-start', paddingLeft: '8px' }}>
                <span className="status-badge primary" style={{ padding: '4px 10px', fontSize: '0.65rem' }}>AI streaming...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Form input */}
          <form onSubmit={handleCustomChatSubmit} style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask anything about interviews, resumes, or engineering..."
              style={{
                flex: 1,
                background: 'rgba(3, 7, 18, 0.6)',
                border: '1px solid var(--border)',
                borderRadius: '9999px',
                padding: '12px 24px',
                fontSize: '0.9rem',
                color: '#fff',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={isTyping || !chatInput.trim()}
              className="btn-saas-gradient"
              style={{
                padding: '12px 28px',
                borderRadius: '9999px',
                fontSize: '0.88rem',
                opacity: isTyping || !chatInput.trim() ? 0.6 : 1
              }}
            >
              Send 🚀
            </button>
          </form>

        </div>
      </section>

      {/* 5. HOW IT WORKS TIMELINE */}
      <section style={{ padding: '80px 24px', background: 'rgba(3, 7, 18, 0.2)', position: 'relative', zIndex: 10 }}>
        
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span className="status-badge warning" style={{ marginBottom: '12px' }}>
            🚀 STEP-BY-STEP RECRUITING PIPELINE
          </span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
            How AI Career Copilot Works
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '640px', margin: '8px auto 0' }}>
            Our structured, data-driven cycle guides you smoothly from first-time registration directly to signed job offers.
          </p>
        </div>

        <div className="timeline-saas-flow">
          
          {/* Step 1 */}
          <div className="timeline-saas-step">
            <div className="timeline-saas-marker">1</div>
            <div className="timeline-saas-content">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '4px' }}>Establish Target Targets</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Define your ideal job specifications, target engineering fields (Backend, Frontend, Fullstack, AI), and experience thresholds during authentication.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="timeline-saas-step">
            <div className="timeline-saas-marker">2</div>
            <div className="timeline-saas-content">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '4px' }}>Upload Resume to Scan</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Run your resume through the generative ATS alignment scoring tool to resolve layout formatting faults and identify critical semantic keyword deficits instantly.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="timeline-saas-step">
            <div className="timeline-saas-marker">3</div>
            <div className="timeline-saas-content">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '4px' }}>Acquire Missing Skillsets</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Tackle custom learning milestones crafted specifically to plug your parsed technical gaps. Test structural knowledge with interactive mock quizzes.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="timeline-saas-step">
            <div className="timeline-saas-marker">4</div>
            <div className="timeline-saas-content">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '4px' }}>Slay the Mock Interview Loops</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Simulate authentic high-intensity recruiting rounds with our responsive generative voice bots, honing your behavioral storytelling and deep architectural reasoning.
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="timeline-saas-step">
            <div className="timeline-saas-marker">5</div>
            <div className="timeline-saas-content">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '4px' }}>Sandbox Coding Drills</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Refine problem-solving algorithms inside our compiled, syntactically scoped compiler sandbox, executing scripts against standard edge cases directly.
              </p>
            </div>
          </div>

          {/* Step 6 */}
          <div className="timeline-saas-step">
            <div className="timeline-saas-marker">6</div>
            <div className="timeline-saas-content">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '4px' }}>Track Applications to the Signed Offer</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Manage recruiting schedules, application feedback cards, and active salary negotiations inside our integrated Kanban pipeline board to secure the dream job.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 6. TESTIMONIALS CAROUSEL */}
      <section id="testimonials" style={{ padding: '80px 24px', position: 'relative', zIndex: 10 }}>
        
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="status-badge success" style={{ marginBottom: '12px' }}>
            ⭐ SUCCESS FEEDBACKS
          </span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Trusted by Placing Students Globally
          </h2>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '20px' }}>
          
          <button 
            onClick={handlePrevTestimonial}
            style={{
              background: 'var(--surface)', border: '1px solid var(--border)', width: '48px', height: '48px', borderRadius: '50%',
              cursor: 'pointer', display: 'grid', placeItems: 'center', fontSize: '1.2rem', color: '#fff',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            ←
          </button>

          <div className="glass-panel" style={{ flex: 1, padding: '36px', textAlign: 'left', position: 'relative', minHeight: '220px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{
                  width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                  display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: '1.1rem', color: '#fff'
                }}>
                  {testimonials[activeTestimonial].avatar}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{testimonials[activeTestimonial].name}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {testimonials[activeTestimonial].role} at <strong style={{ color: 'var(--primary)' }}>{testimonials[activeTestimonial].company}</strong>
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '2px', color: 'var(--warning)', fontSize: '1.1rem' }}>
                {'★'.repeat(testimonials[activeTestimonial].rating)}
              </div>
            </div>

            <p style={{ fontStyle: 'italic', color: 'var(--text)', fontSize: '1rem', lineHeight: '1.6' }}>
              &ldquo;{testimonials[activeTestimonial].quote}&rdquo;
            </p>

          </div>

          <button 
            onClick={handleNextTestimonial}
            style={{
              background: 'var(--surface)', border: '1px solid var(--border)', width: '48px', height: '48px', borderRadius: '50%',
              cursor: 'pointer', display: 'grid', placeItems: 'center', fontSize: '1.2rem', color: '#fff',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            →
          </button>

        </div>
      </section>

      {/* 7. PRICING MATRIX GRID */}
      <section id="pricing" style={{ padding: '80px 24px', borderTop: '1px solid var(--border)', position: 'relative', zIndex: 10 }}>
        
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span className="status-badge primary" style={{ marginBottom: '12px' }}>
            🏷️ FLEXIBLE SaaS TIERS
          </span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Stunning Value for Ambitious Seekers
          </h2>
          
          {/* Monthly / Yearly Toggle */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '24px' }}>
            <span style={{ fontSize: '0.9rem', color: billingInterval === 'monthly' ? '#fff' : 'var(--text-secondary)' }}>Monthly Billed</span>
            <button
              onClick={() => setBillingInterval(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
              style={{
                width: '64px', height: '32px', borderRadius: '9999px', background: 'var(--surface-alt)',
                position: 'relative', cursor: 'pointer', border: '1px solid var(--border)', padding: '2px'
              }}
            >
              <div style={{
                width: '26px', height: '26px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                position: 'absolute', top: '2px', left: billingInterval === 'monthly' ? '2px' : '34px',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
              }} />
            </button>
            <span style={{ fontSize: '0.9rem', color: billingInterval === 'yearly' ? '#fff' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Yearly Billed <strong className="status-badge success" style={{ padding: '2px 8px', fontSize: '0.65rem' }}>Save 20%</strong>
            </span>
          </div>

        </div>

        <div className="pricing-grid" style={{ maxWidth: '1100px', margin: '40px auto 0' }}>
          
          {/* Starter Plan */}
          <div className="pricing-card">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>Starter Free</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', minHeight: '40px' }}>
              Hone basic alignment skills. Excellent for entry-level profiling audits.
            </p>
            <div className="pricing-price">
              $0
              <span>/ month</span>
            </div>
            
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', margin: '24px 0', fontSize: '0.88rem', color: 'var(--text-secondary)', textAlign: 'left' }}>
              <li>✓ Basic ATS Resume Alignment scoring</li>
              <li>✓ 3 simulated voice interviews</li>
              <li>✓ Single standard learning roadmap</li>
              <li>✓ basic compiler Sandbox templates</li>
              <li style={{ textDecoration: 'line-through', opacity: 0.5 }}>✗ Unlimited system design critiques</li>
              <li style={{ textDecoration: 'line-through', opacity: 0.5 }}>✗ Live vector skill gap matching</li>
            </ul>

            <button 
              onClick={() => triggerAuthFromPlan('signup')} 
              className="btn-secondary" 
              style={{ marginTop: 'auto', width: '100%', justifyContent: 'center' }}
            >
              Get Started Free
            </button>
          </div>

          {/* Pro Premium Plan */}
          <div className="pricing-card premium-pro">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px', color: 'var(--primary)' }}>Professional Pro</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', minHeight: '40px' }}>
              Complete recruitment prep package. Unlimited AI evaluations and vector support.
            </p>
            <div className="pricing-price">
              {billingInterval === 'monthly' ? '$19' : '$15'}
              <span>/ month</span>
            </div>
            
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', margin: '24px 0', fontSize: '0.88rem', color: 'var(--text)', textAlign: 'left' }}>
              <li>✓ **Unlimited** ATS resume alignment optimization</li>
              <li>✓ **Unlimited** streaming voice interview slots</li>
              <li>✓ High-fidelity vector skill gap analysis</li>
              <li>✓ Interactive sandbox coding evaluations</li>
              <li>✓ Personal learning curriculum modules</li>
              <li>✓ Priority ticket support response</li>
            </ul>

            <button 
              onClick={() => triggerAuthFromPlan('signup')} 
              className="btn-saas-gradient" 
              style={{ marginTop: 'auto', width: '100%', justifyContent: 'center' }}
            >
              Start Pro Free Trial
            </button>
          </div>

          {/* Enterprise University Plan */}
          <div className="pricing-card">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>Enterprise Hub</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', minHeight: '40px' }}>
              For colleges, engineering universities, and placement administrative hubs.
            </p>
            <div className="pricing-price" style={{ fontSize: '2rem' }}>
              Custom
            </div>
            
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', margin: '24px 0', fontSize: '0.88rem', color: 'var(--text-secondary)', textAlign: 'left' }}>
              <li>✓ Bulk cohort license distributions</li>
              <li>✓ Shared admin analytics dashboard charts</li>
              <li>✓ Customized skill metrics configurations</li>
              <li>✓ API tokens access for external databases</li>
              <li>✓ Dedicated account placement officer</li>
              <li>✓ SLA uptime guaranteed</li>
            </ul>

            <a 
              href="mailto:partners@copilot.ai?subject=Enterprise Placement Partnerships" 
              className="btn-secondary" 
              style={{ marginTop: 'auto', width: '100%', justifyContent: 'center', display: 'inline-flex', alignItems: 'center' }}
            >
              Contact Partnerships
            </a>
          </div>

        </div>
      </section>

      {/* 8. AUTHENTICATION MODALS */}
      {authModal && (
        <div className="modal-overlay" onClick={() => setAuthModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center' }}>
            
            <button className="modal-close" onClick={() => setAuthModal(null)} aria-label="Close auth popup">
              ✕
            </button>

            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>
              {authModal === 'login' ? 'Welcome Back!' : 'Create Account'}
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Secure stateless session orchestration via RAG gateway services.
            </p>

            {/* Auth Tab selectors */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '9999px', border: '1px solid var(--border)' }}>
              <button
                onClick={() => setAuthTab('google')}
                style={{
                  flex: 1, padding: '10px 16px', borderRadius: '9999px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                  background: authTab === 'google' ? 'var(--surface-alt)' : 'transparent', color: authTab === 'google' ? '#fff' : 'var(--text-secondary)'
                }}
              >
                Google Auth
              </button>
              <button
                onClick={() => setAuthTab('github')}
                style={{
                  flex: 1, padding: '10px 16px', borderRadius: '9999px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                  background: authTab === 'github' ? 'var(--surface-alt)' : 'transparent', color: authTab === 'github' ? '#fff' : 'var(--text-secondary)'
                }}
              >
                GitHub Auth
              </button>
              <button
                onClick={() => setAuthTab('email')}
                style={{
                  flex: 1, padding: '10px 16px', borderRadius: '9999px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                  background: authTab === 'email' ? 'var(--surface-alt)' : 'transparent', color: authTab === 'email' ? '#fff' : 'var(--text-secondary)'
                }}
              >
                Credentials
              </button>
            </div>

            {/* Google or GitHub fast authorization */}
            {(authTab === 'google' || authTab === 'github') && (
              <div style={{ padding: '24px 0' }}>
                <button
                  onClick={async () => {
                    // Fast OAuth Mock Logins
                    try {
                      await login('demo@copilot.ai', 'password123');
                      setAuthModal(null);
                      navigate('/career');
                    } catch (err) {
                      setLocalAuthError('OAuth Simulation Failure');
                    }
                  }}
                  className="btn-saas-gradient"
                  style={{ width: '100%', padding: '14px 24px', justifyContent: 'center' }}
                >
                  Authorize Fast Simulation with {authTab === 'google' ? 'Google' : 'GitHub'} 🚀
                </button>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '12px' }}>
                  Click to bypass standard forms and load placement simulation instantly.
                </p>
              </div>
            )}

            {/* Standard credentials form */}
            {authTab === 'email' && (
              <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
                
                {authModal === 'signup' && (
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Full Name</label>
                    <input
                      type="text"
                      required
                      value={authForm.name}
                      onChange={(e) => setAuthForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. John Doe"
                      style={{
                        width: '100%', padding: '12px 18px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)', color: '#fff', fontSize: '0.9rem', outline: 'none'
                      }}
                    />
                  </div>
                )}

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Email Address</label>
                  <input
                    type="email"
                    required
                    value={authForm.email}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="e.g. candidate@domain.com"
                    style={{
                      width: '100%', padding: '12px 18px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)', color: '#fff', fontSize: '0.9rem', outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Encrypted Password</label>
                  <input
                    type="password"
                    required
                    value={authForm.password}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Minimum 6 characters..."
                    style={{
                      width: '100%', padding: '12px 18px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)', color: '#fff', fontSize: '0.9rem', outline: 'none'
                    }}
                  />
                </div>

                {localAuthError && (
                  <div style={{ color: 'var(--danger)', fontSize: '0.82rem', fontWeight: 600 }}>
                    ⚠️ {localAuthError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isAuthLoading}
                  className="btn-saas-gradient"
                  style={{ width: '100%', padding: '14px 24px', justifyContent: 'center', marginTop: '8px', opacity: isAuthLoading ? 0.6 : 1 }}
                >
                  {isAuthLoading ? 'Processing Credentials...' : authModal === 'login' ? 'Sign In Workspace' : 'Register Secure Profile'}
                </button>

              </form>
            )}

            <div style={{ borderTop: '1px solid var(--border)', marginTop: '24px', paddingTop: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {authModal === 'login' ? (
                <span>New candidate? <button onClick={() => triggerAuthFromPlan('signup')} style={{ color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}>Create placement profile</button></span>
              ) : (
                <span>Already have a profile? <button onClick={() => triggerAuthFromPlan('login')} style={{ color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}>Sign in to hub</button></span>
              )}
            </div>

          </div>
        </div>
      )}

      {/* 9. FOOTER SECTION */}
      <footer className="footer-shell" style={{ marginTop: '80px', borderTop: '1px solid var(--border)', background: 'var(--surface)', position: 'relative', zIndex: 10 }}>
        <div className="footer-grid-saas" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 0 20px', textAlign: 'left' }}>
          
          {/* Col 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="logo-icon" style={{ width: '32px', height: '32px', fontSize: '0.9rem' }}>Ω</div>
              <strong style={{ fontSize: '1.2rem', fontWeight: 800 }}>AI Career Copilot</strong>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              World-class automated placement suite guiding software engineering and product seekers directly into tech roles.
            </p>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              © 2026 AI Career Copilot Inc. <br/>All vectors secure.
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text)', marginBottom: '16px', letterSpacing: '0.05em' }}>Capabilities</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <li><Link to="/resume" style={{ cursor: 'pointer' }}>ATS Resume Analyzer</Link></li>
              <li><Link to="/interview" style={{ cursor: 'pointer' }}>Mock Voice Simulator</Link></li>
              <li><Link to="/career" style={{ cursor: 'pointer' }}>Semantic Skill Scan</Link></li>
              <li><Link to="/roadmap" style={{ cursor: 'pointer' }}>Learning Milestone Hub</Link></li>
              <li><Link to="/sandbox" style={{ cursor: 'pointer' }}>IDE Coding Sandbox</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text)', marginBottom: '16px', letterSpacing: '0.05em' }}>Resources</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <li><Link to="/about" style={{ cursor: 'pointer' }}>Overview Docs</Link></li>
              <li><a href="#ai-systems" style={{ cursor: 'pointer' }}>FastAPI Gateway Spec</a></li>
              <li><a href="#chat-preview" style={{ cursor: 'pointer' }}>API Schema Keys</a></li>
              <li><a href="#pricing" style={{ cursor: 'pointer' }}>SaaS Subscriptions</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text)', marginBottom: '16px', letterSpacing: '0.05em' }}>Stay Ahead</h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              Subscribe to get seasonal placement strategies, prompt templates, and core platform updates.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Newsletter subscribed successfully!'); }} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="email"
                required
                placeholder="developer@domain.com"
                style={{
                  flex: 1, padding: '10px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)',
                  borderRadius: '9999px', color: '#fff', fontSize: '0.8rem', outline: 'none'
                }}
              />
              <button type="submit" className="btn-saas-gradient" style={{ padding: '10px 16px', fontSize: '0.8rem' }}>
                Join
              </button>
            </form>
          </div>

        </div>
      </footer>

    </div>
  );
}
