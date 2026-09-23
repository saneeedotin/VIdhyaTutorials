import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertTriangle, ArrowLeft, KeyRound } from 'lucide-react';
import { apiClient } from '../../api/apiClient';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenEmail, setTokenEmail] = useState('');
  const [verificationError, setVerificationError] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setVerifying(false);
      setTokenValid(false);
      setVerificationError('No reset token was found in the link. Please request a new password reset link.');
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await apiClient.post('/api/auth/verify-reset-token', { token });
        if (res.data?.valid) {
          setTokenValid(true);
          setTokenEmail(res.data.email || 'vidhyatutorials22@gmail.com');
        } else {
          setTokenValid(false);
          setVerificationError(res.data?.error || 'Password reset link is invalid or expired.');
        }
      } catch (err: any) {
        setTokenValid(false);
        setVerificationError(err.response?.data?.error || 'Password reset link is invalid or has expired (15-minute limit).');
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!newPassword || newPassword.length < 4) {
      setSubmitError('New password must be at least 4 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setSubmitError('Passwords do not match. Please re-enter carefully.');
      return;
    }

    setSubmitting(true);
    try {
      await apiClient.post('/api/auth/reset-password', {
        token,
        newPassword,
      });

      setSubmitSuccess(true);
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2500);
    } catch (err: any) {
      setSubmitError(err.response?.data?.error || 'Failed to update password. Please request a new link.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background flex items-center justify-center p-4 md:p-12 font-body-md relative overflow-hidden text-on-surface">
      {/* Decorative Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" style={{ background: 'radial-gradient(circle, rgba(31,64,109,0.08) 0%, rgba(31,64,109,0) 70%)' }}></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none translate-y-1/3 -translate-x-1/3" style={{ background: 'radial-gradient(circle, rgba(48,96,154,0.08) 0%, rgba(48,96,154,0) 70%)' }}></div>

      <div className="w-full max-w-[480px] mx-auto relative z-10">
        
        {/* Top Branding */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <img 
              src="/vidhya-tutorials-logo.png" 
              alt="Vidhya Tutorials" 
              className="w-10 h-10 object-contain" 
              onError={(e) => { (e.target as HTMLImageElement).src = '/logo.svg'; }}
            />
            <span className="font-h3 font-bold text-xl text-primary">Vidhya Tutorials</span>
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            <span>Administrative Security Desk</span>
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl border border-outline-variant/30 relative">

          {/* 1. VERIFYING STATE */}
          {verifying && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <div>
                <h2 className="text-lg font-bold text-primary">Verifying Reset Link</h2>
                <p className="text-xs text-on-surface-variant mt-1">Checking link validity and security token...</p>
              </div>
            </div>
          )}

          {/* 2. INVALID / EXPIRED TOKEN */}
          {!verifying && !tokenValid && (
            <div className="text-center space-y-5 py-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-error/10 text-error flex items-center justify-center">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-on-surface">Link Expired or Invalid</h2>
                <p className="text-xs text-on-surface-variant mt-2 leading-relaxed max-w-sm mx-auto">
                  {verificationError || 'This password reset link is invalid or has already expired. Password reset links are strictly single-use and valid for 15 minutes.'}
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2.5">
                <Link
                  to="/login"
                  className="w-full py-3 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-md"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Sign In</span>
                </Link>
              </div>
            </div>
          )}

          {/* 3. SUCCESS MESSAGE (AFTER RESET) */}
          {!verifying && tokenValid && submitSuccess && (
            <div className="text-center space-y-5 py-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-on-surface">Password Reset Complete!</h2>
                <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                  Your administrator password has been updated securely. Redirecting you to the sign-in page...
                </p>
              </div>
              <div className="pt-2">
                <Link
                  to="/login"
                  className="w-full py-3 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-md"
                >
                  <span>Sign In with New Password</span>
                </Link>
              </div>
            </div>
          )}

          {/* 4. ACTIVE RESET FORM */}
          {!verifying && tokenValid && !submitSuccess && (
            <div>
              <div className="mb-6">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-3">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-primary">Set New Password</h2>
                <p className="text-xs text-on-surface-variant mt-1">
                  Resetting credentials for: <span className="font-bold text-on-surface">{tokenEmail}</span>
                </p>
              </div>

              {submitError && (
                <div className="p-3.5 rounded-xl bg-error-container text-on-error-container text-xs font-semibold flex items-start gap-2 mb-4">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* New Password */}
                <div>
                  <label className="block font-bold text-on-surface-variant uppercase mb-1.5 tracking-wider">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      minLength={4}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min. 4 chars)"
                      className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/40 focus:border-primary focus:outline-hidden text-xs text-on-surface pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block font-bold text-on-surface-variant uppercase mb-1.5 tracking-wider">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      minLength={4}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline-variant/40 focus:border-primary focus:outline-hidden text-xs text-on-surface pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-primary/90 shadow-md shadow-primary/20 transition-all cursor-pointer disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Confirm & Update Password</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

        {/* Back Link */}
        <div className="text-center mt-5">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-primary transition-colors font-semibold">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
