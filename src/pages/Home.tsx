import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useAuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Mic, Target, Map, Terminal, FolderCheck, CheckCircle2, 
  XCircle, Sparkles, Chrome, Github, Eye, EyeOff, AlertCircle, 
  ArrowRight, Menu, X, Star, ChevronLeft, ChevronRight, Mail, Lock, User, Zap, ShieldCheck, Compass
} from 'lucide-react';

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
        return "150,50 230,120 200,210 100,210 70,120";
      case 'frontend':
        return "150,90 240,110 180,220 120,200 60,140";
      case 'ai':
        return "150,30 210,130 220,190 80,190 90,130";
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
    <div className="min-h-screen bg-[#030712] text-slate-100 relative overflow-hidden font-sans select-none">
      
      {/* Background grids & custom radial glow gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />
      <div className="absolute top-[-100px] left-[-100px] w-[600px] h-[600px] rounded-full bg-sky-500/10 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[650px] h-[650px] rounded-full bg-purple-500/10 blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-[40%] left-[25%] w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

      {/* SECTION 2 — HERO SECTION */}
      <section className="relative z-10 max-w-[1100px] mx-auto text-center px-6 pt-24 pb-16">
        <motion.span 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest text-sky-400 bg-sky-500/10 rounded-full border border-sky-500/10 mb-6"
        >
          <Sparkles className="w-3.5 h-3.5" /> Next-Gen AI Placement Compass
        </motion.span>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.05] bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent max-w-4xl mx-auto mb-6"
        >
          Your Personal AI Career Mentor <br/>
          <span className="bg-gradient-to-r from-sky-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Powered by AI.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-10"
        >
          Build ATS-friendly resumes, crack interviews, track jobs, practice coding, and become industry-ready with AI.
        </motion.p>

        {/* CTA buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap gap-4 justify-center mb-16"
        >
          {isAuthenticated ? (
            <Link to="/career" className="bg-gradient-to-r from-sky-400 via-purple-500 to-indigo-500 hover:from-sky-500 hover:via-purple-600 hover:to-indigo-600 text-white font-bold text-sm px-8 py-4 rounded-xl shadow-lg hover:shadow-sky-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
              Go to Dashboard 🚀
            </Link>
          ) : (
            <button onClick={() => triggerAuthFromPlan('signup')} className="bg-gradient-to-r from-sky-400 via-purple-500 to-indigo-500 hover:from-sky-500 hover:via-purple-600 hover:to-indigo-600 text-white font-bold text-sm px-8 py-4 rounded-xl shadow-lg hover:shadow-sky-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
              Get Started Free
            </button>
          )}
          <button onClick={handleStartResumeScan} className="text-slate-300 hover:text-white bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 font-bold text-sm px-8 py-4 rounded-xl transition-all">
            Watch Scanner Demo 🧪
          </button>
        </motion.div>

        {/* Stats Counter Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-950/40 border border-slate-800/60 backdrop-blur-sm p-6 rounded-2xl max-w-4xl mx-auto mb-20 shadow-2xl"
        >
          <div className="p-2 border-r border-slate-800/40">
            <h4 className="text-2xl md:text-3xl font-extrabold text-sky-400">50K+</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Students Placed</p>
          </div>
          <div className="p-2 md:border-r border-slate-800/40">
            <h4 className="text-2xl md:text-3xl font-extrabold text-purple-400">10K+</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">AI Interviews</p>
          </div>
          <div className="p-2 border-r border-slate-800/40">
            <h4 className="text-2xl md:text-3xl font-extrabold text-emerald-400">95%</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">ATS Accuracy</p>
          </div>
          <div className="p-2">
            <h4 className="text-2xl md:text-3xl font-extrabold text-warning">4.9/5</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">User Rating</p>
          </div>
        </motion.div>

        {/* Hero Visual Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-full max-w-5xl mx-auto rounded-3xl border border-slate-800/80 bg-slate-950/80 p-1.5 shadow-2xl relative overflow-hidden"
        >
          <div className="bg-[#030712] rounded-2xl overflow-hidden border border-slate-900">
            
            {/* Header circles */}
            <div className="bg-[#090d16] border-b border-slate-900 py-3.5 px-6 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <div className="mx-auto bg-slate-950/60 border border-slate-850 px-8 py-1 rounded-lg text-[10px] font-mono text-slate-500">
                copilot.ai/dashboard/placement-suite
              </div>
            </div>

            {/* Split layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 text-left">
              
              {/* Left Mockup: ATS Parser scanner */}
              <div className="lg:col-span-6 bg-slate-900/30 border border-slate-800 p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between min-h-[280px]">
                {isScanning && <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_12px_#38bdf8] animate-[scan_2.5s_infinite_linear]" />}
                
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                    <span className="text-sky-400">📄</span> ATS Placement Analysis
                  </h4>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/10">
                    {selectedResumeFile ? 'Active file' : 'Ready'}
                  </span>
                </div>

                <div className="flex-1 bg-slate-950/80 border border-slate-900/50 rounded-xl p-4 font-mono text-[10px] text-slate-400 h-[150px] overflow-y-auto space-y-2">
                  {scannerLogs.map((log, idx) => (
                    <div key={idx} className={log.startsWith('✅') ? 'text-emerald-400' : log.startsWith('💡') ? 'text-warning' : ''}>
                      {log}
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <button 
                    onClick={handleStartResumeScan}
                    disabled={isScanning}
                    className="text-[10px] font-extrabold bg-sky-500 hover:bg-sky-400 text-slate-950 px-4 py-2.5 rounded-lg active:scale-95 transition-all disabled:opacity-60"
                  >
                    {isScanning ? `Extracting (${scanProgress}%)` : 'Run Scan Simulation'}
                  </button>
                  <span className="text-[10px] text-slate-500">
                    Target: <strong className="text-slate-300">{selectedResumeFile || 'No file selected'}</strong>
                  </span>
                </div>
              </div>

              {/* Right Mockup: SVG Competency Pentagon */}
              <div className="lg:col-span-6 bg-slate-900/30 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between min-h-[280px]">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs font-bold text-slate-300">📊 Role Target Competency</h4>
                  <div className="flex gap-1.5">
                    <button onClick={() => setTargetRole('backend')} className={`px-2.5 py-1 text-[9px] rounded font-bold transition-all ${targetRole === 'backend' ? 'bg-sky-500 text-slate-950' : 'bg-slate-950/60 text-slate-400'}`}>Backend</button>
                    <button onClick={() => setTargetRole('frontend')} className={`px-2.5 py-1 text-[9px] rounded font-bold transition-all ${targetRole === 'frontend' ? 'bg-sky-500 text-slate-950' : 'bg-slate-950/60 text-slate-400'}`}>Frontend</button>
                    <button onClick={() => setTargetRole('ai')} className={`px-2.5 py-1 text-[9px] rounded font-bold transition-all ${targetRole === 'ai' ? 'bg-sky-500 text-slate-950' : 'bg-slate-950/60 text-slate-400'}`}>AI/LLM</button>
                  </div>
                </div>

                <div className="flex items-center gap-6 justify-center">
                  <svg width="180" height="150" className="overflow-visible">
                    <polygon points="90,15 160,65 130,135 50,135 20,65" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                    <polygon points="90,45 135,75 115,115 65,115 45,75" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    <line x1="90" y1="80" x2="90" y2="15" stroke="rgba(255,255,255,0.08)" />
                    <line x1="90" y1="80" x2="160" y2="65" stroke="rgba(255,255,255,0.08)" />
                    <line x1="90" y1="80" x2="130" y2="135" stroke="rgba(255,255,255,0.08)" />
                    <line x1="90" y1="80" x2="50" y2="135" stroke="rgba(255,255,255,0.08)" />
                    <line x1="90" y1="80" x2="20" y2="65" stroke="rgba(255,255,255,0.08)" />

                    {/* Pentagon coordinate points */}
                    <polygon 
                      points={getRadarPoints()} 
                      fill="rgba(56, 189, 248, 0.25)" 
                      stroke="var(--primary)" 
                      strokeWidth="1.5" 
                      style={{ transition: 'all 0.4s ease' }} 
                    />
                  </svg>

                  <div className="flex-1 space-y-4 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Focus Track:</span>
                      <strong className="text-sky-400 capitalize">{targetRole} Development</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Placement Match:</span>
                      <strong className="text-white text-sm">{targetRole === 'backend' ? '86% (Strong)' : targetRole === 'frontend' ? '91% (Ready)' : '78% (Growing)'}</strong>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </section>

      {/* SECTION 3 — FEATURES SECTION */}
      <section id="features" className="relative z-10 max-w-[1200px] mx-auto px-6 py-24 border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 rounded-full border border-emerald-500/10 uppercase tracking-widest">
            Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-4">
            Engineered to Close Every Skill Gap
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            Consolidate your entire job preparation funnel under a single automated, intelligence-driven, and highly-refined SaaS workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Card 1: Resume Analyzer */}
          <motion.article 
            whileHover={{ y: -6 }}
            className="bg-slate-900/30 border border-slate-800/80 p-8 rounded-2xl text-left flex flex-col justify-between hover:border-sky-500/30 hover:shadow-glow transition-all"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-xl">
                📄
              </div>
              <h3 className="text-lg font-bold text-white">AI Resume Analyzer</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Scan layouts, identify keyword densities, and optimize phrasing structures against real recruiting filters.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-800/40 flex justify-between items-center text-[10px] font-semibold text-sky-400">
              <span>Google X-Y-Z Optimizer</span>
              <span>Verified ➔</span>
            </div>
          </motion.article>

          {/* Card 2: Interview Room */}
          <motion.article 
            whileHover={{ y: -6 }}
            className="bg-slate-900/30 border border-slate-800/80 p-8 rounded-2xl text-left flex flex-col justify-between hover:border-purple-500/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.12)] transition-all"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-xl">
                🎤
              </div>
              <h3 className="text-lg font-bold text-white">AI Interview Simulator</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Simulate vocal audio mock interviews. Receive transcripts, pronunciation fluency, and STAR structure evaluations.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-800/40 flex justify-between items-center text-[10px] font-semibold text-purple-400">
              <span>WebSpeech Transcripts</span>
              <span>Verified ➔</span>
            </div>
          </motion.article>

          {/* Card 3: Skill Gap */}
          <motion.article 
            whileHover={{ y: -6 }}
            className="bg-slate-900/30 border border-slate-800/80 p-8 rounded-2xl text-left flex flex-col justify-between hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.12)] transition-all"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-xl">
                🎯
              </div>
              <h3 className="text-lg font-bold text-white">Skill Gap Detector</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Scans job summaries to isolate lacking technical skills, generating immediate lists of milestones to study.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-800/40 flex justify-between items-center text-[10px] font-semibold text-cyan-400">
              <span>Vector Semantic Router</span>
              <span>Verified ➔</span>
            </div>
          </motion.article>

          {/* Card 4: Roadmap */}
          <motion.article 
            whileHover={{ y: -6 }}
            className="bg-slate-900/30 border border-slate-800/80 p-8 rounded-2xl text-left flex flex-col justify-between hover:border-warning/30 hover:shadow-[0_0_30px_rgba(245,158,11,0.12)] transition-all"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl">
                📚
              </div>
              <h3 className="text-lg font-bold text-white">AI Roadmap Generator</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generate tailored study syllabi packed with summaries, lecture sheets, and interactive multiple-choice quizzes.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-800/40 flex justify-between items-center text-[10px] font-semibold text-warning">
              <span>Interactive Timelines</span>
              <span>Verified ➔</span>
            </div>
          </motion.article>

          {/* Card 5: Sandbox */}
          <motion.article 
            whileHover={{ y: -6 }}
            className="bg-slate-900/30 border border-slate-800/80 p-8 rounded-2xl text-left flex flex-col justify-between hover:border-sky-500/30 hover:shadow-glow transition-all"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-xl">
                💻
              </div>
              <h3 className="text-lg font-bold text-white">Coding Practice Platform</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Resolve challenges inside a double-pane editor that compiles scripts locally and audits lexical complexity.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-800/40 flex justify-between items-center text-[10px] font-semibold text-sky-400">
              <span>Big-O Lexical Audits</span>
              <span>Verified ➔</span>
            </div>
          </motion.article>

          {/* Card 6: Kanban Tracker */}
          <motion.article 
            whileHover={{ y: -6 }}
            className="bg-slate-900/30 border border-slate-800/80 p-8 rounded-2xl text-left flex flex-col justify-between hover:border-emerald-500/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.12)] transition-all"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xl">
                💼
              </div>
              <h3 className="text-lg font-bold text-white">Smart Job Dashboard</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Organize schedules across columns and unpack custom, automated strategy logs optimized for target employers.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-800/40 flex justify-between items-center text-[10px] font-semibold text-emerald-400">
              <span>Employer Strategies</span>
              <span>Verified ➔</span>
            </div>
          </motion.article>

        </div>
      </section>

      {/* SECTION 4 — WHY CHOOSE US */}
      <section className="relative z-10 max-w-[1100px] mx-auto px-6 py-24 border-t border-slate-900">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold text-sky-400 bg-sky-500/10 rounded-full border border-sky-500/10 uppercase tracking-widest">
            The Advantage
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-4">Why AI Career Copilot?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div className="bg-slate-950/60 border border-slate-850 p-8 rounded-2xl shadow-xl space-y-6">
            <h3 className="text-lg font-extrabold text-slate-400 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500/80" /> Traditional Career Prep
            </h3>
            <ul className="space-y-4 text-xs text-slate-400">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-650 mt-1.5 flex-shrink-0" />
                <span>Static, uncustomized resume templates rejected by modern ATS parsers.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-650 mt-1.5 flex-shrink-0" />
                <span>Anxiety-inducing mock loops that give only general, delayed visual feedback.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-650 mt-1.5 flex-shrink-0" />
                <span>Juggling dozens of paid subscriptions for quizzes, editors, and job logs.</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-slate-900/50 to-slate-950/50 border border-sky-500/20 p-8 rounded-2xl shadow-glow relative overflow-hidden space-y-6">
            <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-2xl pointer-events-none" />
            <h3 className="text-lg font-extrabold text-sky-400 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Integrated AI Ecosystem
            </h3>
            <ul className="space-y-4 text-xs text-slate-200">
              <li className="flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                <span>Dynamic real-time optimization checks utilizing results-focused formats.</span>
              </li>
              <li className="flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                <span>Simulated interview voice bots scoring transcripts, metrics, and gaps.</span>
              </li>
              <li className="flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                <span>Syllabus generators, algorithm playgrounds, and pipelines under one suite.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 5 — DASHBOARD PREVIEW */}
      <section id="ai-systems" className="relative z-10 max-w-[1100px] mx-auto px-6 py-24 border-t border-slate-900">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold text-purple-400 bg-purple-500/10 rounded-full border border-purple-500/10 uppercase tracking-widest">
            Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-4">Next-Gen RAG System Flow</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Grid: SVG Connections mapping */}
          <div className="lg:col-span-7 flex justify-center items-center overflow-visible h-[350px]">
            <div className="relative w-[540px] h-[350px] flex-shrink-0">
              <svg width="100%" height="100%" className="absolute top-0 left-0 overflow-visible z-10">
                <path d="M 50,175 Q 120,75 220,75" fill="none" stroke="rgba(168, 85, 247, 0.25)" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M 50,175 Q 120,275 220,275" fill="none" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M 220,75 H 420" fill="none" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="2" />
                <path d="M 220,275 H 420" fill="none" stroke="rgba(168, 85, 247, 0.2)" strokeWidth="2" />
                <path d="M 420,75 Q 490,175 420,275" fill="none" stroke="rgba(16, 185, 129, 0.25)" strokeWidth="2" strokeDasharray="4 4" />

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

              {/* Server Nodes */}
              <div className="absolute top-[140px] left-[15px] z-20">
                <button onClick={() => setSelectedSystemNode('voice')} className={`w-[70px] h-[70px] rounded-full font-extrabold text-[10px] shadow-lg flex items-center justify-center transition-all ${selectedSystemNode === 'voice' ? 'bg-gradient-to-r from-sky-400 to-purple-500 text-slate-950 shadow-sky-500/20 scale-105' : 'bg-slate-900 border border-slate-800 text-slate-200'}`}>🎤 Voice</button>
              </div>
              <div className="absolute top-[54px] left-[220px] -translate-x-1/2 z-20">
                <button onClick={() => setSelectedSystemNode('rag')} className={`px-5 py-3 rounded-full font-bold text-[10px] shadow-lg flex items-center justify-center transition-all ${selectedSystemNode === 'rag' ? 'bg-gradient-to-r from-sky-400 to-purple-500 text-slate-950 shadow-sky-500/20 scale-105' : 'bg-slate-900 border border-slate-800 text-slate-200'}`}>🛰️ RAG Coordinator</button>
              </div>
              <div className="absolute bottom-[54px] left-[220px] -translate-x-1/2 z-20">
                <button onClick={() => setSelectedSystemNode('pinecone')} className={`px-5 py-3 rounded-full font-bold text-[10px] shadow-lg flex items-center justify-center transition-all ${selectedSystemNode === 'pinecone' ? 'bg-gradient-to-r from-sky-400 to-purple-500 text-slate-950 shadow-purple-500/20 scale-105' : 'bg-slate-900 border border-slate-800 text-slate-200'}`}>💾 Pinecone DB</button>
              </div>
              <div className="absolute top-[35px] left-[420px] -translate-x-1/2 z-20">
                <button onClick={() => setSelectedSystemNode('llm')} className={`w-[80px] h-[80px] rounded-full font-extrabold text-[10px] shadow-lg flex items-center justify-center transition-all ${selectedSystemNode === 'llm' ? 'bg-gradient-to-r from-sky-400 to-purple-500 text-slate-950 shadow-sky-500/20 scale-105' : 'bg-slate-900 border border-slate-800 text-slate-200'}`}>🧠 LLM Core</button>
              </div>
              <div className="absolute bottom-[54px] left-[420px] -translate-x-1/2 z-20">
                <button onClick={() => setSelectedSystemNode('stripe')} className={`px-5 py-3 rounded-full font-bold text-[10px] shadow-lg flex items-center justify-center transition-all ${selectedSystemNode === 'stripe' ? 'bg-gradient-to-r from-sky-400 to-purple-500 text-slate-950 shadow-purple-500/20 scale-105' : 'bg-slate-900 border border-slate-800 text-slate-200'}`}>💳 Stripe JWT</button>
              </div>
            </div>
          </div>

          {/* Right Grid: Node explanation panel */}
          <div className="lg:col-span-5 text-left">
            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-8 rounded-2xl shadow-2xl min-h-[260px] flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10 uppercase tracking-widest mb-3 inline-block">
                  {getSystemNodeDescription().tech}
                </span>
                <h3 className="text-xl font-extrabold text-white mb-2">
                  {getSystemNodeDescription().title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {getSystemNodeDescription().desc}
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-sky-400 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                System Integration online
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 6 — TESTIMONIALS & AI MENTOR PREVIEW */}
      <section id="chat-preview" className="relative z-10 max-w-[1100px] mx-auto px-6 py-24 border-t border-slate-900">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold text-sky-400 bg-sky-500/10 rounded-full border border-sky-500/10 uppercase tracking-widest">
            Live Chat
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-4">Consult the AI Copilot</h2>
        </div>

        {/* Live typing previews */}
        <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-3xl shadow-glow text-left flex flex-col justify-between max-w-3xl mx-auto h-[480px]">
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-[10px] text-slate-500 self-center">Presets:</span>
            {chatPresets.map((preset, idx) => (
              <button 
                key={idx} 
                onClick={() => handleChatPresetClick(idx)}
                disabled={isTyping}
                className="text-[9px] font-bold text-sky-400 bg-sky-500/5 border border-sky-500/20 hover:bg-sky-500/10 px-3 py-1.5 rounded-full transition-all disabled:opacity-50"
              >
                {preset.prompt}
              </button>
            ))}
          </div>

          <div className="flex-1 bg-slate-950/80 border border-slate-900 rounded-2xl p-6 overflow-y-auto space-y-4 mb-4">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-xs leading-normal ${msg.sender === 'user' ? 'bg-sky-500 text-slate-950 font-bold rounded-tr-none' : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'}`}>
                  {msg.text || (isTyping && idx === chatMessages.length - 1 ? 'Streaming evaluation...' : '')}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleCustomChatSubmit} className="flex gap-2">
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask anything about coding sandbox algorithms, templates..."
              className="flex-1 bg-slate-950/60 border border-slate-850 rounded-xl px-5 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
            />
            <button type="submit" disabled={isTyping || !chatInput.trim()} className="bg-sky-500 text-slate-950 font-bold text-xs px-6 py-3 rounded-xl hover:bg-sky-400 transition-all active:scale-95 disabled:opacity-50">
              Send ➔
            </button>
          </form>

        </div>

        {/* Testimonials Slider */}
        <div id="testimonials" className="mt-28">
          <div className="flex items-center justify-between max-w-xl mx-auto mb-10">
            <button onClick={handlePrevTestimonial} className="w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-600 transition-all">←</button>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Student Success</span>
            <button onClick={handleNextTestimonial} className="w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-600 transition-all">→</button>
          </div>

          <div className="bg-slate-900/30 border border-slate-800 p-8 rounded-2xl max-w-2xl mx-auto text-left shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-sky-400 to-purple-500 flex items-center justify-center font-bold text-white shadow-lg">
                  {testimonials[activeTestimonial].avatar}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{testimonials[activeTestimonial].name}</h4>
                  <p className="text-[10px] text-slate-500">{testimonials[activeTestimonial].role} at <strong className="text-sky-400">{testimonials[activeTestimonial].company}</strong></p>
                </div>
              </div>
              <div className="flex gap-0.5 text-warning">
                {Array.from({ length: testimonials[activeTestimonial].rating }).map((_, idx) => <Star key={idx} className="w-3.5 h-3.5 fill-current" />)}
              </div>
            </div>
            <p className="italic text-slate-300 text-sm leading-relaxed">&ldquo;{testimonials[activeTestimonial].quote}&rdquo;</p>
          </div>
        </div>
      </section>

      {/* SECTION 7 — PRICING SECTION */}
      <section id="pricing" className="relative z-10 max-w-[1100px] mx-auto px-6 py-24 border-t border-slate-900">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold text-purple-400 bg-purple-500/10 rounded-full border border-purple-500/10 uppercase tracking-widest">
            SaaS pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-4">Simple, Predictable Tiers</h2>
          
          <div className="flex items-center justify-center gap-3 mt-6">
            <span className={`text-xs font-semibold ${billingInterval === 'monthly' ? 'text-white' : 'text-slate-500'}`}>Monthly</span>
            <button 
              onClick={() => setBillingInterval(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
              className="w-12 h-6 bg-slate-900 rounded-full border border-slate-800 p-0.5 relative transition-all"
            >
              <div className={`w-4 h-4 rounded-full bg-gradient-to-r from-sky-400 to-purple-500 absolute top-0.5 transition-all ${billingInterval === 'monthly' ? 'left-0.5' : 'left-6.5'}`} />
            </button>
            <span className={`text-xs font-semibold ${billingInterval === 'yearly' ? 'text-white' : 'text-slate-500'} flex items-center gap-1.5`}>
              Yearly <strong className="text-[9px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10 uppercase">Save 20%</strong>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card Free */}
          <div className="bg-slate-900/30 border border-slate-800/80 p-8 rounded-2xl text-left flex flex-col justify-between min-h-[460px] hover:border-slate-700/80 transition-all">
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Free Starter</h3>
              <p className="text-xs text-slate-500 min-h-[32px]">Scoring audits for entry candidates.</p>
              <div className="text-3xl font-extrabold text-white my-6">$0</div>
              <ul className="space-y-3.5 text-xs text-slate-400 border-t border-slate-800/60 pt-6">
                <li className="flex items-center gap-2">✓ Basic ATS score parsing</li>
                <li className="flex items-center gap-2">✓ 3 mock voice evaluations</li>
                <li className="flex items-center gap-2">✓ 1 custom syllabus roadmap</li>
                <li className="flex items-center gap-2">✓ Algorithm playground sandbox</li>
              </ul>
            </div>
            <button onClick={() => triggerAuthFromPlan('signup')} className="w-full text-xs font-bold bg-slate-950 border border-slate-800 text-slate-300 py-3 rounded-xl mt-8 hover:bg-slate-900 transition-colors">Start Free Account</button>
          </div>

          {/* Card Pro copilot */}
          <div className="bg-gradient-to-b from-[#111124] to-[#040713] border border-purple-500/30 p-8 rounded-2xl text-left flex flex-col justify-between min-h-[460px] shadow-glow relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-purple-500 text-white font-extrabold text-[8px] uppercase tracking-wider px-4 py-1.5 rounded-bl-xl">POPULAR</div>
            <div>
              <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-2">Professional Pro</h3>
              <p className="text-xs text-slate-400 min-h-[32px]">Full-scale prep dashboard with dynamic evaluations.</p>
              <div className="text-3xl font-extrabold text-white my-6">
                {billingInterval === 'monthly' ? '$19' : '$15'}
                <span className="text-xs font-semibold text-slate-500"> / month</span>
              </div>
              <ul className="space-y-3.5 text-xs text-slate-200 border-t border-slate-800/60 pt-6">
                <li className="flex items-center gap-2">✓ **Unlimited** resume score optimization</li>
                <li className="flex items-center gap-2">✓ **Unlimited** speech mock interviews</li>
                <li className="flex items-center gap-2">✓ Vector semantic skill-gap audits</li>
                <li className="flex items-center gap-2">✓ Sandbox lexical complexity logs</li>
              </ul>
            </div>
            <button onClick={() => triggerAuthFromPlan('signup')} className="w-full text-xs font-bold bg-gradient-to-r from-sky-400 to-purple-500 text-white py-3 rounded-xl mt-8 shadow-lg hover:scale-[1.01] transition-all">Start 7-Day Trial</button>
          </div>

          {/* Card Ultimate AI */}
          <div className="bg-slate-900/30 border border-slate-800/80 p-8 rounded-2xl text-left flex flex-col justify-between min-h-[460px] hover:border-slate-700/80 transition-all">
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Ultimate AI</h3>
              <p className="text-xs text-slate-500 min-h-[32px]">For university cohort groups and placement heads.</p>
              <div className="text-3xl font-extrabold text-white my-6">Custom</div>
              <ul className="space-y-3.5 text-xs text-slate-400 border-t border-slate-800/60 pt-6">
                <li className="flex items-center gap-2">✓ Shared cohort dashboards</li>
                <li className="flex items-center gap-2">✓ Custom API developer tokens</li>
                <li className="flex items-center gap-2">✓ Personalized university templates</li>
                <li className="flex items-center gap-2">✓ Dedicated account manager</li>
              </ul>
            </div>
            <a href="mailto:partners@copilot.ai" className="w-full text-center text-xs font-bold bg-slate-950 border border-slate-800 text-slate-300 py-3 rounded-xl mt-8 hover:bg-slate-900 transition-colors">Contact Partnerships</a>
          </div>

        </div>
      </section>

      {/* SECTION 8 — CTA SECTION */}
      <section className="relative z-10 max-w-[1100px] mx-auto px-6 py-20 text-center">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80 p-12 rounded-3xl shadow-glow relative overflow-hidden max-w-4xl mx-auto">
          <div className="absolute top-[-20%] left-[-20%] w-[350px] h-[350px] rounded-full bg-sky-500/5 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-[-20%] right-[-20%] w-[350px] h-[350px] rounded-full bg-purple-500/5 blur-[100px] pointer-events-none" />
          
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent mb-4">
            Start Building Your AI Career Today
          </h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto mb-8">
            Deploy your targets, score resumes dynamically, and evaluate vocal speech loops inside our integrated workspace.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            {isAuthenticated ? (
              <Link to="/career" className="bg-gradient-to-r from-sky-400 to-purple-500 text-slate-950 font-extrabold text-xs px-8 py-3.5 rounded-xl hover:scale-102 transition-all">
                Enter Placement Hub 🚀
              </Link>
            ) : (
              <button onClick={() => triggerAuthFromPlan('signup')} className="bg-gradient-to-r from-sky-400 to-purple-500 text-white font-extrabold text-xs px-8 py-3.5 rounded-xl hover:scale-102 transition-all shadow-lg shadow-sky-500/10">
                Create Free Profile
              </button>
            )}
            <a href="#features" className="text-slate-300 hover:text-white bg-slate-900 border border-slate-800 font-extrabold text-xs px-8 py-3.5 rounded-xl transition-colors">
              Explore Core Capabilities
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 9 — FOOTER */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950/80 py-16 px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-400 to-purple-500 flex items-center justify-center font-bold text-white">
                Ω
              </div>
              <strong className="font-extrabold text-base tracking-tight text-white">AI Career Copilot</strong>
            </div>
            <p className="text-xs text-slate-500 leading-normal">
              World-class automated placement suite guiding software engineering and product seekers directly into tech roles.
            </p>
            <div className="text-[10px] text-slate-600">
              © 2026 AI Career Copilot Inc. <br/>All vectors secure.
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-white mb-4">Features</h4>
            <ul className="space-y-3 text-xs text-slate-500">
              <li><Link to="/resume" className="hover:text-white transition-colors">Resume Optimizer</Link></li>
              <li><Link to="/interview" className="hover:text-white transition-colors">Mock Voice Room</Link></li>
              <li><Link to="/career" className="hover:text-white transition-colors">Dashboard Pipeline</Link></li>
              <li><Link to="/roadmap" className="hover:text-white transition-colors">Syllabus Milestones</Link></li>
            </ul>
          </div>

          {/* Docs & systems */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-white mb-4">Resources</h4>
            <ul className="space-y-3 text-xs text-slate-500">
              <li><Link to="/about" className="hover:text-white transition-colors">Overview Docs</Link></li>
              <li><a href="#ai-systems" className="hover:text-white transition-colors">RAG coordinate Spec</a></li>
              <li><a href="#chat-preview" className="hover:text-white transition-colors">API Schema Keys</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">SaaS Subscriptions</a></li>
            </ul>
          </div>

          {/* Newsletter signup */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-white mb-4">Newsletter</h4>
            <p className="text-xs text-slate-500 leading-normal">Stay up to date with seasonal placement updates, prompt templates, and updates.</p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed successfully!'); }} className="flex gap-2">
              <input 
                type="email" 
                required 
                placeholder="developer@domain.com"
                className="bg-slate-900 border border-slate-800 text-xs px-4 py-2 rounded-lg text-white w-full placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
              <button type="submit" className="bg-sky-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-lg hover:bg-sky-400 transition-colors">Join</button>
            </form>
          </div>

        </div>
      </footer>

      {/* AUTH MODAL INTERFACE */}
      {authModal && (
        <div className="modal-overlay" onClick={() => setAuthModal(null)}>
          <div className="modal-content text-center" onClick={(e) => e.stopPropagation()}>
            
            <button className="modal-close" onClick={() => setAuthModal(null)} aria-label="Close auth dialog">
              ✕
            </button>

            <h2 className="text-2xl font-black text-white mb-2">
              {authModal === 'login' ? 'Welcome Back!' : 'Create Account'}
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Access your personalized career dashboard.
            </p>

            <div className="flex gap-2 mb-6 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
              <button onClick={() => setAuthTab('google')} className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${authTab === 'google' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>Google Auth</button>
              <button onClick={() => setAuthTab('github')} className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${authTab === 'github' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>GitHub Auth</button>
              <button onClick={() => setAuthTab('email')} className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${authTab === 'email' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>Credentials</button>
            </div>

            {(authTab === 'google' || authTab === 'github') && (
              <div className="py-8 space-y-4">
                <button 
                  onClick={async () => {
                    try {
                      await login('demo@copilot.ai', 'password123');
                      setAuthModal(null);
                      navigate('/career');
                    } catch {
                      setLocalAuthError('Fast oauth connection issue.');
                    }
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-sky-400 via-purple-500 to-indigo-500 hover:from-sky-500 hover:via-purple-600 hover:to-indigo-600 text-white font-bold rounded-xl shadow-lg transition-all"
                >
                  Simulate {authTab === 'google' ? 'Google' : 'GitHub'} Fast Signin 🚀
                </button>
                <p className="text-[10px] text-slate-500 leading-normal">
                  Click to bypass standard forms and load placement simulation instantly.
                </p>
              </div>
            )}

            {authTab === 'email' && (
              <form onSubmit={handleAuthSubmit} className="space-y-4 text-left">
                {authModal === 'signup' && (
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={authForm.name}
                      onChange={(e) => setAuthForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. John Doe"
                      className="w-full bg-slate-950 border border-slate-800 py-2.5 px-4 text-xs rounded-lg text-white"
                    />
                  </div>
                )}
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    value={authForm.email}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="e.g. candidate@domain.com"
                    className="w-full bg-slate-950 border border-slate-800 py-2.5 px-4 text-xs rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Password</label>
                  <input 
                    type="password" 
                    required 
                    value={authForm.password}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Minimum 6 characters..."
                    className="w-full bg-slate-950 border border-slate-800 py-2.5 px-4 text-xs rounded-lg text-white"
                  />
                </div>

                {localAuthError && <div className="text-xs font-semibold text-red-400">⚠️ {localAuthError}</div>}

                <button type="submit" disabled={isAuthLoading} className="w-full py-3.5 bg-gradient-to-r from-sky-400 to-purple-500 text-white font-extrabold text-xs rounded-xl shadow-lg mt-2">
                  {isAuthLoading ? 'Connecting auth session...' : authModal === 'login' ? 'Sign In Workspace' : 'Register Secure Profile'}
                </button>
              </form>
            )}

            <div className="border-t border-slate-800/60 mt-6 pt-4 text-xs text-slate-400">
              {authModal === 'login' ? (
                <span>New candidate? <button onClick={() => triggerAuthFromPlan('signup')} className="text-sky-400 font-bold">Register profile</button></span>
              ) : (
                <span>Already registered? <button onClick={() => triggerAuthFromPlan('login')} className="text-sky-400 font-bold">Sign in</button></span>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
