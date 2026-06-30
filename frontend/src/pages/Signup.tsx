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

  const handleOAuthSignup = async (_provider: 'Google' | 'GitHub') => {
    setIsFormSubmitting(true);

    try {
      await signup('Demo User', 'demo@copilot.ai', 'password123');
      navigate('/career');
    } catch {
      // Error is caught by auth provider context
    } finally {
      setIsFormSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 120px)',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--bg)',
        color: 'var(--text)'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '999px',
          background: 'rgba(56, 189, 248, 0.08)',
          filter: 'blur(120px)',
          pointerEvents: 'none'
        }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '999px',
          background: 'rgba(168, 85, 247, 0.08)',
          filter: 'blur(120px)',
          pointerEvents: 'none'
        }}
      />

      <div style={{ width: '100%', display: 'flex' }}>
        <div
          className="auth-visual-panel"
          style={{
            width: '50%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '64px',
            position: 'relative',
            zIndex: 1,
            borderRight: '1px solid var(--border)',
            background:'linear-gradient(135deg, rgba(56, 189, 248, 0.08), rgba(168, 85, 247, 0.06)), var(--surface)'
          }}
        >
          <Link
            to="/"
            aria-label="Go to home"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                display: 'grid',
                placeItems: 'center',
                color: '#fff',
                fontWeight: 900,
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                boxShadow: '0 14px 28px rgba(56, 189, 248, 0.22)'
              }}
            >
              Ω
            </div>

            <span
              style={{
                fontSize: '1.25rem',
                fontWeight: 900,
                color: 'var(--text)'
              }}
            >
              AI Career Copilot
            </span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ width: '100%', maxWidth: '460px', margin: 'auto' }}
          >
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '24px',
                padding: '28px',
                boxShadow: 'var(--shadow)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '3px',
                  background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
                  boxShadow: '0 0 10px var(--primary)'
                }}
              />

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px'
                }}
              >
                <span className="status-badge success" style={{ gap: '6px' }}>
                  <Sparkles size={12} /> Profile Builder Preview
                </span>
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '999px',
                    background: 'var(--accent)'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      color: 'var(--text-secondary)',
                      fontSize: '0.82rem',
                      marginBottom: '8px'
                    }}
                  >
                    <span>Resume Profile Completeness</span>
                    <strong style={{ color: 'var(--text)' }}>90%</strong>
                  </div>

                  <div
                    style={{
                      width: '100%',
                      height: '8px',
                      background: 'var(--surface-overlay)',
                      borderRadius: '999px',
                      overflow: 'hidden'
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '90%' }}
                      transition={{ duration: 1.2, delay: 0.5 }}
                      style={{
                        height: '100%',
                        borderRadius: '999px',
                        background: 'linear-gradient(90deg, var(--accent), var(--primary))'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      color: 'var(--text-secondary)',
                      fontSize: '0.82rem',
                      marginBottom: '8px'
                    }}
                  >
                    <span>Roadmap Readiness</span>
                    <strong style={{ color: 'var(--text)' }}>84%</strong>
                  </div>

                  <div
                    style={{
                      width: '100%',
                      height: '8px',
                      background: 'var(--surface-overlay)',
                      borderRadius: '999px',
                      overflow: 'hidden'
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '84%' }}
                      transition={{ duration: 1.2, delay: 0.7 }}
                      style={{
                        height: '100%',
                        borderRadius: '999px',
                        background: 'linear-gradient(90deg, var(--secondary), var(--primary))'
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    borderTop: '1px solid var(--border)',
                    paddingTop: '18px',
                    marginTop: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px'
                  }}
                >
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '999px',
                      display: 'grid',
                      placeItems: 'center',
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.18)'
                    }}
                  >
                    🚀
                  </div>

                  <div>
                    <h4 style={{ fontSize: '0.86rem', fontWeight: 900, color: 'var(--text)' }}>
                      Career Profile Activated
                    </h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Save job applications, roadmap progress, and resume insights in one workspace.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '32px' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text)' }}>
                Build your placement profile once.
              </h2>

              <p
                style={{
                  marginTop: '12px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.7
                }}
              >
                Create a focused student career workspace with saved jobs, AI resume analysis,
                learning milestones, and mock interview progress.
              </p>
            </div>
          </motion.div>

          <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
            Your AI placement dashboard starts here.
          </div>
        </div>

        <div
          style={{
            width: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px',
            position: 'relative',
            zIndex: 1
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            style={{ width: '100%', maxWidth: '460px' }}
          >
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '24px',
                padding: '34px',
                boxShadow: 'var(--shadow)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ marginBottom: '24px' }}>
                <span className="status-badge success">Start Free</span>

                <h1
                  style={{
                    marginTop: '14px',
                    fontSize: '1.85rem',
                    fontWeight: 900,
                    color: 'var(--text)'
                  }}
                >
                  Create Placement Profile
                </h1>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>
                  Register in seconds to construct your skill roadmap and resume scorecard.
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '12px',
                  marginBottom: '24px'
                }}
              >
                <button
                  type="button"
                  onClick={() => handleOAuthSignup('Google')}
                  disabled={isFormSubmitting}
                  className="btn-secondary btn-sm"
                >
                  <Chrome size={16} color="var(--primary)" /> Google
                </button>

                <button
                  type="button"
                  onClick={() => handleOAuthSignup('GitHub')}
                  disabled={isFormSubmitting}
                  className="btn-secondary btn-sm"
                >
                  <Github size={16} color="var(--secondary)" /> GitHub
                </button>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '24px',
                  color: 'var(--text-secondary)',
                  fontSize: '0.72rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em'
                }}
              >
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                <span>Or register credentials</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.82rem',
                      color: 'var(--text-secondary)',
                      fontWeight: 800,
                      marginBottom: '8px'
                    }}
                  >
                    Full Name
                  </label>

                  <div style={{ position: 'relative' }}>
                    <User
                      size={18}
                      style={{
                        position: 'absolute',
                        left: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-secondary)'
                      }}
                    />

                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Doe"
                      required
                      disabled={isFormSubmitting}
                      className="form-input"
                      style={{ paddingLeft: '48px' }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.82rem',
                      color: 'var(--text-secondary)',
                      fontWeight: 800,
                      marginBottom: '8px'
                    }}
                  >
                    Email Address
                  </label>

                  <div style={{ position: 'relative' }}>
                    <Mail
                      size={18}
                      style={{
                        position: 'absolute',
                        left: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-secondary)'
                      }}
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. candidate@domain.com"
                      required
                      disabled={isFormSubmitting}
                      className="form-input"
                      style={{ paddingLeft: '48px' }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.82rem',
                      color: 'var(--text-secondary)',
                      fontWeight: 800,
                      marginBottom: '8px'
                    }}
                  >
                    Password
                  </label>

                  <div style={{ position: 'relative' }}>
                    <Lock
                      size={18}
                      style={{
                        position: 'absolute',
                        left: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-secondary)'
                      }}
                    />

                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 6 characters..."
                      required
                      disabled={isFormSubmitting}
                      className="form-input"
                      style={{ paddingLeft: '48px', paddingRight: '48px' }}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isFormSubmitting}
                      style={{
                        position: 'absolute',
                        right: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {authError && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="auth-error"
                      style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                    >
                      <AlertCircle size={16} />
                      <span>{authError}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={isFormSubmitting || isAuthLoading}
                  className="btn-saas-gradient"
                  style={{
                    width: '100%',
                    minHeight: '54px',
                    borderRadius: '14px',
                    justifyContent: 'center',
                    marginTop: '4px'
                  }}
                >
                  {isFormSubmitting || isAuthLoading ? (
                    <span>Registering Profile...</span>
                  ) : (
                    <>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                      >
                        Create Free Profile
                        <ArrowRight size={18} />
                      </span>
                    </>
                  )}
                </button>
              </form>

              <div
                style={{
                  borderTop: '1px solid var(--border)',
                  marginTop: '24px',
                  paddingTop: '22px',
                  textAlign: 'center',
                  color: 'var(--text-secondary)',
                  fontSize: '0.86rem'
                }}
              >
                Already have a profile?{' '}
                <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 900 }}>
                  Sign In Workspace
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>
        {`
          @media (max-width: 1024px) {
            .auth-visual-panel {
              display: none !important;
            }

            div[style*="width: 50%"] {
              width: 100% !important;
            }
          }

          @media (max-width: 560px) {
            div[style*="padding: 48px"] {
              padding: 24px 14px !important;
            }
          }
        `}
      </style>
    </div>
  );
}