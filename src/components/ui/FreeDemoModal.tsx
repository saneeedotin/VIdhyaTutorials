import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  Phone, 
  User, 
  BookOpen, 
  Clock, 
  Loader2, 
  ArrowRight, 
  ShieldCheck, 
  MapPin, 
  HelpCircle 
} from 'lucide-react';
import { apiClient } from '../../api/apiClient';
import { getFormConfig } from '../../utils/formConfig';

interface FreeDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultWing?: string;
}

export const FreeDemoModal: React.FC<FreeDemoModalProps> = ({ isOpen, onClose, defaultWing }) => {
  const [config, setConfig] = useState(() => getFormConfig('freeDemo'));

  useEffect(() => {
    const handleUpdate = () => setConfig(getFormConfig('freeDemo'));
    window.addEventListener('vt_form_configs_updated', handleUpdate);
    return () => window.removeEventListener('vt_form_configs_updated', handleUpdate);
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    studentName: '',
    phone: '',
    email: '',
    standard: defaultWing || config.standards?.[0] || '10th Standard',
    preferredSubject: config.subjects?.[0] || 'Mathematics & Science',
    preferredTime: config.timeSlots?.[0] || 'Weekday Evening (5 PM - 8 PM)',
    notes: ''
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
        name: formData.studentName,
        phone: formData.phone,
        email: formData.email,
        standard: formData.standard,
        message: `[FREE DEMO BOOKING REQUEST]\nPreferred Subject: ${formData.preferredSubject}\nPreferred Slot: ${formData.preferredTime}\nNotes: ${formData.notes || 'Interested in experiencing a live demo lecture with Vikas Sir & Faculty.'}`
      });

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.error || 'Unable to submit demo request. Please try again or call us at +91 88981 17343.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setErrorMessage('');
    setFormData({
      studentName: '',
      phone: '',
      email: '',
      standard: '10th Standard',
      preferredSubject: 'Mathematics & Science',
      preferredTime: 'Weekday Evening (5 PM - 8 PM)',
      notes: ''
    });
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
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative w-full max-w-[540px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden z-10 my-auto text-slate-900 dark:text-white"
          >
            {/* Top Accent Strip */}
            <div className="h-1.5 w-full bg-gradient-to-r from-primary via-blue-500 to-indigo-600" />

            {/* Clean Executive Header */}
            <div className="px-5 sm:px-8 pt-5 pb-3.5 sm:pt-6 sm:pb-4 border-b border-slate-100 dark:border-slate-800/80 flex items-start justify-between gap-3 sm:gap-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/60 text-primary dark:text-blue-400 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                  <Sparkles size={12} className="text-amber-500 shrink-0" />
                  <span>{config.sessionTag || '100% Free • No Admission Obligation'}</span>
                </div>
                <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {config.title || 'Book Free Demo Class'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                  {config.subtitle || "Experience Vidhya Tutorials' concept-first teaching before enrolling."}
                </p>
              </div>

              <button
                onClick={onClose}
                aria-label="Close modal"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer text-slate-600 dark:text-slate-300 shrink-0 mt-0.5"
              >
                <X size={17} />
              </button>
            </div>

            <div className="p-4 sm:p-8 max-h-[82vh] overflow-y-auto no-scrollbar">
              {isSuccess ? (
                <div className="text-center py-6 space-y-5">
                  <div className="w-16 h-16 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner border border-emerald-500/20">
                    <CheckCircle2 size={38} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      Demo Seat Reserved!
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
                      Thank you, <strong className="text-primary dark:text-blue-400 font-bold">{formData.studentName}</strong>. Our academic team will call you within 2 hours to confirm your slot and provide classroom directions.
                    </p>
                  </div>

                  <div className="p-4.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-left space-y-2.5">
                    <div className="flex justify-between pb-2 border-b border-slate-200/80 dark:border-slate-700/60">
                      <span className="text-slate-500 dark:text-slate-400">Student Name:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{formData.studentName}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-slate-200/80 dark:border-slate-700/60">
                      <span className="text-slate-500 dark:text-slate-400">Class / Stream:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{formData.standard}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-slate-200/80 dark:border-slate-700/60">
                      <span className="text-slate-500 dark:text-slate-400">Subject:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{formData.preferredSubject}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-slate-200/80 dark:border-slate-700/60">
                      <span className="text-slate-500 dark:text-slate-400">Preferred Slot:</span>
                      <span className="font-bold text-primary dark:text-blue-400">{formData.preferredTime}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 dark:text-slate-400">Campus Location:</span>
                      <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                        <MapPin size={12} className="text-emerald-500" />
                        Matunga Road, Mumbai
                      </span>
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
                    <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold">
                      {errorMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Student Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User size={16} className="absolute left-3.5 top-3 text-slate-400" />
                        <input
                          type="text"
                          required
                          name="studentName"
                          placeholder="e.g. Aryan Sharma"
                          value={formData.studentName}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3.5 top-3 text-slate-400" />
                        <input
                          type="tel"
                          required
                          name="phone"
                          placeholder="10-digit mobile number"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Class / Standard <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <BookOpen size={16} className="absolute left-3.5 top-3 text-slate-400" />
                        <select
                          name="standard"
                          value={formData.standard}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer"
                        >
                          {(config.standards && config.standards.length > 0) ? (
                            config.standards.map((s: string) => (
                              <option key={s} value={s}>{s}</option>
                            ))
                          ) : (
                            <>
                              <option value="8th Standard">8th Standard</option>
                              <option value="9th Standard">9th Standard</option>
                              <option value="10th Standard">10th SSC / Board</option>
                              <option value="11th Commerce">11th Commerce (FYJC)</option>
                              <option value="12th Commerce">12th Commerce (SYJC)</option>
                              <option value="11th Science">11th Science (PCM/PCB)</option>
                              <option value="12th Science">12th Science (PCM/PCB)</option>
                              <option value="MHT-CET / NEET">MHT-CET / NEET Prep</option>
                            </>
                          )}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Subject of Interest
                      </label>
                      <input
                        type="text"
                        name="preferredSubject"
                        placeholder="e.g. Maths, Science, Accounts"
                        value={formData.preferredSubject}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Preferred Demo Slot
                    </label>
                    <div className="relative">
                      <Clock size={16} className="absolute left-3.5 top-3 text-slate-400" />
                      <select
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer"
                      >
                        {(config.timeSlots && config.timeSlots.length > 0) ? (
                          config.timeSlots.map((ts: string) => (
                            <option key={ts} value={ts}>{ts}</option>
                          ))
                        ) : (
                          <>
                            <option value="Weekday Evening (5 PM - 8 PM)">Weekday Evening (5:00 PM – 8:00 PM)</option>
                            <option value="Weekend Morning (9 AM - 1 PM)">Weekend Morning (9:00 AM – 1:00 PM)</option>
                            <option value="Sunday Special Demo Session">Sunday Special Demo Session</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Any Specific Question or Current Percentage? (Optional)
                    </label>
                    <textarea
                      rows={2}
                      name="notes"
                      placeholder="e.g. scored 85% in 9th, want guidance for 10th maths board strategy"
                      value={formData.notes}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                    />
                  </div>



                  {/* Primary CTA */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer transition-all disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Reserving Your Seat...</span>
                      </>
                    ) : (
                      <>
                        <Calendar size={18} />
                        <span>Confirm Free Demo Class</span>
                        <ArrowRight size={17} />
                      </>
                    )}
                  </button>

                  {/* Direct Contact Footer Link */}
                  <p className="text-center text-[11px] text-slate-500 dark:text-slate-400 font-medium pt-1">
                    Have questions first? Call direct faculty desk at{' '}
                    <a href="tel:8898117343" className="text-primary dark:text-blue-400 font-bold hover:underline">
                      8898117343
                    </a>
                    {' / '}
                    <a href="tel:8169078586" className="text-primary dark:text-blue-400 font-bold hover:underline">
                      8169078586
                    </a>
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
