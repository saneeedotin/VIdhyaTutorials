import { useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ScrollTicker } from '../ui/ScrollTicker';
import { GoogleReviewsWall } from './GoogleReviewsWall';
import { InstituteWelcome } from './InstituteWelcome';
import { VikasSirSpotlight } from './VikasSirSpotlight';
import { LiveNoticeBoard } from './LiveNoticeBoard';
import { FreeDemoModal } from '../ui/FreeDemoModal';
import { EnquiryModal } from '../ui/EnquiryModal';
import { CounselingModal } from '../ui/CounselingModal';
import { apiClient } from '../../api/apiClient';

const FadeInWhenVisible = ({ children, delay = 0, className = "", onClick }: { children: ReactNode, delay?: number, className?: string, onClick?: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export function LandingPage() {
  const navigate = useNavigate();
  const [isFreeDemoOpen, setIsFreeDemoOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isCounselingOpen, setIsCounselingOpen] = useState(false);
  const [tickerItems, setTickerItems] = useState<string[]>([
    "Excellence in Education", 
    "Join Vidhya Tutorials", 
    "Learn From The Best"
  ]);

  useEffect(() => {
    // Fetch live announcements to dynamically feed into the top scroll ticker
    apiClient.get('/api/announcements')
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          const liveTitles = res.data
            .filter((a: any) => a.isActive)
            .map((a: any) => `📢 ${a.title}`);
          if (liveTitles.length > 0) {
            setTickerItems([...liveTitles, "Excellence in Education", "Join Vidhya Tutorials 2026-27"]);
          }
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-surface-container-low text-on-surface font-body-md overflow-x-hidden w-full">

      {/* Hero Section with Clean White Aesthetic & Realistic Classroom Image */}
      <section className="relative min-h-[85vh] lg:h-[92vh] flex items-center overflow-hidden z-0 bg-white dark:bg-slate-950 text-slate-900 dark:text-white border-b border-slate-200/60 dark:border-slate-800">
        {/* Realistic Classroom Image Blended with Clean White Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Real Classroom Photo positioned on right side */}
          <div className="absolute right-0 top-0 bottom-0 w-full lg:w-3/5 h-full overflow-hidden">
            <img 
              src="/assets/wings/school.jpg" 
              alt="Vidhya Tutorials Classroom" 
              className="w-full h-full object-cover object-top opacity-35 lg:opacity-65 scale-105 filter saturate-[1.1]"
            />
            {/* Smooth gradient fading into white on the left and bottom */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent dark:from-slate-950 dark:via-slate-950/85 dark:to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/40 dark:from-slate-950 dark:via-transparent dark:to-slate-950/40" />
          </div>

          {/* Warm ambient subtle highlights */}
          <div className="absolute top-10 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-[1280px] mx-auto w-full px-4 md:px-[64px] py-16 md:py-24">
          <div className="max-w-2xl lg:max-w-3xl">
            {/* Tagline Badge */}
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/70 dark:border-blue-800/60 text-primary dark:text-blue-300 rounded-full text-xs font-bold tracking-widest uppercase mb-6 shadow-xs">
              ✨ Creators of Creative Minds
            </span>
            
            {/* Hero Heading */}
            <h1 className="text-3xl sm:text-[46px] md:text-[58px] leading-[1.14] tracking-[-0.02em] font-extrabold text-slate-900 dark:text-white mb-5 sm:mb-6">
              Creators of <span className="text-primary dark:text-blue-400 italic font-serif">Creative Minds</span>
            </h1>

            {/* Description */}
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base md:text-[18px] mb-6 sm:mb-8 max-w-xl leading-relaxed font-normal">
              Empowering the next generation of leaders through personalized mentorship, rigorous academic discipline, and an unbroken tradition of board toppers since 2007.
            </p>

            {/* Key Accreditations Bar (Clean Light Aesthetic) */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3.5 mb-8 sm:mb-10 text-xs sm:text-sm font-semibold">
              <div className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-slate-800 dark:text-slate-200">
                <span className="text-amber-500 font-bold text-sm sm:text-base">★ 5.0</span>
                <span>Google Reviews</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-slate-800 dark:text-slate-200">
                <span className="text-amber-500 font-bold text-sm sm:text-base">★ 5.0</span>
                <span>Justdial Rated</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-slate-800 dark:text-slate-200">
                <span className="text-primary dark:text-blue-400 font-bold">6th–12th</span>
                <span>School • Commerce • Science</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/courses')}
                className="bg-primary hover:bg-primary/90 text-white px-7 py-3.5 sm:px-8 sm:py-4 rounded-xl font-bold text-sm sm:text-[16px] shadow-lg flex items-center justify-center gap-2 cursor-pointer group transition-all min-h-[48px]"
              >
                <span>Explore Programs</span>
                <span className="material-symbols-outlined transition-transform duration-300 group-hover:translate-x-1.5 text-lg">arrow_forward</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsFreeDemoOpen(true)}
                className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white px-6 py-3.5 sm:px-7 sm:py-4 rounded-xl font-bold text-sm sm:text-[16px] shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all min-h-[48px]"
              >
                <span>Book Free Demo</span>
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 w-full shadow-[0_-20px_50px_rgba(0,0,0,0.1)] overflow-hidden bg-surface-container-low">
        <ScrollTicker items={tickerItems} className="bg-primary text-white dark:text-[#001b3c] border-b border-white/10 dark:border-[#001b3c]/20" />
        <div className="pt-10 sm:pt-16 pb-20 sm:pb-24 space-y-12 sm:space-y-16 md:space-y-24 px-3.5 sm:px-6 md:px-[64px]">

          {/* Welcome & Institute Identity Section (Featuring Official Logo) */}
          <InstituteWelcome />

          {/* Live Notice Board & Announcements (Controlled from Admin Panel) */}
          <LiveNoticeBoard />

          {/* Academic Wings Section */}
          <section className="max-w-[1280px] mx-auto" id="wings">
            <div className="bg-surface theme-dark-card rounded-3xl shadow-xl border border-outline-variant/20 p-5 sm:p-8 md:p-14">
              <FadeInWhenVisible className="text-center mb-10 sm:mb-14">
                <h2 className="font-h2 text-2xl sm:text-[28px] md:text-[32px] font-semibold text-primary mb-3">Academic Wings</h2>
                <div className="h-1.5 w-20 bg-secondary mx-auto rounded-full mb-4 animate-pulse"></div>
                <p className="max-w-2xl mx-auto text-on-surface-variant font-body-lg text-sm sm:text-base md:text-[18px] leading-relaxed">
                  Tailored learning paths designed to ignite curiosity and foster specialization across diverse fields of study.
                </p>
              </FadeInWhenVisible>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <FadeInWhenVisible onClick={() => navigate('/courses?wing=school')} delay={0} className="group bg-surface-bright rounded-xl border border-outline-variant/30 p-2 transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 cursor-pointer card-3d">
                  <div className="overflow-hidden rounded-lg aspect-[4/5] relative img-zoom">
                    <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="School" src="/assets/wings/school.jpg" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 transition-opacity duration-300">
                      <h3 className="text-white font-h3 text-[24px] font-medium mb-2 group-hover:text-primary-fixed-dim transition-colors">School</h3>
                      <p className="text-white/80 text-sm transform transition-transform duration-300 group-hover:translate-y-[-2px]">Foundational excellence for grades 6-10.</p>
                    </div>
                  </div>
                </FadeInWhenVisible>

                <FadeInWhenVisible onClick={() => navigate('/courses?wing=commerce')} delay={0.1} className="group bg-surface-bright rounded-xl border border-outline-variant/30 p-2 transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 cursor-pointer card-3d">
                  <div className="overflow-hidden rounded-lg aspect-[4/5] relative img-zoom">
                    <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Commerce" src="/assets/wings/commerce.jpg" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 transition-opacity duration-300">
                      <h3 className="text-white font-h3 text-[24px] font-medium mb-2 group-hover:text-primary-fixed-dim transition-colors">Commerce</h3>
                      <p className="text-white/80 text-sm transform transition-transform duration-300 group-hover:translate-y-[-2px]">Empowering future leaders in business and finance.</p>
                    </div>
                  </div>
                </FadeInWhenVisible>

                <FadeInWhenVisible onClick={() => navigate('/courses?wing=science')} delay={0.2} className="group bg-surface-bright rounded-xl border border-outline-variant/30 p-2 transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 cursor-pointer card-3d relative">
                  <div className="overflow-hidden rounded-lg aspect-[4/5] relative img-zoom">
                    <span className="absolute top-3 right-3 z-10 px-2.5 py-1 bg-cyan-400 text-slate-950 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                      ✨ New 2026
                    </span>
                    <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Science" src="/assets/wings/science.jpg" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 transition-opacity duration-300">
                      <h3 className="text-white font-h3 text-[24px] font-medium mb-2 group-hover:text-primary-fixed-dim transition-colors">Science</h3>
                      <p className="text-white/80 text-sm transform transition-transform duration-300 group-hover:translate-y-[-2px]">Newly launched in 2026 for 11th & 12th PCM, PCB & PCMB.</p>
                    </div>
                  </div>
                </FadeInWhenVisible>

                <FadeInWhenVisible onClick={() => navigate('/courses?wing=neet')} delay={0.3} className="group bg-surface-bright rounded-xl border border-outline-variant/30 p-2 transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 cursor-pointer card-3d">
                  <div className="overflow-hidden rounded-lg aspect-[4/5] relative img-zoom">
                    <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="NEET/CET" src="/assets/wings/neet.jpg" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 transition-opacity duration-300">
                      <h3 className="text-white font-h3 text-[24px] font-medium mb-2 group-hover:text-primary-fixed-dim transition-colors">NEET/CET</h3>
                      <p className="text-white/80 text-sm transform transition-transform duration-300 group-hover:translate-y-[-2px]">Intensive coaching for medical and engineering dreams.</p>
                    </div>
                  </div>
                </FadeInWhenVisible>
              </div>
            </div>
          </section>

          {/* Vikas Sir — Founder & Senior Faculty Spotlight */}
          <VikasSirSpotlight onScheduleCounseling={() => setIsCounselingOpen(true)} />

          {/* Google Reviews Sticky Notes Wall */}
          <GoogleReviewsWall />


        </div>
      </div>

      {/* Free Demo Modal */}
      <FreeDemoModal isOpen={isFreeDemoOpen} onClose={() => setIsFreeDemoOpen(false)} />

      {/* Enquiry Modal */}
      <EnquiryModal isOpen={isEnquiryOpen} onClose={() => setIsEnquiryOpen(false)} />

      {/* 1-on-1 Counseling Modal for Vikas Sir */}
      <CounselingModal isOpen={isCounselingOpen} onClose={() => setIsCounselingOpen(false)} />
    </div>
  );
}
