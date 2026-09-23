import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Award, 
  ArrowRight, 
  GraduationCap, 
  Target, 
  Users,
  Quote,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Sparkles,
  PhoneCall,
  Star,
  BookOpen,
  MapPin
} from 'lucide-react';
import { CounselingModal } from '../ui/CounselingModal';

interface VikasSirSpotlightProps {
  onScheduleCounseling?: () => void;
  onBookDemo?: () => void;
}

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string, key?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export function VikasSirSpotlight({ onScheduleCounseling, onBookDemo }: VikasSirSpotlightProps) {
  const navigate = useNavigate();
  const [internalCounselingOpen, setInternalCounselingOpen] = useState(false);

  const MENTORSHIP_PILLARS = [
    {
      icon: Target,
      title: 'First-Principles Concept Clarity',
      desc: 'Deconstructing complex formulas and theorems into intuitive logic so students never have to rely on rote memorization.',
      badgeColor: 'bg-blue-50 dark:bg-blue-950/60 text-primary dark:text-blue-300 border-blue-200/80 dark:border-blue-800/80'
    },
    {
      icon: Users,
      title: 'Direct 1-on-1 Daily Doubt Desks',
      desc: 'Sir personally conducts doubt-solving sessions after lectures, reviewing answer sheets individually with each student.',
      badgeColor: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/80'
    },
    {
      icon: Award,
      title: 'Examiner-Pattern Prelim Drills',
      desc: 'Systematic board test series with verified step-marking techniques that turn consistent effort into 90%+ scores.',
      badgeColor: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/80'
    },
    {
      icon: ShieldCheck,
      title: 'Personalized Progress Tracking',
      desc: 'Continuous performance analytics and regular parent-mentor dialogue to nurture confidence and eliminate exam fear.',
      badgeColor: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200/80 dark:border-indigo-800/80'
    }
  ];

  return (
    <section className="max-w-[1280px] mx-auto" id="mentor-spotlight">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-10 md:p-14 relative overflow-hidden transition-colors">
        
        {/* Subtle Ambient Decorative Accents */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* ── Left Column: Executive Founder Portrait Card (Balanced Proportions) ── */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <FadeIn className="w-full max-w-[380px]">
              <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-6 sm:p-7 border border-slate-200/90 dark:border-slate-700 shadow-xl relative group transition-all duration-300 hover:shadow-2xl">
                
                {/* Photo Frame - Clean, Elegant Executive Portrait */}
                <div className="relative w-full aspect-[4/5] max-w-[280px] mx-auto rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 shadow-md border border-slate-200/80 dark:border-slate-700 group-hover:border-primary/40 dark:group-hover:border-blue-400/40 transition-colors">
                  <img
                    src="/sir-real-photo.jpg"
                    alt="Vikas Sir — Founder & Senior Faculty at Vidhya Tutorials"
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Top Verified Badge */}
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-900 dark:text-white text-xs font-bold shadow-md border border-slate-200/80 dark:border-slate-700 flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span>Founder</span>
                  </div>
                </div>

                {/* Profile Identity Details */}
                <div className="text-center mt-5 space-y-1">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Vikas Sir
                  </h3>
                  <p className="text-xs font-bold text-primary dark:text-blue-400 uppercase tracking-wider">
                    Founder & Head of Academics
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Mathematics & Science Pedagogy • Matunga Road
                  </p>
                </div>

                {/* Credentials Strip */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700/60 grid grid-cols-3 gap-2.5 text-center">
                  <div className="py-2.5 px-2 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-700/50">
                    <span className="block font-extrabold text-primary dark:text-blue-400 text-base leading-tight">18+</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Yrs Legacy</span>
                  </div>
                  <div className="py-2.5 px-2 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-700/50">
                    <span className="block font-extrabold text-emerald-600 dark:text-emerald-400 text-base leading-tight">10,000+</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Students</span>
                  </div>
                  <div className="py-2.5 px-2 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-700/50">
                    <span className="block font-extrabold text-amber-500 text-base leading-tight">98.9%</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Top Score</span>
                  </div>
                </div>

                {/* Direct Contact Button */}
                <div className="mt-4 pt-1">
                  <a
                    href="tel:8898117343"
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-700/50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-600 text-xs font-bold flex items-center justify-center gap-2 transition-all group-hover:border-primary/40 shadow-xs"
                  >
                    <PhoneCall size={14} className="text-primary dark:text-blue-400" />
                    <span>Direct Desk: 8898117343</span>
                  </a>
                </div>

              </div>
            </FadeIn>
          </div>

          {/* ── Right Column: Academic Leadership Narrative & 4-Pillars Grid ── */}
          <div className="lg:col-span-7 space-y-6">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 text-primary dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles size={14} className="text-amber-500" />
                <span>Academic Leadership & Personal Mentorship</span>
              </div>

              <h2 className="text-[28px] sm:text-[36px] md:text-[42px] font-extrabold text-slate-900 dark:text-white leading-[1.2] tracking-tight">
                Mentorship by Founder{' '}
                <span className="text-primary dark:text-blue-400 font-serif italic">
                  Vikas Sir
                </span>
              </h2>

              <p className="text-slate-600 dark:text-slate-300 font-body-lg text-base sm:text-[17px] leading-relaxed pt-1">
                At <strong className="text-slate-900 dark:text-white font-bold">Vidhya Tutorials</strong>, education is driven by deep personal commitment. Unlike large commercial factories where founders remain on billboards, <strong className="text-slate-900 dark:text-white font-semibold">Vikas Sir</strong> teaches in the classroom daily, mentoring each student across School (6th–10th) and Junior College.
              </p>
            </FadeIn>

            {/* Founder Quote Card */}
            <FadeIn delay={0.1}>
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border-l-4 border-primary dark:border-blue-400 border-y border-r border-slate-200/80 dark:border-slate-700 shadow-xs relative">
                <Quote size={24} className="text-primary/25 dark:text-blue-400/25 absolute top-3.5 right-3.5" />
                <p className="text-slate-700 dark:text-slate-200 text-sm sm:text-[15px] italic leading-relaxed font-serif pr-6">
                  “Our objective has never been just completing textbooks—it is building the conceptual confidence and analytical discipline that turns everyday learners into top board achievers.”
                </p>
                <div className="mt-2.5 flex items-center gap-2">
                  <span className="w-5 h-0.5 bg-primary/50 dark:bg-blue-400/50" />
                  <span className="text-xs font-bold uppercase tracking-wider text-primary dark:text-blue-400">
                    Vikas Tank • Founder & Academic Head
                  </span>
                </div>
              </div>
            </FadeIn>

            {/* 4 Mentorship Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {MENTORSHIP_PILLARS.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <FadeIn key={pillar.title} delay={0.08 * (idx + 1)}>
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 hover:border-primary/40 dark:hover:border-blue-400/40 transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-md h-full group">
                      <div className="space-y-2">
                        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${pillar.badgeColor} transition-transform duration-300 group-hover:scale-105`}>
                          <Icon size={18} className="stroke-[2.2]" />
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                          {pillar.title}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                          {pillar.desc}
                        </p>
                      </div>
                    </div>
                  </FadeIn>
                );
              })}
            </div>

            {/* CTAs */}
            <FadeIn delay={0.3}>
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  onClick={() => {
                    if (onScheduleCounseling) {
                      onScheduleCounseling();
                    } else {
                      setInternalCounselingOpen(true);
                    }
                  }}
                  className="px-6 py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer transition-all hover:-translate-y-0.5"
                >
                  <Calendar size={17} />
                  <span>Schedule 1-on-1 Counseling</span>
                  <ArrowRight size={17} />
                </button>

                <button
                  onClick={() => navigate('/about')}
                  className="px-5 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-all cursor-pointer flex items-center gap-2"
                >
                  <GraduationCap size={16} className="text-primary dark:text-blue-400" />
                  <span>About Our Legacy</span>
                </button>
              </div>
            </FadeIn>

          </div>

        </div>
      </div>

      {/* Embedded Counseling Modal */}
      <CounselingModal 
        isOpen={internalCounselingOpen} 
        onClose={() => setInternalCounselingOpen(false)} 
      />
    </section>
  );
}
