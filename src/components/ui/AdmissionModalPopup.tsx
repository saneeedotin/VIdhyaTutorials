import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Send, CheckCircle2, Phone, Mail, User, BookOpen, GraduationCap, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../api/apiClient';
import { getFormConfig } from '../../utils/formConfig';

export const AdmissionModalPopup: React.FC = () => {
  const [config, setConfig] = useState(() => getFormConfig('admissionPopup'));
  const [isOpen, setIsOpen] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [legacyToggle, setLegacyToggle] = useState(() => {
    return localStorage.getItem('vt_floating_admission_button') !== 'false';
  });
  const navigate = useNavigate();

  useEffect(() => {
    const handleUpdate = () => {
      setConfig(getFormConfig('admissionPopup'));
      setLegacyToggle(localStorage.getItem('vt_floating_admission_button') !== 'false');
    };
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('vt_admin_setting_changed', handleUpdate);
    window.addEventListener('vt_form_configs_updated', handleUpdate);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('vt_admin_setting_changed', handleUpdate);
      window.removeEventListener('vt_form_configs_updated', handleUpdate);
    };
  }, []);

  const showFloatingButton = config.enabled !== false && config.floatingBadgeEnabled !== false && legacyToggle !== false;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    standard: config.standards?.[0] || '10th Standard',
    message: ''
  });

  // Auto-open on initial website load after delay if enabled
  useEffect(() => {
    if (config.enabled === false || config.autoPopupEnabled === false || legacyToggle === false) return;
    const isDismissed = sessionStorage.getItem('vidhya_admission_popup_dismissed');
    if (!isDismissed && !hasAutoOpened) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasAutoOpened(true);
      }, (config.popupDelaySeconds || 2) * 1000);
      return () => clearTimeout(timer);
    }
  }, [hasAutoOpened, config.autoPopupEnabled, config.enabled, config.popupDelaySeconds, legacyToggle]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('vidhya_admission_popup_dismissed', 'true');
  };

  const handleManualOpen = () => {
    setIsSuccess(false);
    setErrorMessage('');
    setIsOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await apiClient.post('/api/appointments/book', {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        standard: formData.standard,
        message: `[AY 2026-27 Admission Inquiry] ${formData.message || 'Interested in admission counseling.'}`
      });

      setIsSuccess(true);
      sessionStorage.setItem('vidhya_admission_popup_dismissed', 'true');
    } catch (err: any) {
      setErrorMessage(err.response?.data?.error || 'Unable to submit inquiry. Please try again or call us.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* ── Persistent Floating Side Trigger Badge ── */}
      {showFloatingButton && (
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[80] pointer-events-auto print:hidden">
          <motion.button
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            whileHover={{ x: -4, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleManualOpen}
            className="flex items-center gap-3 pl-4 pr-3.5 py-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-900 dark:text-white rounded-l-2xl shadow-[0_10px_30px_rgba(0,0,0,0.18)] border-l-2 border-y border-primary/60 dark:border-blue-500/50 cursor-pointer group hover:bg-slate-50 dark:hover:bg-slate-800 apple-active transition-colors duration-150"
            title="Open Academic Year 2026-27 Admission Form"
            aria-label="Admissions 2026-27 Inquiry"
          >
            {/* Pulsing indicator badge */}
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>

            <div className="flex flex-col items-start text-left">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-primary dark:text-blue-400 leading-none mb-1">
                AY 2026–27
              </span>
              <span className="text-xs font-bold whitespace-nowrap flex items-center gap-1.5 text-slate-900 dark:text-white">
                <span>Admissions Open</span>
                <Sparkles size={12} className="text-amber-500 group-hover:rotate-45 transition-transform" />
              </span>
            </div>
          </motion.button>
        </div>
      )}

      {/* ── Admission Form Popup Modal ── */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="relative w-full max-w-lg bg-surface dark:bg-surface-container-highest border border-outline-variant/30 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] overflow-hidden z-10 text-on-surface my-auto max-h-[90vh] flex flex-col"
            >
              {/* Header Gradient Banner */}
              <div className="relative bg-gradient-to-r from-primary via-blue-600 to-indigo-700 text-white px-5 py-5 sm:px-8 sm:py-7 overflow-hidden shrink-0">
                {/* Decorative glow circles */}
                <div className="absolute -top-12 -right-12 w-36 h-36 bg-accent-lime/20 rounded-full blur-2xl pointer-events-none"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

                <div className="relative z-10 flex items-start justify-between gap-3">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider text-accent-lime mb-2 border border-white/20">
                      <GraduationCap size={14} />
                      <span>{config.sessionTag || 'Academic Year 2026 - 2027'}</span>
                    </div>
                    <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight">
                      {config.title || 'Admissions Now Open'}
                    </h2>
                    <p className="text-xs sm:text-sm text-white/85 mt-1 font-normal">
                      {config.subtitle || 'Reserve your seat or book free counseling at Vidhya Tutorials.'}
                    </p>
                  </div>

                  {/* Close button */}
                  <button
                    type="button"
                    onClick={handleClose}
                    className="p-2 rounded-full bg-white/15 hover:bg-white/30 text-white apple-active transition-colors duration-150 cursor-pointer shrink-0 border border-white/20"
                    title="Close popup"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-4 sm:p-6 md:p-8 overflow-y-auto no-scrollbar">
                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-8 flex flex-col items-center text-center space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center shadow-inner">
                      <CheckCircle2 size={38} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-primary">Inquiry Submitted Successfully!</h3>
                      <p className="text-xs sm:text-sm text-on-surface-variant mt-2 max-w-sm">
                        Thank you for reaching out. Our academic counselors will contact you shortly on <strong>{formData.phone}</strong>.
                      </p>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row gap-3 w-full">
                      <button
                        type="button"
                        onClick={() => {
                          handleClose();
                          navigate('/admission-form');
                        }}
                        className="flex-1 py-3 px-4 rounded-xl bg-primary text-white text-xs sm:text-sm font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        <span>Fill Full Admission Form</span>
                        <ArrowRight size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={handleClose}
                        className="py-3 px-4 rounded-xl bg-surface-container hover:bg-surface-container-highest border border-outline-variant/30 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                      >
                        Close
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {errorMessage && (
                      <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-medium">
                        {errorMessage}
                      </div>
                    )}

                    {/* Student Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5">
                        <User size={13} className="text-primary" />
                        <span>Student or Parent Name <span className="text-red-500">*</span></span>
                      </label>
                      <input
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-bright dark:bg-surface-container border border-outline-variant/40 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      />
                    </div>

                    {/* Contact details grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* Phone Number */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5">
                          <Phone size={13} className="text-primary" />
                          <span>Phone / WhatsApp <span className="text-red-500">*</span></span>
                        </label>
                        <input
                          required
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 98765 43210"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-surface-bright dark:bg-surface-container border border-outline-variant/40 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5">
                          <Mail size={13} className="text-primary" />
                          <span>Email Address <span className="text-red-500">*</span></span>
                        </label>
                        <input
                          required
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="student@gmail.com"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-surface-bright dark:bg-surface-container border border-outline-variant/40 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Standard / Stream Selection */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5">
                        <BookOpen size={13} className="text-primary" />
                        <span>Select Standard / Stream <span className="text-red-500">*</span></span>
                      </label>
                      <select
                        name="standard"
                        value={formData.standard}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-bright dark:bg-surface-container border border-outline-variant/40 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer font-medium"
                      >
                        {(config.standards && config.standards.length > 0) ? (
                          config.standards.map((std: string) => (
                            <option key={std} value={std}>{std}</option>
                          ))
                        ) : (
                          <>
                            <option value="6th to 8th Foundation">6th - 8th Foundation (School)</option>
                            <option value="9th Standard">9th Standard (State / CBSE / ICSE)</option>
                            <option value="10th Standard">10th Standard (Board Year Batch)</option>
                            <option value="11th Science">11th Science (PCMB / NEET / CET)</option>
                            <option value="12th Science">12th Science & Entrance Prep</option>
                            <option value="11th Commerce">11th Commerce (Accounts, Maths, Eco)</option>
                            <option value="12th Commerce">12th Commerce (HSC Board Batch)</option>
                            <option value="NEET / CET Entrance Batch">NEET & MHT-CET Entrance</option>
                          </>
                        )}
                      </select>
                    </div>

                    {/* Note / Preferred Campus */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-on-surface-variant">
                        Any questions or branch preference? (Optional)
                      </label>
                      <textarea
                        rows={2}
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="e.g. Inquiring for Matunga Road branch, morning batch..."
                        className="w-full px-3.5 py-2 rounded-xl bg-surface-bright dark:bg-surface-container border border-outline-variant/40 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2 flex flex-col gap-2.5">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-primary to-blue-700 hover:from-primary/95 hover:to-blue-800 text-white font-bold text-sm shadow-md hover:shadow-lg apple-active transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>Submitting Inquiry...</span>
                          </>
                        ) : (
                          <>
                            <span>Claim Free Counseling / Seat</span>
                            <Send size={16} />
                          </>
                        )}
                      </button>

                      {/* Link to Full Form */}
                      <div className="flex items-center justify-between text-xs text-on-surface-variant pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            handleClose();
                            navigate('/apply');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="hover:text-primary underline cursor-pointer font-medium"
                        >
                          Looking for full registration form?
                        </button>

                        <button
                          type="button"
                          onClick={handleClose}
                          className="hover:text-primary cursor-pointer"
                        >
                          Remind me later
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
