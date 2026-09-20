import { useState, ReactNode } from 'react';
import { 
  ArrowRight, 
  ChevronDown, 
  CheckCircle2, 
  FileText, 
  Calendar, 
  HelpCircle, 
  Sparkles, 
  MessageSquare,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollTicker } from '../ui/ScrollTicker';
import { FreeDemoModal } from '../ui/FreeDemoModal';
import { EnquiryModal } from '../ui/EnquiryModal';
import { CounselingModal } from '../ui/CounselingModal';

const FadeInWhenVisible = ({ children, delay = 0, className = "" }: { children: ReactNode, delay?: number, className?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export function AdmissionsPage() {
  const navigate = useNavigate();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isCounselingOpen, setIsCounselingOpen] = useState(false);

  return (
    <div className="bg-surface-container-low min-h-screen font-body-md text-on-surface overflow-x-hidden flex flex-col w-full">
      
      {/* 1. Hero Section */}
      <section className="relative w-full pt-28 sm:pt-36 md:pt-48 pb-12 sm:pb-20 px-4 md:px-[64px] overflow-hidden bg-surface-container-low">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/admissions-hero-bg.png" 
            alt="Admissions & Counseling at Vidhya Tutorials" 
            className="w-full h-full object-cover object-center" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/35 backdrop-blur-[0.5px]"></div>
        </div>
        
        <div className="relative z-10 max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <FadeInWhenVisible className="z-10">
            <span className="inline-block px-3.5 py-1.5 bg-primary/20 backdrop-blur-md text-white border border-white/20 rounded-full text-[11px] sm:text-data-label font-data-label mb-4 sm:mb-6 tracking-widest uppercase animate-float-slow shadow-lg">
              ✨ Admissions Open 2026-27
            </span>
            <h1 className="font-h1 text-3xl sm:text-4xl md:text-[56px] font-bold text-white leading-tight tracking-[-0.02em] mb-4 sm:mb-6">
              Start your <br/><span className="text-brilliant italic text-amber-300">journey</span> here.
            </h1>
            <p className="text-white/90 font-body-lg text-sm sm:text-base md:text-[18px] max-w-lg mb-6 sm:mb-8 leading-relaxed font-normal">
              Join a community dedicated to academic excellence, personal growth, and creating the leaders of tomorrow.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <button onClick={() => navigate('/apply')} className="bg-primary text-white dark:text-[#001b3c] px-7 py-3.5 sm:px-8 sm:py-4 rounded-xl font-bold transition-all shadow-md hover:-translate-y-1 hover:shadow-xl w-full sm:w-fit btn-magnetic btn-ripple cursor-pointer flex items-center justify-center gap-2 group min-h-[48px]">
                <span>Apply Online</span>
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1.5" />
              </button>
              <button 
                onClick={() => setIsCounselingOpen(true)}
                className="bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-md px-6 py-3.5 sm:py-4 rounded-xl font-bold transition-all shadow-md hover:-translate-y-1 w-full sm:w-fit cursor-pointer flex items-center justify-center gap-2 min-h-[48px]"
              >
                <Calendar size={18} />
                <span>1-on-1 Counseling</span>
              </button>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      <div className="relative z-10 w-full shadow-[0_-20px_50px_rgba(0,0,0,0.1)] overflow-hidden bg-surface-container-low">
        <ScrollTicker items={["Admissions Open 2026-27", "Limited Seats Available", "Join The Legacy"]} className="bg-primary text-white dark:text-[#001b3c] border-b border-white/10 dark:border-[#001b3c]/20" />
        <div className="pt-10 sm:pt-16 pb-20 sm:pb-24 space-y-10 sm:space-y-16 md:space-y-24 px-3.5 sm:px-6 md:px-[64px]">

      {/* 3. Begin Your Journey Section */}
      <section className="max-w-[1280px] mx-auto bg-surface theme-dark-card rounded-3xl shadow-xl border border-outline-variant/20 p-5 sm:p-8 md:p-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <FadeInWhenVisible className="order-2 lg:order-1">
            <div className="relative aspect-[4/5] md:aspect-square rounded-2xl overflow-hidden shadow-2xl border border-outline-variant/20 img-zoom card-3d group">
              <img 
                src="/assets/wings/school.jpg" 
                alt="Students in classroom at Vidhya Tutorials" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.2} className="order-1 lg:order-2">
            <h2 className="font-h2 text-[32px] font-semibold text-primary mb-6">
              Begin your journey
            </h2>
            <p className="text-on-surface-variant text-[18px] mb-10 leading-relaxed">
              Ready to connect to your future? We're here to guide you every step of the way. Find all the information you need to apply right here. Discover how to start your application, explore admission requirements, learn about important deadlines, and more.
            </p>

            <div className="flex flex-col space-y-4">
              {[
                {
                  q: 'How To Apply',
                  items: [
                    'Fill out the quick online application form right here by clicking "Start Online Application".',
                    'Or visit our Matunga Road center to submit the admission form offline.',
                    'Submit past academic marksheets and attend personal counseling with Vikas Sir for batch allocation.'
                  ],
                  note: 'Counseling desk is open Mon-Sat, 9:00 AM to 8:00 PM at Matunga Road Center.'
                },
                {
                  q: 'Admission Requirements',
                  items: [
                    'Open for Class 6th to 10th (SSC, ICSE, CBSE) and 11th & 12th (Commerce & Science).',
                    'Copy of previous academic year report card / marksheet.',
                    'Two recent passport-size student photographs & ID proof (Aadhaar).',
                    'Commitment to regular class attendance, weekly tests, and homework completion.'
                  ],
                  note: 'Direct merit admissions available based on previous school academic performance.'
                },
                {
                  q: 'Next Steps For Applicants',
                  items: [
                    'Book a Free Demo Class to experience our interactive faculty and teaching pedagogy.',
                    'Attend the diagnostic orientation to understand your subject strengths and syllabus roadmap.',
                    'Receive complete Vidhya Tutorials study modules, formula books, and test series access upon enrollment.'
                  ],
                  note: 'Batch seats are kept strictly limited to ensure personal student attention.'
                }
              ].map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={faq.q}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isOpen
                        ? 'border-blue-600/40 bg-blue-50/40 dark:bg-slate-800/80 shadow-md ring-1 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-blue-300 dark:hover:border-slate-700 shadow-sm'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-5 text-left cursor-pointer select-none transition-colors"
                    >
                      <span className={`text-[17px] font-semibold tracking-tight transition-colors ${
                        isOpen ? 'text-blue-700 dark:text-blue-400' : 'text-slate-900 dark:text-white'
                      }`}>
                        {faq.q}
                      </span>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isOpen ? 'bg-blue-600 text-white rotate-180' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}>
                        <ChevronDown size={18} />
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 pt-1 border-t border-slate-200/60 dark:border-slate-700/60 mt-1">
                            <ul className="space-y-2.5 mt-3">
                              {faq.items.map((step, sIdx) => (
                                <li key={sIdx} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ul>
                            {faq.note && (
                              <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs font-medium text-amber-800 dark:text-amber-300 flex items-center gap-2">
                                <span className="font-bold">Tip:</span>
                                <span>{faq.note}</span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-8">
              <motion.button 
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/apply')}
                className="bg-primary text-white dark:text-[#001b3c] px-8 py-4 rounded-lg font-bold transition-all shadow-md inline-flex items-center gap-2 btn-magnetic btn-ripple cursor-pointer group"
              >
                <span>Start Online Application</span> <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </motion.button>
            </div>
          </FadeInWhenVisible>

        </div>
      </section>

      {/* 4. Comprehensive Admission & Counseling Forms Hub */}
      <section className="max-w-[1280px] mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles size={14} />
            <span>Admission Desks & Application Modes</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            All Admission Forms & Booking Desks
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-2">
            Choose the right form suited to your requirement — from official board enrollment to free trial lectures and founder counseling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Official Admission Form */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-primary dark:text-blue-400 flex items-center justify-center mb-4">
                <FileText size={24} />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                Primary Enrollment
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2 mb-1.5">
                Official Admission Form
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                Complete multi-step admission form for 2026-27 session. Enter student details, address, and upload documents.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 mb-6">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-500" />
                  <span>Standard 6th to 12th & Entrance</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-500" />
                  <span>Official enrollment & roll allotment</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => navigate('/apply')}
              className="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <span>Fill Admission Form</span>
              <ArrowRight size={14} />
            </button>
          </motion.div>

          {/* Card 2: 1-on-1 Founder Counseling */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-indigo-500/30 dark:border-indigo-500/20 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[9px] font-extrabold px-3 py-0.5 rounded-bl-xl uppercase tracking-wider">
              Popular
            </div>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <Calendar size={24} />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-0.5 rounded-full">
                Personal Guidance
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2 mb-1.5">
                1-on-1 Counseling Slot
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                Direct consultation with Vikas Sir & senior academic directors for stream selection, board target setting, and diagnostic roadmap.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 mb-6">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-500" />
                  <span>In-person at Center or Google Meet</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-500" />
                  <span>Weak area diagnostic report</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => setIsCounselingOpen(true)}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <span>Schedule Counseling</span>
              <Calendar size={14} />
            </button>
          </motion.div>

          {/* Card 3: Free Demo Lecture Booking */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <Sparkles size={24} />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full">
                100% Free
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2 mb-1.5">
                Free Demo Class Pass
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                Experience actual classroom teaching, interactive doubt clearing, and study atmosphere before taking final admission.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 mb-6">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-500" />
                  <span>Attend live 60-min classroom lecture</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-500" />
                  <span>Choose subject & preferred batch slot</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => setIsDemoOpen(true)}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <span>Book Free Demo Class</span>
              <Sparkles size={14} />
            </button>
          </motion.div>

          {/* Card 4: Fee Structure & Course Enquiry */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                <MessageSquare size={24} />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full">
                Quick Enquiry
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2 mb-1.5">
                Fee & Batch Enquiry
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                Get full details on fee installment plans, flexible payment options, batch timings, and Sunday test series directly on WhatsApp/call.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 mb-6">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-500" />
                  <span>Detailed fee breakdown on WhatsApp</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-500" />
                  <span>Instant counselor callback within 2 hours</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => setIsEnquiryOpen(true)}
              className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <span>Submit General Enquiry</span>
              <MessageSquare size={14} />
            </button>
          </motion.div>
        </div>
      </section>

        </div>
      </div>

      {/* ── Modals Integrated in Admissions Page ── */}
      <FreeDemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
      <EnquiryModal isOpen={isEnquiryOpen} onClose={() => setIsEnquiryOpen(false)} />
      <CounselingModal isOpen={isCounselingOpen} onClose={() => setIsCounselingOpen(false)} />
    </div>
  );
}
