import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  BookOpen, 
  Award, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Calendar, 
  GraduationCap, 
  ShieldCheck, 
  MapPin,
  ChevronDown
} from 'lucide-react';
import { AnimatedWord } from './AnimatedWord';

interface HeroInspo3DProps {
  onOpenFreeDemo: () => void;
  onOpenEnquiry: () => void;
}

export const HeroInspo3D: React.FC<HeroInspo3DProps> = ({ onOpenFreeDemo, onOpenEnquiry }) => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse position tracking for 3D tilt effect on the central floating crest
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 120 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-18, 18]);
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [18, -18]);
  const translateY = useTransform(smoothY, [-0.5, 0.5], [-10, 10]);

  // Handle mouse movement relative to hero
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // 4 Interactive Hotspots surrounding the central 3D emblem (Matching inspo.mp4)
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);

  const HOTSPOTS = [
    {
      id: 1,
      title: 'Concept-First Learning',
      subtitle: 'Grades 6th – 10th SSC & CBSE Foundation',
      icon: BookOpen,
      badge: 'School Wing',
      position: 'top-6 -left-4 sm:top-10 sm:-left-16',
      accentColor: 'from-amber-400 to-yellow-500',
      tagColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40'
    },
    {
      id: 2,
      title: 'Founder Vikas Sir Mentorship',
      subtitle: 'Direct 1-on-1 Guidance & Real-time Doubts',
      icon: Users,
      badge: 'Academic Head',
      position: 'top-6 -right-4 sm:top-10 sm:-right-16',
      accentColor: 'from-emerald-400 to-teal-500',
      tagColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
    },
    {
      id: 3,
      title: 'HSC Commerce & Science',
      subtitle: '11th & 12th Board Mastery + PYQ Prelims',
      icon: GraduationCap,
      badge: 'Junior College',
      position: 'bottom-8 -left-4 sm:bottom-12 sm:-left-16',
      accentColor: 'from-blue-400 to-indigo-500',
      tagColor: 'bg-blue-500/20 text-blue-300 border-blue-400/40'
    },
    {
      id: 4,
      title: '98.9% Highest Board Score',
      subtitle: '18+ Years Legacy at Matunga Road Campus',
      icon: Award,
      badge: 'Proven Legacy',
      position: 'bottom-8 -right-4 sm:bottom-12 sm:-right-16',
      accentColor: 'from-purple-400 to-pink-500',
      tagColor: 'bg-purple-500/20 text-purple-300 border-purple-400/40'
    }
  ];

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[92vh] lg:min-h-[100vh] flex flex-col justify-between overflow-hidden z-10 bg-gradient-to-b from-[#040b17] via-[#08172e] to-[#040c1a] text-white select-none"
    >
      {/* ── Cinematic Sky & Ambient Atmosphere (Direct inspo from inspo.mp4) ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Sky gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/25 via-[#08172e]/60 to-[#040b17]" />

        {/* Floating Ethereal Cloud Glows */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-blue-500/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 -right-32 w-[550px] h-[550px] bg-amber-500/10 rounded-full blur-[110px]" />

        {/* Subtle Horizon Landscape Silhouette & Fog */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#040b17] via-[#040b17]/80 to-transparent" />
        
        {/* Perspective Grid Line Texture */}
        <div 
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)',
            backgroundSize: '48px 48px'
          }}
        />
      </div>

      {/* ── Top Floating Navigation Pill Bar (Matching inspo.mp4 top bar) ── */}
      <div className="relative z-20 pt-6 px-4 sm:px-8 max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
        {/* Brand Left */}
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md p-1.5 border border-white/20 shadow-lg flex items-center justify-center group-hover:scale-105 transition-transform">
            <img 
              src="/vidhya-tutorials-logo.png" 
              alt="Vidhya Tutorials" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm sm:text-base tracking-wider uppercase bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent">
              Vidhya Tutorials
            </span>
            <span className="text-[10px] text-blue-300/80 tracking-widest uppercase font-semibold">
              Matunga Road, Mumbai
            </span>
          </div>
        </div>

        {/* Center Floating Pill Menu */}
        <div className="hidden md:flex items-center gap-1 px-4 py-2 rounded-full bg-slate-900/60 backdrop-blur-xl border border-white/15 shadow-xl text-xs font-semibold text-slate-200">
          <button 
            onClick={() => {
              document.getElementById('wings')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            Academic Wings
          </button>
          <button 
            onClick={() => {
              document.getElementById('about-institute')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            About Institute
          </button>
          <button 
            onClick={() => navigate('/courses')}
            className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            Courses
          </button>
          <button 
            onClick={() => navigate('/gallery')}
            className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            Gallery
          </button>
          <button 
            onClick={() => navigate('/our-locations')}
            className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            Location
          </button>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenFreeDemo}
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 text-xs sm:text-sm font-extrabold shadow-lg hover:shadow-amber-500/25 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles size={14} />
            <span>Book Free Demo</span>
          </button>

          <a
            href="tel:+918898117343"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold backdrop-blur-md transition-all text-white"
          >
            <span>+91 88981 17343</span>
          </a>
        </div>
      </div>

      {/* ── Central Hero Stage: Monumental Title + 3D Floating Emblem + Hotspots ── */}
      <div className="relative z-10 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center text-center my-auto">
        
        {/* Top Floating Mini Tag */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/15 backdrop-blur-md text-blue-300 border border-blue-400/30 text-xs font-bold uppercase tracking-widest mb-4 shadow-lg"
        >
          <ShieldCheck size={14} className="text-blue-400" />
          <span>Premier Coaching • Grades 6th to 12th</span>
        </motion.div>

        {/* Monumental Atmosphere Title (Matching inspo.mp4 "Taste the Sky") */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-h1 text-[36px] sm:text-[54px] md:text-[68px] lg:text-[76px] font-black leading-[1.08] tracking-tight uppercase max-w-4xl drop-shadow-2xl mb-3"
        >
          CREATORS OF <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400"><AnimatedWord /></span> MINDS
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed mb-8"
        >
          Empowering the next generation of toppers through concept-first coaching, individual mentorship by <strong className="text-white">Founder Vikas Sir</strong>, and a tradition of board brilliance.
        </motion.p>

        {/* ── The 3D Floating Rotating Central Crest Container (Inspo from 3D rotating cookie in inspo.mp4) ── */}
        <div className="relative w-full max-w-[500px] h-[320px] sm:h-[380px] flex items-center justify-center my-2">
          
          {/* Ambient Glow behind 3D Crest */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 via-amber-400/20 to-blue-500/30 rounded-full blur-3xl pointer-events-none animate-pulse" />

          {/* 3D Motion Perspective Card */}
          <motion.div
            style={{
              rotateX,
              rotateY,
              y: translateY,
              transformStyle: 'preserve-3d',
            }}
            animate={{
              y: [0, -12, 0],
            }}
            transition={{
              y: {
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut'
              }
            }}
            className="relative w-[240px] sm:w-[280px] h-[240px] sm:h-[280px] flex items-center justify-center cursor-pointer group"
            onClick={() => navigate('/about')}
          >
            {/* 3D Depth Backing Plate */}
            <div 
              className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400/30 via-blue-600/40 to-indigo-900/60 blur-xl group-hover:scale-110 transition-transform duration-500"
              style={{ transform: 'translateZ(-40px)' }}
            />

            {/* Glowing Golden Ring Frame */}
            <div 
              className="absolute inset-2 rounded-full border-2 border-amber-400/40 shadow-[0_0_50px_rgba(251,191,36,0.3)] bg-gradient-to-b from-white/15 to-transparent backdrop-blur-md flex items-center justify-center overflow-hidden"
              style={{ transform: 'translateZ(20px)' }}
            >
              <div className="absolute inset-0 bg-radial from-amber-400/10 to-transparent" />
            </div>

            {/* The Official Vidhya Tutorials Logo (Clean, Uncropped, High Resolution) */}
            <div 
              className="relative z-10 w-[85%] h-[85%] bg-white rounded-full p-4 sm:p-5 shadow-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-105 border-4 border-amber-400/50"
              style={{ transform: 'translateZ(50px)' }}
            >
              <img 
                src="/vidhya-tutorials-logo.png" 
                alt="Vidhya Tutorials Official Crest" 
                className="w-full h-full object-contain filter drop-shadow-md"
              />
            </div>

            {/* Micro Badge Beneath Crest */}
            <div 
              className="absolute -bottom-3 px-3.5 py-1 rounded-full bg-slate-900/90 border border-amber-400/50 text-[10px] font-bold text-amber-300 uppercase tracking-widest shadow-xl backdrop-blur-md flex items-center gap-1.5"
              style={{ transform: 'translateZ(70px)' }}
            >
              <span>Vidhya Tutorials</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
          </motion.div>

          {/* ── 4 Floating Interactive Hotspot Nodes (Exact Inspo at 00:05-00:08 in inspo.mp4) ── */}
          {HOTSPOTS.map((spot) => {
            const Icon = spot.icon;
            const isHovered = activeHotspot === spot.id;

            return (
              <div 
                key={spot.id}
                onMouseEnter={() => setActiveHotspot(spot.id)}
                onMouseLeave={() => setActiveHotspot(null)}
                className={`absolute ${spot.position} z-30 transition-all duration-300`}
              >
                <motion.div
                  whileHover={{ scale: 1.06, y: -3 }}
                  className="relative flex items-center gap-2.5 p-2 sm:p-2.5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/20 shadow-xl cursor-pointer hover:border-amber-400/60 transition-all group"
                >
                  {/* Glowing Node Icon */}
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${spot.accentColor} text-slate-950 flex items-center justify-center shadow-md shrink-0 group-hover:rotate-6 transition-transform`}>
                    <Icon size={16} />
                  </div>

                  <div className="text-left pr-2">
                    <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                      {spot.badge}
                    </span>
                    <span className="text-xs font-bold text-white whitespace-nowrap block">
                      {spot.title}
                    </span>
                  </div>

                  {/* Pulsing Hotspot Indicator Dot */}
                  <span className="relative flex h-2.5 w-2.5 ml-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
                  </span>
                </motion.div>

                {/* Popout detailed description tooltip */}
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full mt-2 left-0 w-56 p-3 rounded-xl bg-[#0b1c33] border border-amber-400/40 shadow-2xl text-left z-40 text-xs text-slate-300"
                  >
                    <p className="font-semibold text-white mb-1">{spot.title}</p>
                    <p className="text-[11px] leading-relaxed text-slate-300">{spot.subtitle}</p>
                  </motion.div>
                )}
              </div>
            );
          })}

        </div>

        {/* ── Hero Call to Actions (Inspo-aligned) ── */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="flex flex-wrap items-center justify-center gap-3.5 pt-4"
        >
          <button
            onClick={onOpenFreeDemo}
            className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-sm sm:text-base shadow-xl hover:shadow-amber-400/25 flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
          >
            <Calendar size={18} />
            <span>Book Free Demo Class</span>
          </button>

          <button
            onClick={onOpenEnquiry}
            className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold text-sm sm:text-base shadow-lg flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
          >
            <span>Inquire for Admission</span>
            <ArrowRight size={16} />
          </button>

          <button
            onClick={() => navigate('/admission-form')}
            className="px-5 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-slate-700 text-slate-200 font-semibold text-sm shadow-md flex items-center gap-2 cursor-pointer transition-all hover:border-slate-500"
          >
            <GraduationCap size={16} className="text-blue-400" />
            <span>Formal Admission Form</span>
          </button>
        </motion.div>

      </div>

      {/* ── Bottom Ambient Bar: Inspo Video "The Difference" / Academic Excellence Pill ── */}
      <div className="relative z-20 pb-6 px-4 sm:px-8 max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-4 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full bg-white/10 text-white font-bold uppercase tracking-wider text-[11px] border border-white/15">
            The Difference
          </div>
          <span className="hidden sm:inline text-slate-300">
            Personal Attention • Zero Batch Overcrowding • Proven Results
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
            <span>5.0 ★ Justdial & Google</span>
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1 text-slate-300">
            <MapPin size={13} className="text-blue-400" />
            <span>Matunga Road Campus</span>
          </span>
        </div>
      </div>

    </section>
  );
};
