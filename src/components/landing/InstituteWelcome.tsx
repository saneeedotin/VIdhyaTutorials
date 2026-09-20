import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ShieldCheck, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  ArrowRight,
  GraduationCap,
  Users2
} from 'lucide-react';

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string, key?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export function InstituteWelcome() {
  const navigate = useNavigate();

  const HIGHLIGHTS = [
    {
      icon: BookOpen,
      title: 'Concept-First Learning',
      desc: 'Deep focus on core fundamentals so students can solve any board or competitive problem with confidence.',
      badgeStyle: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30',
      hoverBorder: 'hover:border-amber-400/60 dark:hover:border-amber-400/50',
      hoverTitle: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
    },
    {
      icon: Users2,
      title: 'Personal Faculty Mentorship',
      desc: 'Small interactive batches ensuring every student receives 1-on-1 attention and regular doubt-solving.',
      badgeStyle: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30',
      hoverBorder: 'hover:border-emerald-400/60 dark:hover:border-emerald-400/50',
      hoverTitle: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
    },
    {
      icon: Award,
      title: 'Rigorous Test Series',
      desc: 'Weekly assessments, chapter-end evaluations, and full prelim papers aligned with the latest board patterns.',
      badgeStyle: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30',
      hoverBorder: 'hover:border-blue-400/60 dark:hover:border-blue-400/50',
      hoverTitle: 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
    },
    {
      icon: BookOpen,
      title: 'Study Material & Test Series',
      desc: 'Comprehensive chapter notes, formula sheets, previous 10 years board paper banks, and weekly prelim drills.',
      badgeStyle: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30',
      hoverBorder: 'hover:border-purple-400/60 dark:hover:border-purple-400/50',
      hoverTitle: 'group-hover:text-purple-600 dark:group-hover:text-purple-400',
    }
  ];

  return (
    <section className="max-w-[1280px] mx-auto relative overflow-hidden" id="about-institute">
      <div className="bg-white dark:bg-[#071326] rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-10 md:p-14 lg:p-16 relative overflow-hidden">
        
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* ── Left Column: Official Logo Crest Showcase ── */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <FadeIn className="w-full max-w-[420px] relative">
              
              {/* Outer Decorative Glow Border */}
              <div className="relative rounded-3xl p-1 bg-gradient-to-b from-primary/30 via-secondary/20 to-primary/30 shadow-2xl group">
                
                {/* Inner Plaque Container */}
                <div className="relative rounded-[22px] bg-white dark:bg-slate-900/95 p-6 sm:p-8 flex flex-col items-center text-center shadow-inner overflow-hidden">

                  {/* The Official Vidhya Tutorials Logo Photo */}
                  <div className="relative w-full max-w-[300px] bg-white rounded-2xl p-4 sm:p-6 shadow-md border border-slate-100 flex items-center justify-center transition-transform duration-500 group-hover:scale-[1.03]">
                    <img
                      src="/vidhya-tutorials-logo.png"
                      alt="Vidhya Tutorials — Official Logo & Educational Insignia"
                      className="w-full h-auto max-h-[190px] object-contain drop-shadow-sm"
                      loading="lazy"
                    />
                  </div>

                  {/* Plaque Caption */}
                  <div className="mt-6 space-y-1.5">
                    <h3 className="font-h3 text-xl font-bold text-slate-800 dark:text-white tracking-tight">
                      Vidhya Tutorials
                    </h3>
                    <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-[280px]">
                      A Premier Educational Institution Committed to Academic Excellence & Moral Character
                    </p>
                  </div>

                  {/* Trust Footer Pills */}
                  <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 w-full flex items-center justify-around text-center text-xs">
                    <div>
                      <div className="font-bold text-primary dark:text-blue-400 text-sm">15+ Yrs</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">Legacy</div>
                    </div>
                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
                    <div>
                      <div className="font-bold text-secondary dark:text-blue-300 text-sm">10,000+</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">Students</div>
                    </div>
                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
                    <div>
                      <div className="font-bold text-amber-500 text-sm">98.9%</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">Top Score</div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Bottom Floating Badge */}
              <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span>Government Recognized Maharashtra Board Curriculum</span>
              </div>

            </FadeIn>
          </div>

          {/* ── Right Column: Welcome Narrative & Value Pillars ── */}
          <div className="lg:col-span-7 space-y-6">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-2 border border-primary/20">
                <GraduationCap size={15} />
                <span>Welcome to Vidhya Tutorials</span>
              </div>

              <h2 className="font-h1 text-[30px] sm:text-[38px] md:text-[44px] font-bold text-slate-900 dark:text-white leading-[1.18] tracking-tight">
                Empowering Students with <span className="text-primary dark:text-blue-400 italic">Confidence</span> & Exam Mastery
              </h2>

              <p className="text-slate-600 dark:text-slate-300 font-body-lg text-base sm:text-lg leading-relaxed pt-1">
                At <strong className="text-slate-900 dark:text-white font-semibold">Vidhya Tutorials</strong>, education transcends rote textbook learning. We foster analytical curiosity, discipline, and conceptual clarity across School (Grades 6–10), Junior College Commerce & Science, and competitive entrance coaching.
              </p>
            </FadeIn>

            {/* Value Pillars Grid (Fixed High-Contrast & Vibrant Palette) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {HIGHLIGHTS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <FadeIn key={item.title} delay={0.08 * (idx + 1)}>
                    <div className={`p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#0c1a30] border border-slate-200/90 dark:border-slate-800/90 shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.25)] ${item.hoverBorder} transition-all duration-300 group h-full flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md`}>
                      <div className="flex items-start gap-3.5">
                        <div className={`w-10 h-10 rounded-xl ${item.badgeStyle} flex items-center justify-center shrink-0 shadow-xs transition-transform duration-300 group-hover:scale-110`}>
                          <Icon size={19} />
                        </div>
                        <div>
                          <h4 className={`font-bold text-sm sm:text-[15px] text-slate-900 dark:text-white ${item.hoverTitle} transition-colors tracking-tight`}>
                            {item.title}
                          </h4>
                          <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed mt-1.5 font-normal">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  </FadeIn>
                );
              })}
            </div>

            {/* CTAs */}
            <FadeIn delay={0.35}>
              <div className="flex flex-wrap items-center gap-3.5 pt-3">
                <button
                  onClick={() => navigate('/courses')}
                  className="px-6 py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-white dark:text-[#001b3c] font-bold text-sm shadow-lg flex items-center gap-2 cursor-pointer transition-all hover:scale-105 btn-magnetic"
                >
                  <span>Explore Academic Wings</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </FadeIn>

          </div>

        </div>
      </div>
    </section>
  );
}
