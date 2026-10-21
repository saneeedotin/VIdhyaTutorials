import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, BookOpen, GraduationCap, ArrowRight, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchableItem {
  id: string;
  title: string;
  category: string;
  badge: string;
  description: string;
  tags: string[];
  link: string;
  standardParam?: string;
}

const SEARCHABLE_ITEMS: SearchableItem[] = [
  {
    id: 'c-6th',
    title: '6th Standard (School Foundation)',
    category: 'School Wing',
    badge: 'SSC • ICSE • CBSE',
    description: 'Foundational concept building in Mathematics, Science, and Languages for Class 6th.',
    tags: ['6th', 'class 6', 'sixth', 'school', 'icse', 'cbse', 'ssc', 'maths', 'science'],
    link: '/courses?wing=school#wings',
    standardParam: '6th'
  },
  {
    id: 'c-7th',
    title: '7th Standard (Conceptual Prep)',
    category: 'School Wing',
    badge: 'SSC • ICSE • CBSE',
    description: 'Analytical problem solving in Maths and Science bridging middle school basics.',
    tags: ['7th', 'class 7', 'seventh', 'school', 'icse', 'cbse', 'ssc', 'maths', 'science'],
    link: '/courses?wing=school#wings',
    standardParam: '7th'
  },
  {
    id: 'c-8th',
    title: '8th Standard (High School Prep)',
    category: 'School Wing',
    badge: 'SSC • ICSE • CBSE',
    description: 'Rigorous academic preparation bridging middle school basics with high school board rigor.',
    tags: ['8th', 'class 8', 'eighth', 'school', 'icse', 'cbse', 'ssc', 'maths', 'science'],
    link: '/courses?wing=school#wings',
    standardParam: '8th'
  },
  {
    id: 'c-9th',
    title: '9th Standard (Pre-Board Foundations)',
    category: 'School Wing',
    badge: 'SSC • ICSE • CBSE',
    description: 'Bifurcated Maths & Science curriculum with extensive testing and concept coaching.',
    tags: ['9th', 'class 9', 'ninth', 'school', 'icse', 'cbse', 'ssc', 'maths 1', 'maths 2', 'science'],
    link: '/courses?wing=school#wings',
    standardParam: '9th'
  },
  {
    id: 'c-10th',
    title: '10th Standard (Board Champions Batch)',
    category: 'School Wing',
    badge: 'SSC • ICSE • CBSE',
    description: 'Intensive board prep batch with chapter-wise unit tests and full preliminary model exams.',
    tags: ['10th', 'class 10', 'tenth', 'board', 'ssc', 'icse', 'cbse', 'board exams', 'prelims'],
    link: '/courses?wing=school#wings',
    standardParam: '10th'
  },
  {
    id: 'c-11th-comm',
    title: '11th Commerce (FYJC)',
    category: 'Commerce Wing',
    badge: 'Accounts • Maths • OCM',
    description: 'Foundations of Book Keeping, Economics, Secretarial Practice (SP), and Mathematics.',
    tags: ['11th commerce', 'fyjc', 'accounts', 'book keeping', 'ocm', 'economics', 'sp'],
    link: '/courses?wing=commerce#wings',
    standardParam: '11th'
  },
  {
    id: 'c-12th-comm',
    title: '12th Commerce (SYJC HSC Board)',
    category: 'Commerce Wing',
    badge: 'HSC Board Champions',
    description: 'Specialized HSC board coaching with full prelim test series producing 99/100 and 100/100 scores.',
    tags: ['12th commerce', 'syjc', 'hsc', 'accounts', 'partnership accounts', 'economics', 'board'],
    link: '/courses?wing=commerce#wings',
    standardParam: '12th'
  },
  {
    id: 'c-11th-sci',
    title: '11th Science (PCM / PCB / PCMB)',
    category: 'Science Wing',
    badge: 'Engineering & Medical Base',
    description: 'Rigorous theory, formula workshops, and numerical drills in Physics, Chemistry, Maths & Biology.',
    tags: ['11th science', 'pcm', 'pcb', 'pcmb', 'physics', 'chemistry', 'biology', 'maths'],
    link: '/courses?wing=science#wings',
    standardParam: '11th'
  },
  {
    id: 'c-12th-sci',
    title: '12th Science (HSC Board Mastery)',
    category: 'Science Wing',
    badge: 'HSC + Entrance Ready',
    description: 'Comprehensive HSC syllabus mastery with derivation workshops and board answer writing drills.',
    tags: ['12th science', 'hsc science', 'physics', 'chemistry', 'maths', 'biology', 'board exams'],
    link: '/courses?wing=science#wings',
    standardParam: '12th'
  },
  {
    id: 'c-neet',
    title: 'NEET-UG Target Batch',
    category: 'Entrance Wing',
    badge: 'Medical Entrance',
    description: 'NCERT line-by-line Biology, high-yield Physics problem solving, and Regular Test Series.',
    tags: ['neet', 'medical', 'biology', 'mbbs', 'bds', 'dpp', 'regular test series', 'doctor'],
    link: '/courses?wing=neet#wings',
    standardParam: '12th'
  },
  {
    id: 'c-cet',
    title: 'MHT-CET Target Batch',
    category: 'Entrance Wing',
    badge: 'Engineering & Pharmacy',
    description: 'Speed & accuracy shortcuts, past 15 years question banks, and Computer-Based Tests (CBT).',
    tags: ['cet', 'mht-cet', 'engineering', 'pharmacy', 'cbt', 'speed', 'calculus'],
    link: '/courses?wing=neet#wings',
    standardParam: '12th'
  },
  {
    id: 'c-ts-10th',
    title: '10th Board Prelim Test Series',
    category: 'Test Series',
    badge: 'SSC • ICSE • CBSE',
    description: '3 full rounds of board preliminary simulations with verified examiner corrections and model answers.',
    tags: ['test series', 'prelims', '10th test', 'mock tests', 'ssc prelim', 'icse prelim', 'cbse prelim'],
    link: '/courses?wing=test-series#wings',
    standardParam: '10th'
  },
  {
    id: 'c-ts-12th',
    title: '12th HSC Board Prelim Test Series',
    category: 'Test Series',
    badge: 'Commerce & Science',
    description: 'Detailed subject-wise paper corrections and error diagnostics for 12th Commerce & Science.',
    tags: ['12th test series', 'hsc prelim', 'accounts test', 'science test', 'mock exam'],
    link: '/courses?wing=test-series#wings',
    standardParam: '12th'
  }
];

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setQuery('');
      setSelectedCategory('All');
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const categories = ['All', 'School Wing', 'Commerce Wing', 'Science Wing', 'Entrance Wing', 'Test Series'];

  const filteredItems = SEARCHABLE_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    if (!matchesCategory) return false;

    if (!query.trim()) return true;

    const q = query.toLowerCase().trim();
    return (
      item.title.toLowerCase().includes(q) ||
      item.badge.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.tags.some(t => t.includes(q))
    );
  });

  const handleSelect = (item: SearchableItem) => {
    onClose();
    navigate(item.link);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[130] flex items-start justify-center p-3 sm:p-6 md:pt-20 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 flex flex-col max-h-[85vh]"
          >
            {/* Top Search Input Bar */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <Search className="text-primary dark:text-blue-400 shrink-0" size={20} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search classes (6th, 7th, 10th ICSE), subjects, or entrance..."
                className="w-full bg-transparent text-sm sm:text-base font-semibold text-slate-900 dark:text-white placeholder-slate-400 outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X size={16} />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                aria-label="Close search"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Category Filter Pills */}
            <div className="px-4 py-3 bg-slate-50/70 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Results List */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 no-scrollbar">
              {filteredItems.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <p className="font-semibold text-sm">No courses matching "{query}"</p>
                  <p className="text-xs">Try searching for "6th", "7th", "ICSE", "CBSE", "Science", or "Commerce".</p>
                </div>
              ) : (
                filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    whileHover={{ x: 3 }}
                    className="p-3.5 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 hover:bg-primary/5 dark:hover:bg-blue-500/10 border border-slate-100 dark:border-slate-800/80 hover:border-primary/30 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary dark:text-blue-300 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary group-hover:text-white transition-colors">
                        <GraduationCap size={18} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-blue-300 transition-colors">
                            {item.title}
                          </h4>
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-bold text-primary dark:text-blue-400 shrink-0 group-hover:translate-x-1 transition-transform">
                      <span className="hidden sm:inline">View</span>
                      <ChevronRight size={16} />
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Modal Bottom Strip */}
            <div className="px-5 py-3 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Sparkles size={12} className="text-amber-500" />
                <span>Covers SSC, ICSE, CBSE, HSC, NEET & MHT-CET</span>
              </span>
              <span className="hidden sm:inline font-mono">Press ESC to exit</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
