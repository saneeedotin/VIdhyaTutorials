import React, { useState, ReactNode, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useLocation, Link } from 'react-router-dom';
import { ScrollTicker } from '../ui/ScrollTicker';
import { EnquiryModal } from '../ui/EnquiryModal';

const FadeInWhenVisible = ({ children, delay = 0, className = "" }: { children: ReactNode, delay?: number, className?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export interface CourseItem {
  id: string;
  grade: string;
  subtitle: string;
  wing: 'school' | 'commerce' | 'science' | 'neet' | 'test-series';
  wingLabel: string;
  badgeColor: string;
  icon: string;
  subjects: string[];
  standardParam?: string;
  streamParam?: string;
  description?: string;
}

const allCourses: CourseItem[] = [
  // ═══════════════ SCHOOL SECTION (6th to 10th) ═══════════════
  {
    id: 'school-6th',
    grade: '6th Standard',
    subtitle: 'Class 6 Foundation',
    wing: 'school',
    wingLabel: 'School Section',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
    icon: 'school',
    subjects: ['Maths', 'Science', 'History', 'Geography', 'English', 'Hindi', 'Marathi'],
    standardParam: '6th',
    description: 'Comprehensive foundational batch covering core state & national curriculum subjects.'
  },
  {
    id: 'school-7th',
    grade: '7th Standard',
    subtitle: 'Class 7 Conceptual Prep',
    wing: 'school',
    wingLabel: 'School Section',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
    icon: 'school',
    subjects: ['Maths', 'Science', 'History', 'Geography', 'English', 'Hindi', 'Marathi'],
    standardParam: '7th',
    description: 'Strengthening problem solving in mathematics, science, and comprehensive language skills.'
  },
  {
    id: 'school-8th',
    grade: '8th Standard',
    subtitle: 'Class 8 High School Prep',
    wing: 'school',
    wingLabel: 'School Section',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
    icon: 'school',
    subjects: ['Maths', 'Science', 'History', 'Geography', 'English', 'Hindi', 'Marathi'],
    standardParam: '8th',
    description: 'Rigorous preparation bridging middle school basics with high school board rigor.'
  },
  {
    id: 'school-9th',
    grade: '9th Standard',
    subtitle: 'Class 9 Pre-Board Foundations',
    wing: 'school',
    wingLabel: 'School Section',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
    icon: 'school',
    subjects: ['Maths 1', 'Maths 2', 'Science 1', 'Science 2', 'History', 'Geography', 'English', 'Hindi', 'Marathi', 'Tamil'],
    standardParam: '9th',
    description: 'Bifurcated Maths & Science curriculum with extensive language coaching and test series.'
  },
  {
    id: 'school-10th',
    grade: '10th Standard',
    subtitle: 'Class 10 Board Excellence',
    wing: 'school',
    wingLabel: 'School Section',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
    icon: 'workspace_premium',
    subjects: ['Maths 1', 'Maths 2', 'Science 1', 'Science 2', 'History', 'Geography', 'English', 'Hindi', 'Marathi', 'Tamil'],
    standardParam: '10th',
    description: 'Intensive SSC & CBSE board preparation batch with chapter-wise tests and preliminary model exams.'
  },

  // ═══════════════ COMMERCE WING (11th & 12th) ═══════════════
  {
    id: 'commerce-11th',
    grade: '11th Commerce',
    subtitle: 'Financial & Business Foundations',
    wing: 'commerce',
    wingLabel: 'Commerce Wing',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
    icon: 'account_balance',
    subjects: [
      'Book Keeping - Accountancy',
      'OCM (Organisation of Commerce & Management)',
      'Maths 1',
      'Maths 2',
      'Economics',
      'English',
      'SP (Secretarial Practice)'
    ],
    standardParam: '11th',
    streamParam: 'Commerce',
    description: 'Foundational commerce batch focusing on fundamentals of accounting, management principles, financial literacy, and mathematics.'
  },
  {
    id: 'commerce-12th',
    grade: '12th Commerce',
    subtitle: 'HSC Board & Professional Foundations',
    wing: 'commerce',
    wingLabel: 'Commerce Wing',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
    icon: 'trending_up',
    subjects: [
      'Book Keeping - Accountancy',
      'OCM (Organisation of Commerce & Management)',
      'Maths 1',
      'Maths 2',
      'Economics',
      'English',
      'SP (Secretarial Practice)'
    ],
    standardParam: '12th',
    streamParam: 'Commerce',
    description: 'Specialized HSC board preparation with extensive partnership accounts, company accounts, case studies, and full prelim test series.'
  },

  // ═══════════════ SCIENCE WING (11th & 12th) ═══════════════
  {
    id: 'science-11th',
    grade: '11th Science',
    subtitle: '✨ Newly Introduced 2026 • PCM, PCB & PCMB',
    wing: 'science',
    wingLabel: 'Science Wing',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30',
    icon: 'biotech',
    subjects: [
      'Physics (Kinematics, Laws of Motion, Thermodynamics & Electromagnetism)',
      'Chemistry (Chemical Bonding, Organic Chemistry, Thermodynamics & Redox Reactions)',
      'English (Mandatory language subject for all science students)',
      'Mathematics (Core subject for PCM / Engineering & Architecture)',
      'Biology (Core subject for PCB / Medical Careers)',
      'PCMB Combination (Physics, Chemistry, Maths & Biology to keep both streams open)'
    ],
    standardParam: '11th',
    streamParam: 'Science',
    description: 'Newly launched in 2026: Divided into PCM (Engineering), PCB (Medical), and PCMB with rigorous theory, laboratory practicals, and conceptual coaching.'
  },
  {
    id: 'science-12th',
    grade: '12th Science',
    subtitle: '✨ Newly Introduced 2026 • HSC Board & Entrance Sync',
    wing: 'science',
    wingLabel: 'Science Wing',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30',
    icon: 'science',
    subjects: [
      'Physics (Electrodynamics, Wave Optics, Modern Physics & Practicals)',
      'Chemistry (Organic Synthesis, Chemical Kinetics, Coordination Compounds & Physical Chem)',
      'English (Mandatory language & communication skills)',
      'Mathematics (Calculus, Vectors, 3D Geometry & Probability for PCM)',
      'Biology (Genetics, Human Physiology, Biotechnology & Ecology for PCB)',
      'PCM / PCB / PCMB Board Exam Simulations & Practical Journals'
    ],
    standardParam: '12th',
    streamParam: 'Science',
    description: 'Newly launched in 2026: Advanced board preparation synchronized with competitive entrance foundations for PCM (CET), PCB (NEET), and PCMB students.'
  },

  // ═══════════════ NEET / CET ENTRANCE WING ═══════════════
  {
    id: 'neet-target',
    grade: 'NEET-UG Target Batch',
    subtitle: 'Medical Entrance Mastery',
    wing: 'neet',
    wingLabel: 'NEET / CET Wing',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-400/30',
    icon: 'medical_services',
    subjects: ['NCERT Line-by-Line Biology', 'High-Yield Physics Problem Solving', 'Physical, Inorganic & Organic Chem', 'Daily Practice Papers (DPPs)', '50+ Full Syllabus OMR Mock Tests'],
    standardParam: '12th',
    streamParam: 'Science',
    description: 'Specialized medical coaching with negative-marking avoidance strategies and all-India ranking benchmarks.'
  },
  {
    id: 'cet-target',
    grade: 'MHT-CET Target Batch',
    subtitle: 'Engineering & Pharmacy Entrance',
    wing: 'neet',
    wingLabel: 'NEET / CET Wing',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-400/30',
    icon: 'engineering',
    subjects: ['Speed & Accuracy Shortcuts', 'Advanced Mathematics & Calculus', 'Mechanics & Electrodynamics', 'Past 15 Years Question Bank', 'Computer-Based Test (CBT) Mock Simulations'],
    standardParam: '12th',
    streamParam: 'Science',
    description: 'Specialized state entrance batch focused on top percentiles for Maharashtra engineering and pharmacy colleges.'
  },
  {
    id: 'repeater-batch',
    grade: 'Crash Course & Repeaters Batch',
    subtitle: 'Intensive Rank Booster Program',
    wing: 'neet',
    wingLabel: 'NEET / CET Wing',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-400/30',
    icon: 'bolt',
    subjects: ['Full-Syllabus Rapid Fire Revision', 'Error Analysis & Formula Sheets', 'Personal 1-on-1 Faculty Mentorship', 'Weekly Grand Entrance Mock Tests'],
    standardParam: '12th',
    streamParam: 'Science',
    description: 'Dedicated revision course designed to maximize score improvements and eliminate weak areas.'
  },

  // ═══════════════ TEST SERIES & MOCK EXAMS WING ═══════════════
  {
    id: 'test-series-10th',
    grade: '10th Board Prelim Series',
    subtitle: 'SSC & CBSE Board Simulations',
    wing: 'test-series',
    wingLabel: 'Test Series',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
    icon: 'assignment_turned_in',
    subjects: [
      'Chapter-wise Weekly Unit Tests',
      '3 Full Rounds of Board Prelim Simulations',
      'SSC & CBSE Examiner Verified Model Answers',
      'Time Management & Handwriting Scoring Techniques',
      'Personal Doubt Solving & Answer Sheet Analysis'
    ],
    standardParam: '10th',
    description: 'Comprehensive board prelim test series designed to eliminate exam anxiety, improve writing speed, and ensure 90%+ scores in SSC & CBSE.'
  },
  {
    id: 'test-series-12th',
    grade: '12th HSC Board Prelim Series',
    subtitle: 'Commerce & Science Test Series',
    wing: 'test-series',
    wingLabel: 'Test Series',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
    icon: 'quiz',
    subjects: [
      'Accounts, Maths & Science Step-by-Step Scoring Tests',
      'Physics, Chemistry & Biology Model Paper Simulations',
      'Compulsory English & Language Paper Writing',
      'Rigorous HSC Board Examiner Evaluation & Corrections',
      'Detailed Subject-Wise Error Rectification Sessions'
    ],
    standardParam: '12th',
    description: 'Intensive board-level test series for 12th Commerce & Science students with verified marking schemes and performance diagnostics.'
  },
  {
    id: 'test-series-entrance',
    grade: 'NEET & MHT-CET Mock Series',
    subtitle: 'OMR & CBT National Level Simulation',
    wing: 'test-series',
    wingLabel: 'Test Series',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
    icon: 'timer',
    subjects: [
      '50+ Full-Length All-India OMR & CBT Mock Tests',
      'Negative Marking Control & Elimination Strategies',
      'Subject-Wise Speed & Accuracy Benchmarking',
      'In-Depth Question Bank with Past 15 Years Solutions',
      'Detailed Percentile & All-India Rank (AIR) Analytics'
    ],
    standardParam: '12th',
    streamParam: 'Science',
    description: 'High-yield competitive mock test series simulating real entrance exam pressure for aspiring doctors and engineers.'
  }
];

const wingTabs = [
  { id: 'all', label: 'All Programs', icon: 'apps', count: allCourses.length },
  { id: 'school', label: 'School Section (6th - 10th)', icon: 'school', count: 5 },
  { id: 'commerce', label: 'Commerce (11th & 12th)', icon: 'account_balance', count: 2 },
  { id: 'science', label: 'Science (11th & 12th)', icon: 'biotech', count: 2 },
  { id: 'neet', label: 'NEET / CET', icon: 'military_tech', count: 3 },
  { id: 'test-series', label: 'Test Series & Mock', icon: 'assignment_turned_in', count: 3 },
];

export function OurCoursesPage() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [selectedCourseForEnquiry, setSelectedCourseForEnquiry] = useState<CourseItem | null>(null);
  const currentWingParam = (searchParams.get('wing') || 'all').toLowerCase();

  const activeWing = useMemo(() => {
    if (['school', 'commerce', 'science', 'neet', 'test-series'].includes(currentWingParam)) {
      return currentWingParam;
    }
    return 'all';
  }, [currentWingParam]);

  // Smooth scroll to the courses wing section whenever query or hash activates a wing
  useEffect(() => {
    const wing = searchParams.get('wing');
    if (wing || location.hash === '#wings') {
      const timer = setTimeout(() => {
        const el = document.getElementById('wings');
        if (el) {
          const yOffset = -90;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [searchParams, location.hash]);

  const filteredCourses = useMemo(() => {
    if (activeWing === 'all') return allCourses;
    return allCourses.filter(c => c.wing === activeWing);
  }, [activeWing]);

  const handleSelectWing = (tabId: string) => {
    if (tabId === 'all') {
      searchParams.delete('wing');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ wing: tabId });
    }
  };

  const getWingTitle = () => {
    switch (activeWing) {
      case 'school':
        return 'School Section (Standards 6th to 10th)';
      case 'commerce':
        return 'Commerce Section (11th & 12th Standards)';
      case 'science':
        return 'Science Section (11th & 12th - PCM / PCB / PCMB)';
      case 'neet':
        return 'NEET & MHT-CET Entrance Batches';
      case 'test-series':
        return 'Test Series & Board Prelim Mock Exams';
      default:
        return 'All Academic Batches & Programs';
    }
  };

  const getWingDescription = () => {
    switch (activeWing) {
      case 'school':
        return 'Tailored foundational learning exclusively covering classes 6th, 7th, 8th, 9th, and 10th SSC & CBSE boards.';
      case 'commerce':
        return 'Specialized commerce batches focusing on Accountancy, Economics, OCM, and preparation for CA/CS/BBA.';
      case 'science':
        return 'Science stream in Class 11 & 12 divided into core combinations: PCM for engineering & architecture, PCB for medical careers, and PCMB for dual flexibility. Compulsory: Physics, Chemistry & English + Maths or Biology.';
      case 'neet':
        return 'Comprehensive entrance coaching for medical (NEET-UG) and engineering/pharmacy (MHT-CET) aspirants.';
      case 'test-series':
        return 'Dedicated unit tests, 3 full rounds of board preliminary examinations, and all-India level OMR/CBT mock tests with detailed evaluation.';
      default:
        return 'Explore our comprehensive curriculum tailored to cultivate mastery from middle school to competitive boards.';
    }
  };

  return (
    <div className="bg-surface-container-low min-h-[100dvh] font-body-md text-on-surface overflow-x-hidden flex flex-col w-full">
      
      {/* Hero Section */}
      <section className="relative w-full pt-28 sm:pt-36 md:pt-44 pb-12 sm:pb-16 px-4 md:px-[64px] overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/courses-hero-bg.png" 
            alt="Vidhya Tutorials Coaching Classroom & Batches" 
            className="w-full h-full object-cover object-center" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/40 backdrop-blur-[0.5px]"></div>
        </div>
        
        <div className="relative z-10 max-w-[1280px] mx-auto flex flex-col items-start text-left w-full">
          <FadeInWhenVisible className="max-w-2xl">
            <span className="inline-block px-3.5 py-1.5 bg-white/15 backdrop-blur-md text-white border border-white/20 rounded-full text-[11px] sm:text-data-label font-data-label mb-4 sm:mb-5 tracking-widest uppercase shadow-md">
              ✨ Comprehensive Academic Wings • 6th to 12th Standard
            </span>
            <h1 className="text-3xl sm:text-[44px] md:text-[60px] font-bold text-white leading-tight tracking-[-0.02em] mb-3 sm:mb-4">
              Our <span className="italic text-amber-300 font-serif">Courses</span>
            </h1>
            <p className="text-white/90 text-sm sm:text-[16px] md:text-[18px] font-medium tracking-tight leading-relaxed">
              Empowering students from 6th grade through board exams and medical/engineering competitive entrances with concept-driven clarity.
            </p>
          </FadeInWhenVisible>
        </div>
      </section>

      <div className="relative z-10 w-full shadow-[0_-20px_50px_rgba(0,0,0,0.1)] overflow-hidden bg-surface-container-low">
        <ScrollTicker items={["Excellence in Education", "School 6th-10th", "Commerce 11th-12th", "Science 11th-12th", "NEET & CET Coaching"]} className="bg-primary text-white dark:text-[#001b3c] border-b border-white/10 dark:border-[#001b3c]/20" />
        
        <div className="pt-8 sm:pt-12 pb-20 sm:pb-24 space-y-8 sm:space-y-12 md:space-y-16 px-3.5 sm:px-6 md:px-[64px]">

          {/* ═══════ WING SELECTION TABS ═══════ */}
          <section id="wings" className="max-w-[1280px] mx-auto scroll-mt-28">
            <div className="bg-[#1a3860] text-white rounded-3xl shadow-xl border border-white/15 p-4 sm:p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 mb-4 pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-300">Filter By Academic Wing</h3>
                  <p className="text-[11px] sm:text-xs text-white/70 mt-0.5">Select a category to view specific grade batches (swipe horizontally on mobile)</p>
                </div>

                {activeWing !== 'all' && (
                  <button
                    onClick={() => handleSelectWing('all')}
                    className="self-start md:self-auto text-xs font-bold text-amber-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                    <span>Reset Filter (Show All)</span>
                  </button>
                )}
              </div>

              {/* Tab Pills with Mobile Horizontal Swipe Scroll */}
              <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 sm:pb-0 no-scrollbar touch-pan-x flex-nowrap sm:flex-wrap">
                {wingTabs.map((tab) => {
                  const isSelected = activeWing === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleSelectWing(tab.id)}
                      className={`relative flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 cursor-pointer shrink-0 whitespace-nowrap min-h-[42px] ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/25 font-bold'
                          : 'bg-white/10 hover:bg-white/20 text-white/85 hover:text-white border border-white/10'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[17px] sm:text-[18px]">{tab.icon}</span>
                      <span>{tab.label}</span>
                      <span
                        className={`ml-1 text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                          isSelected
                            ? 'bg-black/20 text-slate-950'
                            : 'bg-white/15 text-white'
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ═══════ COURSES GRID SECTION ═══════ */}
          <section className="max-w-[1280px] mx-auto bg-[#173359] text-white rounded-3xl shadow-2xl border border-white/15 p-4 sm:p-8 md:p-12">
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-amber-300 border border-white/15 mb-3">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  <span>{filteredCourses.length} Batches Available</span>
                </div>
                <h2 className="font-h2 text-[26px] md:text-[34px] font-bold text-white leading-tight">
                  {getWingTitle()}
                </h2>
                <p className="text-white/80 text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
                  {getWingDescription()}
                </p>
              </div>

              {activeWing === 'school' && (
                <div className="bg-emerald-500/15 border border-emerald-400/30 rounded-2xl p-4 shrink-0 max-w-xs text-white">
                  <p className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">verified</span>
                    School Section Active
                  </p>
                  <p className="text-[12px] text-white/80 mt-1 leading-relaxed">
                    Showing only 6th, 7th, 8th, 9th, and 10th Standard courses.
                  </p>
                </div>
              )}

              {activeWing === 'science' && (
                <div className="bg-cyan-500/15 border border-cyan-400/30 rounded-2xl p-4 shrink-0 max-w-sm text-white">
                  <p className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">science</span>
                    PCM, PCB & PCMB Combinations
                  </p>
                  <p className="text-[12px] text-white/80 mt-1 leading-relaxed">
                    <strong>PCM:</strong> Engineering & Architecture | <strong>PCB:</strong> Medical Careers | <strong>PCMB:</strong> Dual Flexibility.<br/>
                    <span className="text-cyan-300 font-semibold">Compulsory:</span> Physics, Chemistry & English + Maths or Biology.
                  </p>
                </div>
              )}

              {activeWing === 'commerce' && (
                <div className="bg-amber-500/15 border border-amber-400/30 rounded-2xl p-4 shrink-0 max-w-sm text-white">
                  <p className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">account_balance</span>
                    Commerce Core Curriculum
                  </p>
                  <p className="text-[12px] text-white/80 mt-1 leading-relaxed">
                    <strong>Key Subjects:</strong> Book Keeping - Accountancy, OCM, Maths 1, Maths 2, Economics, English, SP.
                  </p>
                </div>
              )}

              {activeWing === 'test-series' && (
                <div className="bg-purple-500/15 border border-purple-400/30 rounded-2xl p-4 shrink-0 max-w-sm text-white">
                  <p className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">assignment_turned_in</span>
                    Rigorous Testing System
                  </p>
                  <p className="text-[12px] text-white/80 mt-1 leading-relaxed">
                    <strong>Includes:</strong> 3 full rounds of board preliminary examinations, weekly chapter tests, OMR entrance drills & personal feedback.
                  </p>
                </div>
              )}
            </div>

            {/* Grid */}
            <motion.div 
              layout 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredCourses.map((course, idx) => (
                  <motion.div
                    key={course.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    transition={{ duration: 0.35, delay: idx * 0.04 }}
                    className="bg-[#0b1c33] hover:bg-[#0e2544] rounded-2xl p-6 md:p-8 border border-white/15 hover:border-amber-300/40 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col group relative overflow-hidden text-white"
                  >
                    {/* Top Wing Badge & Grade Icon */}
                    <div className="flex items-start justify-between gap-3 mb-5">
                      <div className="w-12 h-12 bg-white/10 text-amber-300 border border-white/15 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all duration-300 shadow-md">
                        <span className="material-symbols-outlined text-2xl">{course.icon}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase border shadow-sm ${course.badgeColor}`}>
                        {course.wingLabel}
                      </span>
                    </div>

                    {/* Grade Title */}
                    <div className="mb-4">
                      <h3 className="text-2xl font-extrabold text-white group-hover:text-amber-300 transition-colors leading-tight">
                        {course.grade}
                      </h3>
                      <p className="text-amber-300 text-xs font-bold uppercase tracking-wider mt-1">
                        {course.subtitle}
                      </p>
                      {course.description && (
                        <p className="text-slate-300 text-xs mt-2.5 leading-relaxed">
                          {course.description}
                        </p>
                      )}
                    </div>

                    {/* Subjects List */}
                    <div className="flex-grow mb-6 pt-3.5 border-t border-white/10">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 mb-3.5 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm text-cyan-300">menu_book</span>
                        <span>Key Curriculum Focus</span>
                      </h4>
                      <ul className="space-y-2.5">
                        {course.subjects.map((sub, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-slate-200 text-sm group-hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-[16px] mt-0.5 text-emerald-400 shrink-0">check_circle</span>
                            <span className="font-medium text-[13px] leading-snug">{sub}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Inquire Action Button (Opens Enquiry Modal) */}
                    <button 
                      type="button"
                      onClick={() => {
                        setSelectedCourseForEnquiry(course);
                        setIsEnquiryOpen(true);
                      }}
                      className="w-full mt-auto py-3.5 px-4 bg-white hover:bg-amber-300 text-[#0b1c33] hover:text-slate-950 rounded-xl text-center font-extrabold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl cursor-pointer group/btn"
                    >
                      <span>Inquire for Admission</span>
                      <span className="material-symbols-outlined text-[18px] group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </section>

        </div>
      </div>

      {/* Course Inquiry Modal */}
      <EnquiryModal 
        isOpen={isEnquiryOpen} 
        onClose={() => {
          setIsEnquiryOpen(false);
          setSelectedCourseForEnquiry(null);
        }}
        courseTitle={selectedCourseForEnquiry ? `${selectedCourseForEnquiry.grade} — ${selectedCourseForEnquiry.subtitle}` : undefined}
        defaultStandard={selectedCourseForEnquiry?.standardParam ? `${selectedCourseForEnquiry.standardParam} Standard` : undefined}
      />

    </div>
  );
}
