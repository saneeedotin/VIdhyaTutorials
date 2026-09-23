import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Shield, Loader2, ArrowLeft, Eye, EyeOff, X, Lock, KeyRound, ShieldCheck, CheckCircle2, AlertTriangle, Mail } from 'lucide-react';
import { apiClient } from '../../api/apiClient';
import { useAuth } from '../../context/AuthContext';

/* ─── Zod schema ─── */
const loginSchema = z.object({
  userId:   z.string().min(2, 'Admin ID or Email is required'),
  password: z.string().min(3, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

/* ─── Taglines ─── */
const taglines = [
  "ADMINISTRATIVE CONTROL & CAMPUS MANAGEMENT",
  "POWERING INSTITUTIONAL EXCELLENCE",
  "SECURE ACCESS FOR AUTHORIZED STAFF ONLY"
];

/* ─── Minimal Premium Input ─── */
const PremiumInput = ({ label, error, isPassword, register, ...props }: any) => {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col space-y-1.5">
      <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant font-mono">{label}</label>
      <div className="relative">
        <input
          {...register}
          type={isPassword ? (show ? 'text' : 'password') : 'text'}
          className={`w-full bg-surface-container-high border ${error ? 'border-error ring-1 ring-error/20' : 'border-outline-variant/60 focus:border-primary focus:ring-1 focus:ring-primary/20'} rounded-xl px-4 py-3 text-sm text-on-surface outline-none transition-all placeholder:text-outline/60`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors cursor-pointer"
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <span className="text-[11px] font-medium text-error mt-0.5">{error}</span>}
    </div>
  );
};

/* ─── Component ─── */
export function LoginRegisterPage() {
  const navigate = useNavigate();
  const { login: authLogin, isAuthenticated, user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [taglineIdx, setTaglineIdx] = useState(0);

  // Forgot Password / Email Link State
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('vidhyatutorials22@gmail.com');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // Rotate taglines
  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIdx(prev => (prev + 1) % taglines.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Login form — completely blank by default (NO AUTO-FILL)
  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { userId: '', password: '' },
  });

  const AUTHORIZED_ADMIN_EMAIL = 'vidhyatutorials22@gmail.com';

  const handleLogin = async (data: LoginForm) => {
    setError('');
    setLoading(true);

    // Frontend gate: only allow the authorized admin credentials
    const inputLower = data.userId.trim().toLowerCase();
    const inputUpper = data.userId.trim().toUpperCase();
    const isEmail = inputLower.includes('@');
    if (isEmail && inputLower !== AUTHORIZED_ADMIN_EMAIL) {
      setError(`Access denied. Only ${AUTHORIZED_ADMIN_EMAIL} can log in as Admin.`);
      setLoading(false);
      return;
    }
    if (!isEmail && inputUpper !== 'ADM-1234') {
      setError('Access denied. Only the authorized Admin ID can log in here.');
      setLoading(false);
      return;
    }

    try {
      const res = await apiClient.post('/api/auth/login', { 
        userId: data.userId, 
        password: data.password, 
        role: 'ADMIN' 
      });
      authLogin(res.data.accessToken, res.data.user);
      navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      if (!err.response) {
        setError('Cannot connect to the server. Please ensure the backend server is running.');
      } else {
        setError(err.response?.data?.error || 'Invalid admin credentials. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRequestResetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');

    const emailClean = resetEmail.trim().toLowerCase();
    if (!emailClean || !emailClean.includes('@')) {
      setResetError('Please enter a valid registered email address.');
      return;
    }

    if (emailClean !== AUTHORIZED_ADMIN_EMAIL) {
      setResetError(`Access Denied! Password reset is restricted to the authorized administrative email (${AUTHORIZED_ADMIN_EMAIL}) only.`);
      return;
    }

    setResetLoading(true);
    try {
      const res = await apiClient.post('/api/auth/forgot-password', { email: emailClean });
      setResetSuccess(res.data?.message || 'Password reset link has been dispatched to your email! Please check your inbox.');
    } catch (err: any) {
      setResetError(err.response?.data?.error || 'Failed to send password reset email. Please ensure the backend server is running.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background flex items-center justify-center p-4 md:p-12 font-body-md relative overflow-hidden">
      
      {/* Decorative Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" style={{ background: 'radial-gradient(circle, rgba(31,64,109,0.08) 0%, rgba(31,64,109,0) 70%)' }}></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none translate-y-1/3 -translate-x-1/3" style={{ background: 'radial-gradient(circle, rgba(48,96,154,0.08) 0%, rgba(48,96,154,0) 70%)' }}></div>

      <div className="w-full max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-6 sm:gap-10 lg:gap-24 relative z-10 items-center">
        
        {/* ═══════ LEFT PANEL ═══════ */}
        <div className="lg:w-1/2 flex flex-col z-10 text-center lg:text-left pt-2 lg:pt-0 w-full">
          
          <div className="flex items-center gap-4 sm:gap-6 mb-5 sm:mb-8 mx-auto lg:mx-0 w-fit">
            <Link to="/" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary bg-surface border border-outline-variant/30 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full font-bold tracking-widest uppercase text-xs transition-colors min-h-[38px]">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/vidhya-tutorials-logo.png" 
                alt="Vidhya Tutorials" 
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain" 
                onError={(e) => { (e.target as HTMLImageElement).src = '/logo.svg'; }}
              />
              <span className="font-h3 font-bold text-lg sm:text-[24px] text-primary">Vidhya Tutorials</span>
            </Link>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-3 sm:mb-6 w-fit mx-auto lg:mx-0">
            <Shield className="w-4 h-4 text-primary" />
            <span>Authorized Personnel Only</span>
          </div>

          <h1 className="font-h1 font-semibold text-2xl sm:text-4xl md:text-[56px] text-primary leading-tight tracking-[-0.02em] mb-3 sm:mb-6">
            Institutional <br className="hidden sm:inline"/><span className="text-secondary italic">Administration</span> Portal.
          </h1>
          
          <div className="h-6 sm:h-8">
            <AnimatePresence mode="wait">
              <motion.p
                key={taglineIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-on-surface-variant font-bold uppercase tracking-widest text-[11px] sm:text-xs sm:text-sm"
              >
                {taglines[taglineIdx]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* ═══════ RIGHT PANEL — Form Card (Admin Only) ═══════ */}
        <div className="w-full lg:w-[460px] bg-surface rounded-3xl p-5 sm:p-8 md:p-10 shadow-xl border border-outline-variant/30 flex flex-col z-10 relative">
          
          <div className="mb-5 sm:mb-6 text-center lg:text-left">
            <div className="flex items-center justify-between mb-4">
              <img 
                src="/vidhya-tutorials-logo.png" 
                alt="Vidhya Tutorials" 
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain" 
                onError={(e) => { (e.target as HTMLImageElement).src = '/logo.svg'; }}
              />
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5" />
                <span>Admin Authentication</span>
              </div>
            </div>
            <h2 className="text-xl sm:text-[26px] font-bold text-primary">Admin Sign In</h2>
            <p className="text-on-surface-variant mt-1 text-xs sm:text-sm">
              Enter your Administrator credentials to securely access the portal.
            </p>
          </div>

          {/* ── Error Banner ── */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
                className="bg-error-container text-on-error-container font-medium px-4 py-2.5 rounded-xl mb-4 text-xs flex items-center justify-between"
              >
                <span>{error}</span>
                <button type="button" onClick={() => setError('')} className="p-0.5 hover:opacity-80">
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Admin Login Form ── */}
          <form
            onSubmit={loginForm.handleSubmit(handleLogin)}
            className="space-y-4 flex flex-col"
          >
            <PremiumInput
              label="Admin Email or ID"
              placeholder="vidhyatutorials22@gmail.com"
              register={loginForm.register('userId')}
              error={loginForm.formState.errors.userId?.message}
            />

            <PremiumInput
              label="Password"
              isPassword
              placeholder="••••••••"
              register={loginForm.register('password')}
              error={loginForm.formState.errors.password?.message}
            />

            <div className="flex justify-between items-center px-1 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-primary rounded border-outline-variant focus:ring-primary/20" />
                <span className="text-xs font-medium text-on-surface-variant">Remember me</span>
              </label>
              
              <button 
                type="button"
                onClick={() => {
                  setShowResetModal(true);
                  setResetError('');
                  setResetSuccess('');
                }}
                className="text-xs font-bold text-primary hover:underline cursor-pointer flex items-center gap-1"
                title="Forgot Password or Reset Admin ID"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Forgot Password?</span>
              </button>
            </div>

            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-white dark:text-[#001b3c] shadow-md transition-all rounded-xl py-3.5 font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log In as Admin'}
              </motion.button>
            </div>
          </form>

        </div>
      </div>

      {/* ── Secure Forgot Password / Email Reset Link Modal ── */}
      <AnimatePresence>
        {showResetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-md bg-surface rounded-3xl p-6 md:p-8 shadow-2xl border border-outline-variant/40 relative text-on-surface space-y-5"
            >
              <button
                onClick={() => setShowResetModal(false)}
                className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1.5 rounded-full hover:bg-surface-container transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg leading-tight text-on-surface">Forgot Password?</h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">Receive a secure reset link via email</p>
                </div>
              </div>

              {/* Alert / Feedback message */}
              {resetError && (
                <div className="p-3.5 rounded-xl bg-error-container text-on-error-container text-xs font-semibold flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{resetError}</span>
                </div>
              )}

              {resetSuccess ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs font-medium space-y-2">
                    <div className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-300">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      <span>Email Dispatched!</span>
                    </div>
                    <p className="leading-relaxed">
                      {resetSuccess}
                    </p>
                    <p className="text-[11px] opacity-80 pt-1">
                      Didn't see it? Make sure to check your <strong>Spam / Junk</strong> folder as well.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowResetModal(false);
                      setResetSuccess('');
                    }}
                    className="w-full py-3 rounded-xl bg-surface-container border border-outline-variant/60 font-bold text-xs text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                  >
                    Close & Return to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRequestResetLink} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-on-surface-variant uppercase mb-1.5">
                      Registered Administrator Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/40 focus:border-primary focus:outline-hidden text-xs font-semibold text-on-surface placeholder:text-outline/50"
                        placeholder="vidhyatutorials22@gmail.com"
                      />
                    </div>
                    <div className="mt-2 p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/20 flex items-start gap-2 text-[11px] text-on-surface-variant leading-relaxed">
                      <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>
                        For account security, passwords can never be changed directly on-screen. A single-use link valid for <strong>15 minutes</strong> will be sent to this email address.
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={resetLoading}
                      className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-primary/90 shadow-md shadow-primary/20 transition-all cursor-pointer disabled:opacity-60"
                    >
                      {resetLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sending Reset Link...</span>
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          <span>Send Password Reset Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
