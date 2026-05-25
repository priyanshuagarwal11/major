import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Github, Chrome, Sparkles, AlertCircle } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  const { signup, isAuthLoading, authError } = useAuthContext();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormSubmitting(true);

    try {
      await signup(name, email, password);
      navigate('/career');
    } catch {
      // Error is caught by auth provider context
    } finally {
      setIsFormSubmitting(false);
    }
  };

  const handleOAuthSignup = async (provider: 'Google' | 'GitHub') => {
    setIsFormSubmitting(true);
    try {
      // Simulate fast authorization
      await signup('Demo User', 'demo@copilot.ai', 'password123');
      navigate('/career');
    } catch {
      // Handled
    } finally {
      setIsFormSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex relative overflow-hidden font-sans">
      
      {/* Background glowing orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-sky-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[30%] w-[300px] h-[300px] rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />

      {/* Split-screen Layout */}
      <div className="w-full flex">
        
        {/* Left Side: Illustration, Mockups, and Quotes */}
        <div className="hidden lg:flex lg:w-1/2 bg-slate-950/40 border-r border-slate-900/60 p-16 flex-col justify-between relative z-10">
          
          {/* Logo brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-400 to-purple-500 flex items-center justify-center font-bold text-white shadow-lg shadow-sky-500/20">
              Ω
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              AI Career Copilot
            </span>
          </div>

          {/* Miniature Interactive Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="my-auto max-w-md mx-auto w-full"
          >
            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-glow relative overflow-hidden">
              {/* Scan beam sweep visual */}
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_10px_#38bdf8] animate-[scan_3s_infinite_linear]" />
              
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] uppercase font-bold tracking-widest text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/10 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" /> Live Scoring Simulation
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                    <span>ATS Formatting Score</span>
                    <span className="text-white font-semibold">92%</span>
                  </div>
                  <div className="w-full bg-slate-950/80 h-2 rounded-full overflow-hidden border border-slate-800/40">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "92%" }}
                      transition={{ duration: 1.2, delay: 0.5 }}
                      className="bg-gradient-to-r from-sky-400 to-sky-500 h-full rounded-full" 
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                    <span>Technical Skill Density</span>
                    <span className="text-white font-semibold">86%</span>
                  </div>
                  <div className="w-full bg-slate-950/80 h-2 rounded-full overflow-hidden border border-slate-800/40">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "86%" }}
                      transition={{ duration: 1.2, delay: 0.7 }}
                      className="bg-gradient-to-r from-purple-400 to-purple-500 h-full rounded-full" 
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/60 mt-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-sky-400/20 to-purple-500/20 border border-sky-500/20 flex items-center justify-center text-lg">
                    🧠
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-white">AI Real-time Feedback</h4>
                    <p className="text-[11px] text-slate-400 leading-normal mt-0.5">
                      "ATS score optimized. Recommend adding 2 bullet points on distributed caching system design."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Motivational message */}
            <div className="text-left mt-8">
              <h2 className="text-2xl font-bold tracking-tight text-white mb-3">
                Accelerate your placement prep with AI.
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Connect your resumes, mock vocal interviews, sandbox compilers, and job application Kanban boards under a single unified dashboard designed for candidate placement.
              </p>
            </div>
          </motion.div>

          {/* Footer credentials */}
          <div className="text-xs text-slate-500">
            Powered by Next-Gen RAG & Agent Coordination Services.
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10 bg-slate-950/15">
          
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            {/* Logo brand visible on mobile */}
            <div className="flex items-center gap-2 mb-8 lg:hidden justify-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-400 to-purple-500 flex items-center justify-center font-bold text-white">
                Ω
              </div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                AI Career Copilot
              </span>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
              
              {/* Header Title */}
              <div className="mb-6">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 rounded-full border border-emerald-500/10 uppercase tracking-widest">
                  Start Free
                </span>
                <h1 className="text-2xl font-bold tracking-tight text-white mt-3">
                  Create Placement Profile
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Register in seconds to construct your skill roadmap and resume scorecard.
                </p>
              </div>

              {/* Social login buttons */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => handleOAuthSignup('Google')}
                  disabled={isFormSubmitting}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-950/60 border border-slate-800/60 rounded-xl hover:border-slate-700/80 hover:bg-slate-900/60 text-xs font-semibold text-slate-200 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  <Chrome className="w-4 h-4 text-sky-400" /> Google
                </button>
                <button
                  type="button"
                  onClick={() => handleOAuthSignup('GitHub')}
                  disabled={isFormSubmitting}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-950/60 border border-slate-800/60 rounded-xl hover:border-slate-700/80 hover:bg-slate-900/60 text-xs font-semibold text-slate-200 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  <Github className="w-4 h-4 text-purple-400" /> GitHub
                </button>
              </div>

              <div className="relative mb-6 flex py-1 items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800/60"></div>
                </div>
                <span className="relative px-3 bg-[#0c1322] text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Or register credentials
                </span>
              </div>

              {/* Credentials form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Full Name */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-slate-400">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Doe"
                      required
                      disabled={isFormSubmitting}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-slate-400">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. candidate@domain.com"
                      required
                      disabled={isFormSubmitting}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-slate-400">Encrypted Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 6 characters..."
                      required
                      disabled={isFormSubmitting}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-12 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isFormSubmitting}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Local or Context Auth Errors */}
                <AnimatePresence mode="wait">
                  {authError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 px-4 rounded-xl flex items-center gap-2.5 text-left"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{authError}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Action CTA Button */}
                <button
                  type="submit"
                  disabled={isFormSubmitting || isAuthLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-sky-400 via-purple-500 to-indigo-500 hover:from-sky-500 hover:via-purple-600 hover:to-indigo-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-sky-500/20 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
                >
                  {isFormSubmitting || isAuthLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Registering Profile...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span>Create Free Profile</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </button>

              </form>

              {/* Redirect switch links */}
              <div className="border-t border-slate-800/60 mt-6 pt-6 text-center text-xs text-slate-400">
                Already have a profile?{" "}
                <Link to="/login" className="text-sky-400 hover:text-sky-300 font-bold transition-colors">
                  Sign In Workspace
                </Link>
              </div>

            </div>

          </motion.div>

        </div>

      </div>

    </div>
  );
}