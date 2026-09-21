import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Sparkles,
  Users,
  Award,
  BookOpen,
  Calendar
} from 'lucide-react';
import { apiClient } from '../../api/apiClient';

export interface GalleryPhoto {
  id: string;
  src: string;
  title: string;
  category: 'Classroom' | 'Events' | 'Mentorship' | 'Achievers';
  description?: string;
}

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  // ── Outdoor Events, Picnics & Celebrations (Real Photos from Vidhya Tutorials) ──
  {
    id: 'photo-e1',
    src: '/gallery/gallery-16.jpg',
    title: 'Faculty & Student Annual Resort Outing',
    category: 'Events',
    description: 'Teachers and students celebrating together during the annual recreation trip.'
  },
  {
    id: 'photo-e2',
    src: '/gallery/gallery-17.jpg',
    title: 'Girls Batch Annual Excursion Day',
    category: 'Events',
    description: 'Memorable team bonding day and refreshing outdoor retreat with batchmates.'
  },
  {
    id: 'photo-e3',
    src: '/gallery/gallery-18.jpg',
    title: 'Junior Students Outdoor Celebration & Picnic',
    category: 'Events',
    description: 'Celebrating academic milestones with outdoor games, laughter, and camaraderie.'
  },
  {
    id: 'photo-e4',
    src: '/gallery/gallery-19.jpg',
    title: 'Boys Batch Annual Excursion Tour',
    category: 'Events',
    description: 'Student batch bonding and refreshing trip away from daily test routines.'
  },
  {
    id: 'photo-e5',
    src: '/gallery/gallery-20.jpg',
    title: 'Vidhya Tutorials Celebration Day Group Photo',
    category: 'Events',
    description: 'Students and faculties sharing joyful moments on the center excursion.'
  },
  {
    id: 'photo-e6',
    src: '/gallery/gallery-21.jpg',
    title: 'Wet’n Joy Water Park Grand Batch Outing',
    category: 'Events',
    description: 'Annual grand celebration at Wet’n Joy with students, alumni, and teaching mentors.'
  },

  // ── Board Toppers & Top Rankers (Real Justdial / Google Postings) ──
  {
    id: 'photo-a1',
    src: '/gallery/gallery-02.jpg',
    title: 'Darshna Mewada — 92.33% in HSC (1st Rank)',
    category: 'Achievers',
    description: 'Secured 1st Rank in Ambedkar School with 92.33% in HSC Board Examination.'
  },
  {
    id: 'photo-a2',
    src: '/gallery/gallery-03.jpg',
    title: 'Tisha Kumbhar — 92.33% in HSC (Maths: 99/100, B.K: 96/100)',
    category: 'Achievers',
    description: 'Outstanding commerce performance with 99 in Maths and 96 in Book Keeping.'
  },
  {
    id: 'photo-a3',
    src: '/gallery/gallery-07.jpg',
    title: 'Abhinaya Mudaliyar — 90.60% in SSC Board',
    category: 'Achievers',
    description: 'Distinction scorer in SSC Board under guidance of Vikas Sir & Faculty.'
  },
  {
    id: 'photo-a4',
    src: '/gallery/gallery-08.jpg',
    title: 'Drasti Chitroda — 92.40% in SSC Board (Guru Nanak National High School)',
    category: 'Achievers',
    description: 'School topper and 92.40% distinction scorer in 10th SSC Board.'
  },
  {
    id: 'photo-a5',
    src: '/gallery/gallery-09.jpg',
    title: 'Nimit Parmar — 90.60% in SSC Board',
    category: 'Achievers',
    description: 'Top academic scorer in 10th Board foundation batch.'
  },
  {
    id: 'photo-a6',
    src: '/gallery/gallery-04.jpg',
    title: 'Abdul Ali — 89% in HSC (B.K: 99/100, Eco: 95/100)',
    category: 'Achievers',
    description: 'Near-perfect marks in Commerce practical accounts & economics.'
  },
  {
    id: 'photo-a7',
    src: '/gallery/gallery-05.jpg',
    title: 'Sachi Tank — 90% in SSC Board',
    category: 'Achievers',
    description: 'Consistent top scorer and disciplined achiever at Vidhya Tutorials.'
  },
  {
    id: 'photo-a8',
    src: '/gallery/gallery-06.jpg',
    title: 'Dhruv Mahesh Wala — 1st Rank in Gurunanak National English High School',
    category: 'Achievers',
    description: '1st Rank achiever in Gurunanak National English High School.'
  },
  {
    id: 'photo-a9',
    src: '/gallery/gallery-10.jpg',
    title: 'Pragati D. Tank — 88% in HSC (B.K: 96/100, Maths: 91/100)',
    category: 'Achievers',
    description: 'Distinction in HSC Board with 96 in Book Keeping and 91 in Mathematics.'
  },
  {
    id: 'photo-a10',
    src: '/gallery/gallery-11.jpg',
    title: 'Achary Yogeshwaran — 1st Rank in Matunga Premier School',
    category: 'Achievers',
    description: '1st Rank in 9th Standard at Matunga Premier School.'
  },

  // ── Faculty Mentorship & Leadership (Real Photos) ──
  {
    id: 'photo-m1',
    src: '/sir-real-photo.jpg',
    title: 'Vikas Sir — Founder & Senior Academic Head',
    category: 'Mentorship',
    description: 'Direct 1-on-1 concept coaching, personal attention, and proven board exam strategy.'
  },
  {
    id: 'photo-m2',
    src: '/gallery/gallery-01.jpg',
    title: 'Vidhya Tutorials Official Identity & Crest',
    category: 'Mentorship',
    description: 'Founded and directed by Vikas Tank — 18+ Years of Academic Legacy.'
  }
];

type CategoryFilter = 'All' | 'Events' | 'Achievers' | 'Mentorship';

export function CampusGallery() {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('All');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(12);
  const [allPhotos, setAllPhotos] = useState<GalleryPhoto[]>(() => {
    try {
      const saved = localStorage.getItem('vt_admin_custom_gallery');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return GALLERY_PHOTOS;
  });

  useEffect(() => {
    // Fetch live photos from backend
    apiClient.get('/api/content/gallery')
      .then(res => {
        if (res.data?.success && Array.isArray(res.data.data)) {
          setAllPhotos(res.data.data);
          localStorage.setItem('vt_admin_custom_gallery', JSON.stringify(res.data.data));
        }
      })
      .catch(err => console.warn('Using local gallery cache:', err));

    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem('vt_admin_custom_gallery');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAllPhotos(parsed);
            return;
          }
        }
      } catch {
        // fallback
      }
      setAllPhotos(GALLERY_PHOTOS);
    };

    window.addEventListener('vt_admin_setting_changed', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('vt_admin_setting_changed', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const filteredPhotos = activeFilter === 'All'
    ? allPhotos
    : allPhotos.filter(p => p.category === activeFilter);

  const displayedPhotos = filteredPhotos.slice(0, visibleCount);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return;
      if (e.key === 'Escape') setSelectedPhotoIndex(null);
      if (e.key === 'ArrowRight') {
        setSelectedPhotoIndex((prev) => (prev !== null ? (prev + 1) % filteredPhotos.length : 0));
      }
      if (e.key === 'ArrowLeft') {
        setSelectedPhotoIndex((prev) => (prev !== null ? (prev - 1 + filteredPhotos.length) % filteredPhotos.length : 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex, filteredPhotos.length]);

  const categories: { label: string; value: CategoryFilter; icon: React.ElementType }[] = [
    { label: 'All Photos', value: 'All', icon: Camera },
    { label: 'Events & Picnics', value: 'Events', icon: Calendar },
    { label: 'Board Toppers & Achievers', value: 'Achievers', icon: Award },
    { label: 'Faculty & Mentorship', value: 'Mentorship', icon: Users },
  ];

  return (
    <section className="w-full max-w-[1280px] mx-auto relative z-10" id="gallery">
      <div className="bg-surface theme-dark-card rounded-3xl shadow-xl border border-outline-variant/20 p-6 md:p-14 overflow-hidden">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 text-primary dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-4"
          >
            <Camera size={14} />
            <span>Gallery Section</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-h2 text-[30px] md:text-[42px] font-bold text-primary dark:text-white leading-tight tracking-tight mb-4"
          >
            Memories, Focus & <span className="italic text-secondary dark:text-blue-400 font-serif">Celebrations</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-on-surface-variant dark:text-slate-300 font-body-lg text-base md:text-lg leading-relaxed"
          >
            A visual journey into daily classroom learning, personal faculty guidance, celebrations of board toppers, and the vibrant student life at Vidhya Tutorials.
          </motion.p>
        </div>

        {/* Filter Tabs with Isolated Selection */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10 md:mb-12">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeFilter === cat.value;
            const count = cat.value === 'All'
              ? GALLERY_PHOTOS.length
              : GALLERY_PHOTOS.filter(p => p.category === cat.value).length;

            return (
              <button
                key={cat.value}
                onClick={() => {
                  setActiveFilter(cat.value);
                  setSelectedPhotoIndex(null);
                  setVisibleCount(GALLERY_PHOTOS.length);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${isActive
                    ? 'bg-primary text-white shadow-md scale-[1.02] ring-2 ring-primary/25'
                    : 'bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700'
                  }`}
              >
                <Icon size={16} />
                <span>{cat.label}</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold tabular-nums ${isActive
                    ? 'bg-white/25 text-white'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Photos Grid (Optimized, Perfectly Aligned & 100% Uncropped) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {displayedPhotos.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhotoIndex(index)}
              className="group relative flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer h-[400px] sm:h-[430px]"
            >
              {/* Image Frame with Full Uncropped Containment */}
              <div className="flex-1 relative overflow-hidden bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-3">
                {/* Main Uncropped Photo */}
                <img
                  src={photo.src}
                  alt={photo.title}
                  loading="lazy"
                  decoding="async"
                  className="relative z-10 max-h-full max-w-full object-contain rounded-lg drop-shadow-sm transition-transform duration-500 ease-out group-hover:scale-105"
                />

                {/* Top Category Badge */}
                <div className="absolute top-3 left-3 z-20">
                  <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider border border-white/15 shadow-sm">
                    {photo.category}
                  </span>
                </div>

                {/* Expand Icon */}
                <div className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/70 backdrop-blur-md text-white flex items-center justify-center border border-white/15 group-hover:scale-110 group-hover:bg-primary transition-all shadow-sm">
                  <Maximize2 size={13} />
                </div>
              </div>

              {/* Bottom Info Strip - Clean Executive Styling */}
              <div className="p-3.5 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/80 flex flex-col justify-between shrink-0">
                <div>
                  <h3 className="text-slate-900 dark:text-white font-bold text-sm sm:text-[15px] leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                    {photo.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-1 mt-0.5 leading-relaxed">
                    {photo.description}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-[11px] font-semibold text-primary dark:text-blue-400">
                  <span>Click to view full photo</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-0.5">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More / Show All Button */}
        {filteredPhotos.length > visibleCount && (
          <div className="text-center mt-10 md:mt-12">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setVisibleCount((prev) => Math.min(prev + 8, filteredPhotos.length))}
              className="px-8 py-3.5 rounded-xl bg-primary text-white font-semibold text-sm shadow-md hover:bg-primary/90 transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <Sparkles size={16} />
              <span>Load More Photos ({filteredPhotos.length - visibleCount} remaining)</span>
            </motion.button>
          </div>
        )}

        {/* Fullscreen Lightbox Modal */}
        <AnimatePresence>
          {selectedPhotoIndex !== null && filteredPhotos[selectedPhotoIndex] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhotoIndex(null)}
              className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-lg flex items-center justify-center p-4 md:p-8"
            >
              {/* Top Controls Bar */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 text-white">
                <div className="flex items-center gap-3">
                  <span className="text-xs md:text-sm font-semibold px-3 py-1 rounded-full bg-white/10 backdrop-blur-md">
                    {selectedPhotoIndex + 1} / {filteredPhotos.length}
                  </span>
                  <span className="text-xs uppercase tracking-widest text-white/70 hidden sm:inline">
                    {filteredPhotos[selectedPhotoIndex].category}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedPhotoIndex(null)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Close (Esc)"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Prev Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhotoIndex((prev) =>
                    prev !== null ? (prev - 1 + filteredPhotos.length) % filteredPhotos.length : 0
                  );
                }}
                className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all z-20 cursor-pointer"
                title="Previous Photo"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhotoIndex((prev) =>
                    prev !== null ? (prev + 1) % filteredPhotos.length : 0
                  );
                }}
                className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all z-20 cursor-pointer"
                title="Next Photo"
              >
                <ChevronRight size={24} />
              </button>

              {/* Center Photo Container */}
              <motion.div
                key={selectedPhotoIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-5xl max-h-[78vh] flex flex-col items-center justify-center rounded-2xl overflow-hidden shadow-2xl mb-16 sm:mb-20"
              >
                <img
                  src={filteredPhotos[selectedPhotoIndex].src}
                  alt={filteredPhotos[selectedPhotoIndex].title}
                  className="max-h-[58vh] sm:max-h-[64vh] w-auto max-w-full object-contain rounded-xl"
                />

                {/* Caption Bar */}
                <div className="w-full bg-gradient-to-t from-black via-black/80 to-transparent p-3 sm:p-5 text-center text-white mt-1 sm:mt-2">
                  <h3 className="text-base sm:text-xl font-bold mb-1">
                    {filteredPhotos[selectedPhotoIndex].title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/80 max-w-2xl mx-auto line-clamp-2">
                    {filteredPhotos[selectedPhotoIndex].description}
                  </p>
                </div>
              </motion.div>

              {/* Bottom Filmstrip Thumbnails Bar */}
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 max-w-4xl w-[94vw] sm:w-[90vw] px-3 py-2 bg-black/70 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-start sm:justify-center gap-2 overflow-x-auto scrollbar-none"
              >
                <span className="text-[10px] uppercase font-bold text-white/60 tracking-wider shrink-0 hidden lg:inline mr-1">
                  {activeFilter === 'All' ? 'All' : activeFilter} Reel:
                </span>
                {filteredPhotos.map((photo, idx) => (
                  <button
                    key={photo.id}
                    onClick={() => setSelectedPhotoIndex(idx)}
                    className={`relative shrink-0 w-11 h-11 sm:w-13 sm:h-13 rounded-lg sm:rounded-xl overflow-hidden transition-all duration-200 cursor-pointer ${selectedPhotoIndex === idx
                        ? 'ring-2 ring-amber-400 scale-110 opacity-100 shadow-lg'
                        : 'opacity-40 hover:opacity-100 hover:scale-105'
                      }`}
                    title={`${idx + 1}. ${photo.title}`}
                  >
                    <img
                      src={photo.src}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-0 right-0 text-[8px] font-bold text-white bg-black/80 px-1 rounded-tl">
                      {idx + 1}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
