import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
  Calendar,
  ArrowRight,
  MapPin,
  GraduationCap,
  LayoutGrid,
  Columns3,
  Grid3X3,
  LayoutList,
  Search,
  Play,
  Pause
} from 'lucide-react';
import { GALLERY_PHOTOS, GalleryPhoto } from './CampusGallery';
import { ScrollTicker } from '../ui/ScrollTicker';

type CategoryFilter = 'All' | 'Events' | 'Achievers' | 'Mentorship';
type ViewMode = 'grid' | 'masonry' | 'compact' | 'list';

export function GalleryPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('All');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [isPlayingSlideshow, setIsPlayingSlideshow] = useState(false);

  // Filter by category and search query
  const filteredPhotos = GALLERY_PHOTOS.filter((photo) => {
    const matchesCategory = activeFilter === 'All' || photo.category === activeFilter;
    const matchesSearch = searchQuery.trim() === '' || 
      photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (photo.description && photo.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      photo.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Reset selected photo when filter or search changes
  const handleFilterChange = (filter: CategoryFilter) => {
    setActiveFilter(filter);
    setSelectedPhotoIndex(null);
  };

  // Slideshow auto-advance
  useEffect(() => {
    if (!isPlayingSlideshow || selectedPhotoIndex === null) return;
    const timer = setInterval(() => {
      setSelectedPhotoIndex((prev) => (prev !== null ? (prev + 1) % filteredPhotos.length : 0));
    }, 3500);
    return () => clearInterval(timer);
  }, [isPlayingSlideshow, selectedPhotoIndex, filteredPhotos.length]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return;
      if (e.key === 'Escape') {
        setSelectedPhotoIndex(null);
        setIsPlayingSlideshow(false);
      }
      if (e.key === 'ArrowRight') {
        setSelectedPhotoIndex((prev) => (prev !== null ? (prev + 1) % filteredPhotos.length : 0));
      }
      if (e.key === 'ArrowLeft') {
        setSelectedPhotoIndex((prev) => (prev !== null ? (prev - 1 + filteredPhotos.length) % filteredPhotos.length : 0));
      }
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlayingSlideshow((prev) => !prev);
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

  const viewModes: { label: string; mode: ViewMode; icon: React.ElementType }[] = [
    { label: 'Standard Grid', mode: 'grid', icon: LayoutGrid },
    { label: 'Fluid Masonry', mode: 'masonry', icon: Columns3 },
    { label: 'Compact Mosaic', mode: 'compact', icon: Grid3X3 },
    { label: 'Detailed List', mode: 'list', icon: LayoutList },
  ];

  return (
    <div className="bg-surface-container-low text-on-surface font-body-md overflow-x-hidden w-full min-h-screen">
      
      {/* 1. Hero Header with Realistic Campus Celebration Background */}
      <section className="relative w-full pt-32 md:pt-44 pb-16 px-4 md:px-[64px] overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/gallery-hero-bg.jpg" 
            alt="Vidhya Tutorials Student Life & Celebrations" 
            className="w-full h-full object-cover object-center" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-950/60 to-slate-950/80 backdrop-blur-[1px]"></div>
        </div>

        <div className="relative z-10 max-w-[1280px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-blue-200 text-xs font-bold uppercase tracking-widest mb-6 shadow-md"
          >
            <Camera size={14} />
            <span>Gallery Section</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-[44px] md:text-[56px] font-bold leading-tight tracking-tight mb-3 sm:mb-4 text-white"
          >
            Memories, Focus & <span className="italic text-amber-300 font-serif">Celebrations</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/90 font-body-lg text-sm sm:text-base md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            A visual glimpse into our classrooms, faculty mentorship, annual celebrations, and the spirited student life at Vidhya Tutorials.
          </motion.p>
        </div>
      </section>

      {/* Ticker Divider */}
      <ScrollTicker 
        items={["Student Life", "Academic Atmosphere", "Annual Celebrations & Outings", "Faculty Mentorship"]} 
        className="bg-primary text-white dark:text-[#001b3c] border-b border-white/10" 
      />

      {/* 2. Gallery Content Section */}
      <div className="max-w-[1280px] mx-auto px-3.5 sm:px-6 md:px-[64px] py-8 sm:py-12">
        
        {/* Unified Gallery Control Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/90 dark:border-slate-800 p-4 sm:p-6 mb-8 md:mb-10 space-y-4 transition-colors">
          
          {/* Top Row: Category Filter Tabs with horizontal swipe on mobile */}
          <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-3 overflow-x-auto pb-2 sm:pb-0 no-scrollbar touch-pan-x flex-nowrap sm:flex-wrap">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeFilter === cat.value;
              const count = cat.value === 'All' 
                ? GALLERY_PHOTOS.length 
                : GALLERY_PHOTOS.filter(p => p.category === cat.value).length;

              return (
                <button
                  key={cat.value}
                  onClick={() => handleFilterChange(cat.value)}
                  className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer shrink-0 whitespace-nowrap min-h-[42px] ${
                    isActive
                      ? 'bg-primary text-white shadow-md scale-[1.02] ring-2 ring-primary/25'
                      : 'bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700'
                  }`}
                >
                  <Icon size={16} />
                  <span>{cat.label}</span>
                  <span className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full font-bold tabular-nums ${
                    isActive 
                      ? 'bg-white/25 text-white' 
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bottom Row: Search, Active Tags & View Mode Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            
            {/* Search Input Bar */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search photos or events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Photos Count & Active Filter Indicator */}
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <span>
                Showing <strong className="text-slate-900 dark:text-white font-bold">{filteredPhotos.length}</strong> photo{filteredPhotos.length !== 1 ? 's' : ''} in{' '}
                <span className="text-primary dark:text-blue-400 font-bold uppercase tracking-wider">{activeFilter === 'All' ? 'All' : activeFilter}</span>
                {searchQuery && <span> matching <em className="text-slate-900 dark:text-white font-semibold">"{searchQuery}"</em></span>}
              </span>
              {activeFilter !== 'All' && (
                <button
                  onClick={() => handleFilterChange('All')}
                  className="text-primary dark:text-blue-400 hover:underline font-bold text-xs flex items-center gap-0.5 cursor-pointer ml-1"
                >
                  <span>Reset</span>
                  <ArrowRight size={12} />
                </button>
              )}
            </div>

            {/* View Mode Switcher & Quick Slideshow */}
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
              {filteredPhotos.length > 0 && (
                <button
                  onClick={() => {
                    setSelectedPhotoIndex(0);
                    setIsPlayingSlideshow(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer hover:-translate-y-0.5 min-h-[38px]"
                  title="Open full-screen slideshow"
                >
                  <Play size={13} className="fill-current" />
                  <span>Slideshow</span>
                </button>
              )}

              {/* View Mode Switcher */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                {viewModes.map((vm) => {
                  const Icon = vm.icon;
                  const isSelected = viewMode === vm.mode;
                  return (
                    <button
                      key={vm.mode}
                      onClick={() => setViewMode(vm.mode)}
                      title={vm.label}
                      className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer min-h-[36px] ${
                        isSelected
                          ? 'bg-white dark:bg-slate-900 text-primary dark:text-blue-400 shadow-sm font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white'
                      }`}
                    >
                      <Icon size={14} />
                      <span className="hidden sm:inline">{vm.label.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

        {/* ── View 1: Standard Grid View ── */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredPhotos.map((photo, index) => (
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
        )}

        {/* ── View 2: Fluid Masonry View (Pinterest Wall Style) ── */}
        {viewMode === 'masonry' && (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-5 space-y-5">
            {filteredPhotos.map((photo, index) => (
              <div
                key={photo.id}
                onClick={() => setSelectedPhotoIndex(index)}
                className="break-inside-avoid group relative rounded-2xl overflow-hidden bg-surface theme-dark-card border border-outline-variant/30 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
              >
                <div className="relative overflow-hidden bg-slate-950">
                  <img
                    src={photo.src}
                    alt={photo.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider border border-white/20">
                      {photo.category}
                    </span>
                  </div>

                  {/* Gradient Overlay with Info on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                    <h4 className="font-bold text-sm leading-snug">
                      {photo.title}
                    </h4>
                    <p className="text-xs text-white/80 line-clamp-2 mt-1">
                      {photo.description}
                    </p>
                    <div className="mt-2.5 flex items-center gap-1 text-[11px] font-bold text-secondary">
                      <Maximize2 size={12} />
                      <span>Click for Lightbox</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-surface dark:bg-slate-900 border-t border-outline-variant/15">
                  <h4 className="font-bold text-xs sm:text-sm text-on-surface truncate">
                    {photo.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── View 3: Compact Mosaic View ── */}
        {viewMode === 'compact' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredPhotos.map((photo, index) => (
              <div
                key={photo.id}
                onClick={() => setSelectedPhotoIndex(index)}
                className="group relative aspect-square rounded-xl overflow-hidden bg-slate-950 border border-outline-variant/30 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                title={photo.title}
              >
                <img
                  src={photo.src}
                  alt={photo.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-2 text-white">
                  <span className="text-[9px] uppercase font-bold text-amber-300">
                    {photo.category}
                  </span>
                  <p className="text-[11px] font-bold line-clamp-2 leading-tight">
                    {photo.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── View 4: Detailed List / Showcase View ── */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            {filteredPhotos.map((photo, index) => (
              <div
                key={photo.id}
                onClick={() => setSelectedPhotoIndex(index)}
                className="group p-4 rounded-2xl bg-surface theme-dark-card border border-outline-variant/30 shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300 flex flex-col sm:flex-row items-center gap-5 cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="w-full sm:w-44 h-44 shrink-0 rounded-xl overflow-hidden bg-slate-950/80 flex items-center justify-center p-2 relative">
                  <img
                    src={photo.src}
                    alt={photo.title}
                    loading="lazy"
                    decoding="async"
                    className="max-h-full max-w-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-wider">
                      {photo.category}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 space-y-1.5 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary dark:text-blue-300 text-[10px] font-bold uppercase tracking-wider">
                    <Sparkles size={12} />
                    <span>{photo.category} Spotlight</span>
                  </div>
                  <h3 className="font-h3 text-base sm:text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                    {photo.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed max-w-2xl">
                    {photo.description}
                  </p>
                  <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <button
                      type="button"
                      className="px-4 py-1.5 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-white dark:text-blue-300 dark:hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <Maximize2 size={13} />
                      <span>Open Fullscreen Lightbox</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State when no photos match filter/search */}
        {filteredPhotos.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <Camera size={44} className="mx-auto text-on-surface-variant/40" />
            <h3 className="text-lg font-bold text-on-surface">No photos found</h3>
            <p className="text-sm text-on-surface-variant max-w-md mx-auto">
              No photos match your current search or category filter. Try clearing the search query or switching tabs.
            </p>
            <button
              onClick={() => {
                setActiveFilter('All');
                setSearchQuery('');
              }}
              className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-md cursor-pointer hover:bg-primary/90 transition-all"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* 3. Campus Visit Call-to-Action */}
        <div className="mt-16 md:mt-24 bg-gradient-to-r from-primary via-primary/90 to-blue-900 rounded-3xl p-8 md:p-14 text-white text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider">
              <GraduationCap size={14} />
              <span>Join Our Community</span>
            </span>
            <h2 className="font-h2 text-2xl md:text-4xl font-bold leading-tight">
              Experience Vidhya Tutorials in Person
            </h2>
            <p className="text-white/80 text-sm md:text-base">
              Visit our air-conditioned Matunga Road center, meet our faculty, and see our disciplined learning atmosphere firsthand.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={() => navigate('/admissions')}
                className="bg-white text-primary font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-white/95 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Admission Details</span>
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate('/our-locations')}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-all cursor-pointer flex items-center gap-2"
              >
                <MapPin size={16} />
                <span>Locate Campus</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* 4. Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && filteredPhotos[selectedPhotoIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setSelectedPhotoIndex(null);
              setIsPlayingSlideshow(false);
            }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
          >
            {/* Top Bar */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 text-white">
              <div className="flex items-center gap-3">
                <span className="text-xs md:text-sm font-semibold px-3 py-1 rounded-full bg-white/10 backdrop-blur-md tabular-nums">
                  {selectedPhotoIndex + 1} / {filteredPhotos.length}
                </span>
                <span className="text-xs uppercase tracking-widest text-secondary font-bold px-3 py-1 rounded-full bg-secondary/15 border border-secondary/30">
                  {filteredPhotos[selectedPhotoIndex].category}
                </span>
              </div>

              {/* Top Controls: Slideshow + Close */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPlayingSlideshow((prev) => !prev);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isPlayingSlideshow
                      ? 'bg-amber-500 text-white shadow-lg'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                  title="Toggle Slideshow (Spacebar)"
                >
                  {isPlayingSlideshow ? <Pause size={14} /> : <Play size={14} />}
                  <span>{isPlayingSlideshow ? 'Pause Slideshow' : 'Play Slideshow'}</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedPhotoIndex(null);
                    setIsPlayingSlideshow(false);
                  }}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Close (Esc)"
                >
                  <X size={20} />
                </button>
              </div>
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
              title="Previous Photo (Left Arrow)"
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
              title="Next Photo (Right Arrow)"
            >
              <ChevronRight size={24} />
            </button>

            {/* Main Center Image */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl max-h-[78vh] flex flex-col items-center justify-center rounded-2xl overflow-hidden shadow-2xl mb-16 sm:mb-20"
            >
              <img
                src={filteredPhotos[selectedPhotoIndex].src}
                alt={filteredPhotos[selectedPhotoIndex].title}
                decoding="async"
                className="max-h-[58vh] sm:max-h-[64vh] w-auto max-w-full object-contain rounded-xl"
              />

              <div className="w-full bg-gradient-to-t from-black via-black/85 to-transparent p-3 sm:p-5 text-center text-white mt-1 sm:mt-2">
                <h3 className="text-base sm:text-xl font-bold mb-1">
                  {filteredPhotos[selectedPhotoIndex].title}
                </h3>
                <p className="text-xs sm:text-sm text-white/80 max-w-2xl mx-auto leading-relaxed line-clamp-2">
                  {filteredPhotos[selectedPhotoIndex].description}
                </p>
              </div>
            </div>

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
                  className={`relative shrink-0 w-11 h-11 sm:w-13 sm:h-13 rounded-lg sm:rounded-xl overflow-hidden transition-all duration-200 cursor-pointer ${
                    selectedPhotoIndex === idx
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
  );
}
