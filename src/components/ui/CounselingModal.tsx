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
  Compass, 
  MessageSquare 
} from 'lucide-react';
import { apiClient } from '../../api/apiClient';
import { getFormConfig } from '../../utils/formConfig';

interface CounselingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStandard?: string;
}

export const CounselingModal: React.FC<CounselingModalProps> = ({ 
  isOpen, 
  onClose,
  defaultStandard 
}) => {
  const [config, setConfig] = useState(() => getFormConfig('counseling'));

  useEffect(() => {
    const handleUpdate = () => setConfig(getFormConfig('counseling'));
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
    counselingMode: config.counselingModes?.[0] || 'In-Person at Center (Recommended)',
    preferredSlot: config.timeSlots?.[0] || 'Evening (5:00 PM - 8:00 PM)',
    discussionFocus: config.discussionFocusList?.[0] || 'Board Strategy & Score Improvement',
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
        name: formData.parentOrStudentName,
        phone: formData.phone,
        email: formData.email,
        standard: formData.standard,
        message: `[1-ON-1 COUNSELING APPOINTMENT WITH VIKAS SIR & ADVISORY DESK]\nMode: ${formData.counselingMode}\nSlot: ${formData.preferredSlot}\nDiscussion Focus: ${formData.discussionFocus}\nStudent Background / Concerns: ${formData.notes || 'Requesting personal academic evaluation and syllabus roadmap.'}`
      });

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.error || 'Unable to schedule counseling right now. Please call us directly at +91 88981 17343.');
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
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden z-10 my-auto text-slate-900 dark:text-white"
          >
            {/* Top Accent Line */}
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-primary" />

            {/* Header */}
            <div className="px-5 sm:px-8 pt-5 pb-3.5 sm:pt-6 sm:pb-4 border-b border-slate-100 dark:border-slate-800/80 flex items-start justify-between gap-3 sm:gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 text-primary dark:text-blue-400 text-[10px] sm:text-xs font-semibold mb-1.5 sm:mb-2">
                  <Compass size={12} className="text-primary shrink-0" />
                  <span>{config.sessionTag || 'Personalized Academic Roadmap'}</span>
                </div>
                <h3 className="font-extrabold text-lg sm:text-2xl text-slate-900 dark:text-white tracking-tight leading-snug">
                  {config.title || 'Schedule 1-on-1 Counseling'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1">
                  {config.subtitle || 'Meet Vikas Sir & our senior academic mentors for a tailored study plan.'}
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center apple-active transition-colors duration-150 cursor-pointer text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white shrink-0 mt-0.5"
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
                    Counseling Slot Requested!
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
                    Thank you, <strong className="text-primary">{formData.parentOrStudentName}</strong>. Our counseling desk will reach you at <strong className="text-primary">{formData.phone}</strong> to confirm your slot with Vikas Sir.
                  </p>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-xs text-left space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Mode:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{formData.counselingMode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Preferred Slot:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{formData.preferredSlot}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Discussion Focus:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{formData.discussionFocus}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                      <span className="text-slate-500">Direct Helpline:</span>
                      <a href="tel:+918898117343" className="font-bold text-primary hover:underline">
                        +91 88981 17343
                      </a>
                    </div>
                  </div>

                  <button
                    onClick={handleReset}
                    className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm apple-active transition-colors duration-150 shadow-md cursor-pointer"
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
                          placeholder="10-digit mobile number"
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
                        Counseling Mode *
                      </label>
                      <div className="relative">
                        <Compass size={16} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                        <select
                          name="counselingMode"
                          value={formData.counselingMode}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all cursor-pointer"
                        >
                          {(config.counselingModes && config.counselingModes.length > 0) ? (
                            config.counselingModes.map((cm: string) => (
                              <option key={cm} value={cm}>{cm}</option>
                            ))
                          ) : (
                            <>
                              <option value="In-Person at Center (Recommended)">In-Person at Center (Matunga Road)</option>
                              <option value="Online Video Call (Google Meet)">Online Video Call (Google Meet)</option>
                              <option value="Telephonic Consultation">Telephonic Consultation</option>
                            </>
                          )}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Preferred Time Slot *
                      </label>
                      <div className="relative">
                        <Clock size={16} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                        <select
                          name="preferredSlot"
                          value={formData.preferredSlot}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all cursor-pointer"
                        >
                          {(config.timeSlots && config.timeSlots.length > 0) ? (
                            config.timeSlots.map((slot: string) => (
                              <option key={slot} value={slot}>{slot}</option>
                            ))
                          ) : (
                            <>
                              <option value="Morning (10:00 AM - 1:00 PM)">Morning (10:00 AM - 1:00 PM)</option>
                              <option value="Afternoon (2:00 PM - 5:00 PM)">Afternoon (2:00 PM - 5:00 PM)</option>
                              <option value="Evening (5:00 PM - 8:00 PM)">Evening (5:00 PM - 8:00 PM)</option>
                              <option value="Sunday Special Session">Sunday Special Session</option>
                            </>
                          )}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Key Discussion Topic *
                      </label>
                      <div className="relative">
                        <MessageSquare size={16} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                        <select
                          name="discussionFocus"
                          value={formData.discussionFocus}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all cursor-pointer"
                        >
                          {(config.discussionFocusList && config.discussionFocusList.length > 0) ? (
                            config.discussionFocusList.map((focus: string) => (
                              <option key={focus} value={focus}>{focus}</option>
                            ))
                          ) : (
                            <>
                              <option value="Board Strategy & Score Improvement">Board Strategy & Score Improvement</option>
                              <option value="Stream Selection Guidance (Science vs Commerce)">Stream Selection Guidance (Science vs Commerce)</option>
                              <option value="NEET / MHT-CET Foundation Preparation">NEET / MHT-CET Foundation Preparation</option>
                              <option value="Weak Subject Diagnostic & Personal Doubt Solving">Weak Subject Diagnostic & Doubts</option>
                              <option value="Fee Structure & Batch Timings">Fee Structure & Batch Timings</option>
                            </>
                          )}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Student Strengths / Concerns (Optional)
                    </label>
                    <textarea
                      rows={2}
                      name="notes"
                      placeholder="e.g. Student finds Physics numericals challenging, looking for personalized batch guidance."
                      value={formData.notes}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all resize-none"
                    />
                  </div>

                  {/* Counseling Desk Call Strip */}
                  <div className="p-3 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium truncate">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 animate-pulse" />
                      <span className="truncate">Counseling Desk: Matunga Road Center, Mumbai</span>
                    </span>
                    <a
                      href="tel:+918898117343"
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-white dark:text-blue-300 dark:hover:text-white font-bold text-xs transition-all flex-shrink-0"
                    >
                      <Phone size={12} />
                      <span>Call Desk</span>
                    </a>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer apple-active transition-colors duration-150 disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Reserving Slot...</span>
                      </>
                    ) : (
                      <>
                        <Calendar size={16} />
                        <span>Confirm 1-on-1 Counseling Slot</span>
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
