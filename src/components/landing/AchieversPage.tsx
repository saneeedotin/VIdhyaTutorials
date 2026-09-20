import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Sparkles,
  ArrowRight,
  Maximize2,
  X,
  GraduationCap,
  Trophy
} from 'lucide-react';

interface Achiever {
  id: string;
  name: string;
  exam: string;
  category: 'HSC' | 'SSC' | 'SCHOOL';
  overallScore: string;
  badge: string;
  subjects: { name: string; score: string }[];
  schoolOrCollege?: string;
  posterImage?: string;
}

const achieversList: Achiever[] = [
  {
    id: 'tisha-kumbhar',
    name: 'Tisha Kumbhar',
    exam: 'HSC Commerce Board Exam',
    category: 'HSC',
    overallScore: '92.33%',
    badge: 'HSC Super Topper',
    schoolOrCollege: 'Junior College',
    posterImage: '/assets/high-scorers/scorer4.png',
    subjects: [
      { name: 'Mathematics', score: '99 / 100' },
      { name: 'Book Keeping (B.K)', score: '96 / 100' }
    ]
  },
  {
    id: 'meet-devaliya',
    name: 'Meet Devaliya',
    exam: 'SSC 10th Board Exam',
    category: 'SSC',
    overallScore: '87.20%',
    badge: 'SSC Star Ranker',
    posterImage: '/assets/high-scorers/scorer2.png',
    subjects: [
      { name: 'Mathematics', score: '95%' },
      { name: 'Science', score: '95%' }
    ]
  },
  {
    id: 'pragati-tank',
    name: 'Pragati Tank',
    exam: 'HSC Commerce Board',
    category: 'HSC',
    overallScore: '93.50%',
    badge: 'Top Scorer in Accounts',
    posterImage: '/scorer3.png',
    subjects: [
      { name: 'Book Keeping (B.K)', score: '96%' },
      { name: 'Mathematics', score: '91%' }
    ]
  },
  {
    id: 'hardik-chauhan',
    name: 'Hardik Chauhan',
    exam: 'HSC Commerce Board',
    category: 'HSC',
    overallScore: '92.80%',
    badge: 'Distinction in OCM & IT',
    posterImage: '/scorer3.png',
    subjects: [
      { name: 'OCM', score: '95%' },
      { name: 'Information Tech (IT)', score: '91%' }
    ]
  },
  {
    id: 'tisha-wala',
    name: 'Tisha Wala',
    exam: 'SSC 10th Board Exam',
    category: 'SSC',
    overallScore: '95.50%',
    badge: '98% in Mathematics',
    posterImage: '/scorer1.png',
    subjects: [
      { name: 'Mathematics', score: '98%' },
      { name: 'Science', score: '93%' }
    ]
  },
  {
    id: 'riddhi-jethwa',
    name: 'Riddhi Jethwa',
    exam: 'HSC Commerce Board',
    category: 'HSC',
    overallScore: '91.20%',
    badge: 'OCM & SP Distinction',
    posterImage: '/scorer3.png',
    subjects: [
      { name: 'OCM', score: '94%' },
      { name: 'Secretarial Practice (S.P)', score: '90%' }
    ]
  },
  {
    id: 'yash-tank',
    name: 'Yash Tank',
    exam: 'SSC 10th Board Exam',
    category: 'SSC',
    overallScore: '89.50%',
    badge: 'Maths & Science High Scorer',
    posterImage: '/scorer1.png',
    subjects: [
      { name: 'Mathematics', score: '92%' },
      { name: 'Science', score: '87%' }
    ]
  },
  {
    id: 'madhav-wadhel',
    name: 'Madhav Wadhel',
    exam: 'Class 9th Final Exam',
    category: 'SCHOOL',
    overallScore: '96.00%',
    badge: '100% in Algebra',
    schoolOrCollege: 'Matunga Premier School',
    posterImage: '/scorer5.png',
    subjects: [
      { name: 'Algebra', score: '20 / 20' },
      { name: 'Geometry', score: '19 / 20' },
      { name: 'Science', score: '19 / 20' }
    ]
  },
  {
    id: 'nirav-savaniya',
    name: 'Nirav Savaniya',
    exam: 'SSC 10th Board Exam',
    category: 'SSC',
    overallScore: '88.60%',
    badge: 'Maths Distinction',
    posterImage: '/scorer1.png',
    subjects: [
      { name: 'Mathematics', score: '90%' },
      { name: 'Science', score: '87%' }
    ]
  },
  {
    id: 'pasi-priya',
    name: 'Pasi Priya Banarasi',
    exam: 'HSC Commerce Board',
    category: 'HSC',
    overallScore: '89.20%',
    badge: 'Commerce Ranker',
    posterImage: '/scorer3.png',
    subjects: [
      { name: 'OCM', score: '91%' },
      { name: 'Economics (ECO)', score: '87%' }
    ]
  }
];

const officialPosters = [
  {
    title: 'HSC Commerce Board Results',
    sub: 'Pragati Tank (BK 96%), Hardik Chauhan (OCM 95%), Riddhi Jethwa (OCM 94%), Pasi Priya (OCM 91%)',
    src: '/scorer3.png',
    tag: '12th HSC'
  },
  {
    title: 'Tisha Kumbhar — 92.33% in HSC',
    sub: 'Scored 99/100 in Mathematics and 96/100 in Book Keeping',
    src: '/scorer4.png',
    tag: '12th HSC'
  },
  {
    title: 'SSC 10th Board High Scorers Batch',
    sub: 'Tisha Wala (98% Maths), Meet Devaliya (95% Maths/Sci), Yash Tank (92%), Nirav Savaniya (90%), Hiral Chitroda',
    src: '/scorer1.png',
    tag: '10th SSC'
  },
  {
    title: 'Meet Devaliya — 87.20% in SSC',
    sub: 'Outstanding performance in Maharashtra SSC State Board',
    src: '/scorer2.png',
    tag: '10th SSC'
  },
  {
    title: 'Madhav Wadhel — Class 9th Topper',
    sub: 'Matunga Premier School — 20/20 in Algebra, 19/20 in Geometry, 19/20 in Science',
    src: '/scorer5.png',
    tag: 'Class 9th'
  }
];

export function AchieversPage() {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'HSC' | 'SSC' | 'SCHOOL'>('ALL');
  const [selectedPoster, setSelectedPoster] = useState<string | null>(null);

  const filteredAchievers = achieversList.filter(item => {
    if (selectedFilter === 'ALL') return true;
    return item.category === selectedFilter;
  });

  return (
    <div className="bg-surface-container-low min-h-screen font-body-md text-on-surface overflow-x-hidden flex flex-col w-full">
      
      {/* 1. Hero Banner */}
      <section className="relative w-full pt-28 sm:pt-36 pb-12 sm:pb-16 px-4 md:px-[64px] overflow-hidden bg-primary text-white text-center">
        <div className="relative z-10 max-w-[1280px] mx-auto">
          <span className="inline-block px-3.5 py-1.5 bg-secondary/20 text-secondary border border-secondary/30 rounded-full text-[11px] sm:text-data-label font-data-label mb-3 sm:mb-4 tracking-widest uppercase">
            ✨ Academic Excellence & Toppers
          </span>
          <h1 className="text-3xl sm:text-[44px] md:text-[56px] font-bold text-white leading-tight tracking-[-0.02em] mb-3">
            Wall of <span className="italic text-secondary font-serif">Achievers</span>
          </h1>
          <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-normal">
            Celebrating our board rankers, subject toppers, and students who turned consistent hard work into extraordinary milestones.
          </p>
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto w-full px-3.5 sm:px-6 md:px-[64px] py-10 sm:py-16 space-y-12 sm:space-y-16">

        {/* ── 2. Official High-Scorer Posters Gallery ── */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 border-b border-outline-variant/20 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-1.5">
                <Sparkles size={14} />
                <span>Original Results Gallery</span>
              </span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-on-surface mt-1">
                Official Board Results & Posters
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-md">
              Click any poster below to zoom in and view official marks and roll honor cards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {officialPosters.map(poster => (
              <motion.div
                key={poster.title}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedPoster(poster.src)}
                className="group relative bg-surface rounded-2xl overflow-hidden border border-outline-variant/30 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col"
              >
                <div className="relative aspect-[4/3] bg-black/5 overflow-hidden">
                  <img
                    src={poster.src}
                    alt={poster.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/scorer1.png';
                    }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/20 backdrop-blur-md text-white text-xs font-bold">
                      <Maximize2 size={13} />
                      <span>Click to Enlarge</span>
                    </span>
                  </div>
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary text-white shadow-sm">
                    {poster.tag}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors">
                      {poster.title}
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-1 leading-relaxed line-clamp-2">
                      {poster.sub}
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs text-primary font-bold">
                    <span>View Honor Poster</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── 3. Individual Achievers Honor Roll ── */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/20 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Student Honor Roll</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface mt-1">
                Outstanding Individual Performers
              </h2>
            </div>

            {/* Filter Tabs with horizontal swipe on mobile */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar touch-pan-x flex-nowrap sm:flex-wrap">
              {[
                { key: 'ALL', label: 'All Achievers' },
                { key: 'HSC', label: '12th HSC' },
                { key: 'SSC', label: '10th SSC' },
                { key: 'SCHOOL', label: 'School Section' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedFilter(tab.key as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap min-h-[38px] ${
                    selectedFilter === tab.key
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-surface hover:bg-surface-container text-on-surface-variant border border-outline-variant/30'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAchievers.map(achiever => (
              <motion.div
                key={achiever.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-surface rounded-2xl p-5 border border-outline-variant/30 shadow-sm hover:shadow-lg transition-all space-y-4 relative overflow-hidden group"
              >
                {/* Top Badge Strip */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center text-sm border border-primary/20">
                      <GraduationCap size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-on-surface group-hover:text-primary transition-colors">
                        {achiever.name}
                      </h3>
                      <p className="text-[11px] text-on-surface-variant font-medium">
                        {achiever.exam}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xl font-black text-primary font-mono block leading-none">
                      {achiever.overallScore}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-on-surface-variant font-bold">
                      Board Score
                    </span>
                  </div>
                </div>

                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                  <Star size={12} className="fill-current" />
                  <span>{achiever.badge}</span>
                </div>

                {/* Subject breakdown */}
                <div className="bg-surface-container-low rounded-xl p-3 border border-outline-variant/20 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">
                    Subject Highlights:
                  </span>
                  {achiever.subjects.map(sub => (
                    <div key={sub.name} className="flex justify-between items-center text-xs">
                      <span className="text-on-surface font-medium">{sub.name}</span>
                      <span className="font-mono font-bold text-primary">{sub.score}</span>
                    </div>
                  ))}
                </div>

                {/* View Poster button if available */}
                {achiever.posterImage && (
                  <button
                    type="button"
                    onClick={() => setSelectedPoster(achiever.posterImage || null)}
                    className="w-full py-2 px-3 rounded-xl border border-outline-variant/40 hover:border-primary text-xs font-bold text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Maximize2 size={12} />
                    <span>View Official Scorecard Poster</span>
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── 4. Call To Action (Join the next achievers batch) ── */}
        <section className="rounded-3xl bg-gradient-to-r from-[#001b3c] via-[#0f3568] to-[#1f406d] text-white p-8 md:p-14 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-block px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full text-xs font-bold uppercase tracking-wider border border-amber-400/30">
              Admissions Open 2026-27
            </span>
            <h2 className="text-3xl md:text-4xl font-black leading-tight">
              Ready to write your own <span className="text-amber-300 italic">success story</span>?
            </h2>
            <p className="text-white/80 text-sm md:text-base leading-relaxed">
              Join Vidhya Tutorials today. Get expert coaching, chapter-wise test series, continuous mentor support, and structured notes that have produced toppers year after year.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/apply')}
                className="px-8 py-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105"
              >
                <span>Apply for Admission</span>
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate('/about')}
                className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 cursor-pointer transition-all"
              >
                <span>Schedule Free Counseling</span>
              </button>
            </div>
          </div>
        </section>

      </div>

      {/* ── Lightbox Modal for Enlarge Poster ── */}
      <AnimatePresence>
        {selectedPoster && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full max-h-[90vh] bg-surface rounded-2xl overflow-hidden shadow-2xl border border-white/20 flex flex-col"
            >
              <div className="p-3 bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Trophy size={14} />
                  <span>Vidhya Tutorials Official Result Honor Poster</span>
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedPoster(null)}
                  className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="overflow-auto max-h-[80vh] flex items-center justify-center p-2 bg-black/40">
                <img
                  src={selectedPoster}
                  alt="High Scorer Poster"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/scorer1.png';
                  }}
                  className="max-h-[76vh] w-auto object-contain rounded-lg shadow-lg"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
