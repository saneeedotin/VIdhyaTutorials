import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, CheckCircle2, Phone, Mail, User, BookOpen, MessageSquare, Loader2 } from 'lucide-react';
import { apiClient } from '../../api/apiClient';
import { getFormConfig } from '../../utils/formConfig';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle?: string;
  defaultStandard?: string;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  courseTitle,
  defaultStandard
}) => {
  const [config, setConfig] = useState(() => getFormConfig('enquiry'));

  useEffect(() => {
    const handleUpdate = () => setConfig(getFormConfig('enquiry'));
    window.addEventListener('vt_form_configs_updated', handleUpdate);
    return () => window.removeEventListener('vt_form_configs_updated', handleUpdate);
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    parentOrStudentName: '',
    phone: '',
    email: '',
    standard: defaultStandard || config.standards?.[0] || '10th Standard',
    queryTopic: courseTitle ? `Inquiry regarding ${courseTitle}` : (config.topics?.[0] || 'Admission Eligibility & Fee Details'),
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await apiClient.post('/api/appointments/book', {
        name: formData.parentOrStudentName,
        phone: formData.phone,
        email: formData.email,
        standard: formData.standard,
        message: `[ADMISSION ENQUIRY - VIDHYA TUTORIALS]\nTopic: ${formData.queryTopic}\nMessage: ${formData.message || 'Interested in admission details, batch timings, and fee structure.'}`
      });

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.error || 'Unable to submit enquiry. Please call us directly at +91 88981 17343.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setErrorMessage('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden z-10 my-auto text-slate-900 dark:text-white"
          >
            {/* Top Accent Line */}
            <div className="h-1.5 w-full bg-gradient-to-r from-primary via-blue-500 to-indigo-600" />

            {/* Header Section */}
            <div className="px-5 sm:px-8 pt-5 pb-3.5 sm:pt-6 sm:pb-4 border-b border-slate-100 dark:border-slate-800/80 flex items-start justify-between gap-3 sm:gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary dark:text-blue-400 text-[10px] sm:text-xs font-semibold mb-1.5 sm:mb-2">
                  <Sparkles size={12} className="text-primary shrink-0" />
                  <span>{config.sessionTag || 'Academic Session 2026–2027'}</span>
                </div>
                <h3 className="font-extrabold text-lg sm:text-2xl text-slate-900 dark:text-white tracking-tight leading-snug">
                  {config.title || 'Inquire for Admission'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1">
                  {config.subtitle || 'Get fee structures, batch schedules, and curriculum details.'}
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center transition-all cursor-pointer text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white shrink-0 mt-0.5"
                aria-label="Close modal"
              >
                <X size={17} />
              </button>
            </div>

            <div className="p-4 sm:p-8 max-h-[82vh] overflow-y-auto no-scrollbar">
              {isSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner border border-emerald-200 dark:border-emerald-800/50">
                    <CheckCircle2 size={36} />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Enquiry Received!
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
                    {config.successMessage || 'Thank you for inquiring with Vidhya Tutorials. Our admissions desk will get in touch shortly.'}
                  </p>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-xs text-left space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Student/Parent:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{formData.parentOrStudentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Class:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{formData.standard}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-slate-500">Direct Helpline:</span>
                      <a href={`tel:${config.helplinePhone?.replace(/\s+/g, '') || '+918898117343'}`} className="font-bold text-primary hover:underline">
                        {config.helplinePhone || '+91 88981 17343'}
                      </a>
                    </div>
                  </div>

                  <button
                    onClick={handleReset}
                    className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm transition-all shadow-md cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-semibold">
                      {errorMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Student / Parent Name *
                      </label>
                      <div className="relative">
                        <User size={16} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                        <input
                          type="text"
                          required
                          name="parentOrStudentName"
                          placeholder="Your full name"
                          value={formData.parentOrStudentName}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Contact Number *
                      </label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                        <input
                          type="tel"
                          required
                          name="phone"
                          placeholder="10-digit number"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Class / Standard *
                      </label>
                      <div className="relative">
                        <BookOpen size={16} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                        <select
                          name="standard"
                          value={formData.standard}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all cursor-pointer"
                        >
                          {(config.standards && config.standards.length > 0) ? (
                            config.standards.map((s: string) => (
                              <option key={s} value={s}>{s}</option>
                            ))
                          ) : (
                            <>
                              <option value="8th Standard">8th Standard (School)</option>
                              <option value="9th Standard">9th Standard (School)</option>
                              <option value="10th Standard">10th SSC / Board</option>
                              <option value="11th Commerce">11th Commerce (FYJC)</option>
                              <option value="12th Commerce">12th Commerce (SYJC)</option>
                              <option value="11th Science">11th Science (PCM/PCB)</option>
                              <option value="12th Science">12th Science (PCM/PCB)</option>
                              <option value="MHT-CET / NEET">MHT-CET / NEET Entrance</option>
                            </>
                          )}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Email Address (Optional)
                      </label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                        <input
                          type="email"
                          name="email"
                          placeholder="name@email.com"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      What would you like to inquire about?
                    </label>
                    <textarea
                      rows={3}
                      name="message"
                      placeholder="e.g. Please share fee details for 10th SSC, batch timings, and Sunday test series information."
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all resize-none"
                    />
                  </div>

                  {/* Counseling Desk Call Strip */}
                  <div className="p-3 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium truncate">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 animate-pulse" />
                      <span className="truncate">Admissions Helpline: {config.helplinePhone || '+91 88981 17343'}</span>
                    </span>
                    <a
                      href={`tel:${config.helplinePhone?.replace(/\s+/g, '') || '+918898117343'}`}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-white dark:text-blue-300 dark:hover:text-white font-bold text-xs transition-all flex-shrink-0"
                    >
                      <Phone size={12} />
                      <span>Call Desk</span>
                    </a>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer transition-all disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Sending Enquiry...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Submit Admission Enquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
