import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, BookOpen, GraduationCap, Sparkles, Award } from 'lucide-react';

interface WingsAccordionProps {
  onOpenFreeDemo: () => void;
  onOpenEnquiry: () => void;
}

export const WingsAccordion: React.FC<WingsAccordionProps> = ({ onOpenFreeDemo, onOpenEnquiry }) => {
  const navigate = useNavigate();
  const [activeIdx, setActiveIdx] = useState(0);

  const WINGS = [
    {
      id: 'school',
      title: 'School Wing',
      subtitle: 'Grades 6th to 10th (SSC & CBSE)',
      badge: 'Foundational Excellence',
      image: '/assets/wings/school.jpg',
      bgGradient: 'from-amber-500/20 via-yellow-500/10 to-transparent',
      cardBg: 'bg-[#1b2b48]',
      accentColor: 'text-amber-400',
      pillColor: 'bg-amber-400 text-slate-950',
      description: 'Strengthening conceptual fundamentals in Mathematics and Science. Structured homework routines, weekly prelims, and personalized doubt sessions ensure students transition from average marks to 90%+ board ranks.',
      highlights: ['Maths 1 & 2 In-depth', 'Science Theory & Practicals', 'Sunday Board Prelims'],
      wingParam: 'school'
    },
    {
      id: 'commerce',
      title: 'Commerce Wing',
      subtitle: '11th & 12th FYJC / SYJC HSC Board',
      badge: 'Board Champions',
      image: '/assets/wings/commerce.jpg',
      bgGradient: 'from-blue-600/20 via-indigo-600/10 to-transparent',
      cardBg: 'bg-[#14233c]',
      accentColor: 'text-blue-400',
      pillColor: 'bg-blue-400 text-slate-950',
      description: 'Specialized coaching in Book Keeping & Accountancy, Economics, Secretarial Practice (SP), and Mathematics. Led by Vinayak Sir & expert faculty, producing 99/100 and 100/100 subject scores consistently.',
      highlights: ['Book Keeping & Accounts', 'Economics & SP Guidance', 'Board Paper Presentation Drills'],
      wingParam: 'commerce'
    },
    {
      id: 'science',
      title: 'Science Wing',
      subtitle: '11th & 12th PCM, PCB & PCMB',
      badge: '✨ Newly Launched 2026',
      image: '/assets/wings/science.jpg',
      bgGradient: 'from-cyan-500/20 via-teal-500/10 to-transparent',
      cardBg: 'bg-[#0e273f]',
      accentColor: 'text-cyan-400',
      pillColor: 'bg-cyan-400 text-slate-950',
      description: 'Comprehensive physics, chemistry, biology, and higher mathematics coaching. Designed with modern laboratory tie-ups, formula sheets, and numerical shortcut drills for Maharashtra Board excellence.',
      highlights: ['Physics & Chemistry Numericals', 'Biology Diagrams & Concept Notes', 'Formula Workshops'],
      wingParam: 'science'
    },
    {
      id: 'neet-cet',
      title: 'MHT-CET & Entrance',
      subtitle: 'Engineering & Medical Prep',
      badge: 'Competitive Edge',
      image: '/assets/wings/neet.jpg',
      bgGradient: 'from-emerald-500/20 via-green-500/10 to-transparent',
      cardBg: 'bg-[#112d2b]',
      accentColor: 'text-emerald-400',
      pillColor: 'bg-emerald-400 text-slate-950',
      description: 'Targeted speed and accuracy training for State Entrance Examinations. Timed mock tests, previous year question analysis, and formula memorization strategies for top Mumbai college admissions.',
      highlights: ['Timed MCQ Drills', 'Previous 10 Years Solved Papers', 'Percentile Booster Strategy'],
      wingParam: 'neet'
    }
  ];

  return (
    <section className="max-w-[1280px] mx-auto w-full my-8" id="wings">
      <div className="bg-[#071326] rounded-3xl shadow-2xl border border-blue-500/20 p-6 sm:p-10 md:p-14 relative overflow-hidden text-white">
        
        {/* Ambient Top Lighting */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/15 text-blue-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles size={14} className="text-amber-400" />
            <span>Curated Academic Paths</span>
          </span>
          <h2 className="font-h1 text-[30px] sm:text-[40px] font-extrabold tracking-tight">
            Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-400">Academic Wings</span>
          </h2>
          <div className="h-1.5 w-24 bg-gradient-to-r from-amber-400 to-blue-500 mx-auto rounded-full mt-3 mb-4"></div>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Tailored learning wings designed to build deep conceptual clarity, disciplined study habits, and top board results from Grade 6th to 12th Std.
          </p>
        </div>

        {/* ── Expandable Interactive Cards (Inspired directly by inspo.mp4.mp4) ── */}
        <div className="hidden lg:flex gap-4 h-[480px] w-full">
          {WINGS.map((wing, idx) => {
            const isActive = activeIdx === idx;

            return (
              <motion.div
                key={wing.id}
                onClick={() => setActiveIdx(idx)}
                layout
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className={`relative rounded-3xl overflow-hidden cursor-pointer border transition-all duration-500 flex flex-col justify-between ${
                  isActive 
                    ? 'flex-[2.5] border-amber-400/60 shadow-2xl bg-gradient-to-b from-[#102444] to-[#0a172c]' 
                    : 'flex-1 border-white/10 hover:border-white/30 bg-[#0c1c33]/70 hover:bg-[#102444]'
                }`}
              >
                {/* Background Image Container */}
                <div className={`relative w-full overflow-hidden transition-all duration-500 ${isActive ? 'h-[230px]' : 'h-[280px]'}`}>
                  <img 
                    src={wing.image} 
                    alt={wing.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a172c] via-transparent to-black/30" />

                  {/* Top Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider shadow-md ${wing.pillColor}`}>
                      {wing.badge}
                    </span>
                  </div>

                  {/* Arrow Icon in Top Right */}
                  <div className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    isActive ? 'bg-amber-400 text-slate-950' : 'bg-black/60 text-white'
                  }`}>
                    <ArrowUpRight size={18} />
                  </div>
                </div>

                {/* Content Block */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className={`font-extrabold text-xl mb-1 ${isActive ? 'text-white text-2xl' : 'text-slate-200'}`}>
                      {wing.title}
                    </h3>
                    <p className={`text-xs font-semibold ${wing.accentColor} mb-3`}>
                      {wing.subtitle}
                    </p>

                    {/* Expandable text shown when active */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-3"
                        >
                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            {wing.description}
                          </p>

                          {/* Highlights Pills */}
                          <div className="flex flex-wrap gap-2 pt-1">
                            {wing.highlights.map((h, i) => (
                              <span key={i} className="px-2.5 py-1 rounded-lg bg-white/10 text-slate-200 text-[11px] font-medium border border-white/10">
                                ✓ {h}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Bottom Action when active */}
                  {isActive && (
                    <div className="pt-4 flex items-center gap-3 border-t border-white/10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/courses?wing=${wing.wingParam}`);
                        }}
                        className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>View All Subjects</span>
                        <ArrowUpRight size={14} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenFreeDemo();
                        }}
                        className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all shadow-md cursor-pointer"
                      >
                        Book Demo
                      </button>
                    </div>
                  )}

                  {!isActive && (
                    <span className="text-[11px] text-slate-400 font-medium">
                      Click to expand wing details →
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Mobile / Tablet Accordion View ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
          {WINGS.map((wing) => (
            <div 
              key={wing.id}
              onClick={() => navigate(`/courses?wing=${wing.wingParam}`)}
              className="rounded-2xl bg-[#0c1c33] border border-white/15 overflow-hidden shadow-lg group cursor-pointer"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <img src={wing.image} alt={wing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c1c33] via-transparent to-black/30" />
                <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${wing.pillColor}`}>
                  {wing.badge}
                </span>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-white">{wing.title}</h3>
                  <ArrowUpRight size={18} className="text-amber-400" />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {wing.description}
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenFreeDemo();
                    }}
                    className="w-full py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold shadow-sm"
                  >
                    Book Free Demo
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
