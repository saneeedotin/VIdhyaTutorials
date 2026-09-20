import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Moon, Sun, MapPin, Phone, Mail, Instagram, Clock, PhoneCall, X, ExternalLink, Copy, Check, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SmoothScroll } from './SmoothScroll';
import { AdmissionModalPopup } from './ui/AdmissionModalPopup';
import { apiClient } from '../api/apiClient';

interface LayoutPublicProps {
  children?: React.ReactNode;
}

export const LayoutPublic: React.FC<LayoutPublicProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  
  const currentRoute = location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [activeContact, setActiveContact] = useState<'location' | 'phone' | 'email' | 'instagram' | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Real-time visitor analytics tracking
  useEffect(() => {
    try {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const isTablet = /iPad|Tablet/i.test(navigator.userAgent);
      const device = isTablet ? 'Tablet' : isMobile ? 'Mobile' : 'Desktop';
      const browser = navigator.userAgent.includes('Chrome') ? 'Chrome' : navigator.userAgent.includes('Safari') ? 'Safari' : 'Browser';

      apiClient.post('/api/analytics/track', {
        path: currentRoute,
        pageTitle: document.title || 'Vidhya Tutorials',
        referrer: document.referrer || 'Direct',
        device,
        browser,
        location: 'Mumbai, Maharashtra'
      }).catch(() => {});
    } catch (e) {
      // ignore
    }
  }, [currentRoute]);

  const onNavigate = (route: string) => {
    if (route === 'home') navigate('/');
    else navigate(`/${route}`);
  };

  const onOpenProfileSelector = () => {
    if (isAuthenticated && user) {
      navigate(`/${user.role.toLowerCase()}/dashboard`);
    } else {
      navigate('/login');
    }
  };

  const isActive = (route: string) => {
    if (route === 'home' && currentRoute === '/') return true;
    if (currentRoute === `/${route}`) return true;
    return false;
  };

  const normalizedRoute = currentRoute.replace(/\/$/, '') || '/';
  const heroRoutes = ['/', '/about', '/admissions', '/courses', '/life', '/gallery', '/campus-life', '/our-locations', '/achievers', '/wall-of-fame'];
  const darkHeroRoutes = ['/about', '/admissions', '/courses', '/life', '/gallery', '/campus-life', '/our-locations', '/achievers', '/wall-of-fame'];
  const isDarkHeroAtTop = !isScrolled && darkHeroRoutes.includes(normalizedRoute);

  const navItemClass = (route: string) => {
    const active = isActive(route);
    
    if (active) {
      return `border-b-2 font-bold pb-1 transition-all duration-300 ${isDarkHeroAtTop ? 'text-white border-white' : 'text-primary dark:text-white border-primary dark:border-white'}`;
    }
    return `font-medium transition-colors ${isDarkHeroAtTop ? 'text-white/80 hover:text-white' : 'text-on-surface-variant dark:text-white/80 hover:text-primary dark:hover:text-white'}`;
  };

  const headerClass = () => {
    if (isScrolled) {
      return "fixed top-0 w-full z-[90] bg-surface-bright/90 dark:bg-[#00132b]/90 backdrop-blur-md shadow-md border-b border-outline-variant/20 transition-all duration-300 pointer-events-auto";
    }
    return "fixed top-0 w-full z-[90] bg-transparent pointer-events-none transition-all duration-300";
  };

  return (
    <SmoothScroll>
    <div className="w-full min-h-screen bg-background text-on-surface font-body-md flex flex-col transition-colors select-none overflow-x-hidden relative">
      
      {/* TopNavBar */}
      <header ref={menuRef} className={`${headerClass()} print:hidden`}>
        <div className="flex justify-between items-center max-w-[1280px] mx-auto px-4 sm:px-6 md:px-[64px] h-20">
          
          <div className="flex items-center cursor-pointer pointer-events-auto px-1 py-1 rounded-2xl transition-all" onClick={() => onNavigate('home')}>
            <img alt="Vidhya Tutorials Logo" className="h-9 sm:h-10 w-auto object-contain shrink-0" src="/logo.svg?v=1783890290950" />
            <motion.span 
              initial={false}
              animate={{ 
                width: isScrolled ? 0 : 'auto', 
                opacity: isScrolled ? 0 : 1,
                marginLeft: isScrolled ? 0 : 10
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`font-h3 text-lg sm:text-h3 font-bold tracking-tight whitespace-nowrap overflow-hidden transition-colors duration-300 ${
                isDarkHeroAtTop ? 'text-white drop-shadow-sm' : 'text-primary dark:text-white'
              }`}
            >
              Vidhya Tutorials
            </motion.span>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Quick action: Apply Now (hidden on tiny screens, visible on sm+) */}
            <button
              onClick={() => navigate('/apply')}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
                isDarkHeroAtTop 
                  ? 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-md'
                  : 'bg-primary/10 hover:bg-primary/20 text-primary dark:text-blue-300'
              }`}
            >
              <span>Apply 2026-27</span>
              <ArrowUpRight size={14} />
            </button>

            <button 
              onClick={() => setMobileMenuOpen(true)} 
              className={`min-w-[44px] min-h-[44px] p-2.5 rounded-2xl transition-all duration-300 flex items-center justify-center cursor-pointer ${
                isDarkHeroAtTop 
                  ? 'text-white hover:bg-white/10' 
                  : 'text-primary dark:text-white hover:bg-primary/10 dark:hover:bg-white/10'
              }`}
              aria-label="Open Navigation Menu"
            >
              <span className="material-symbols-outlined text-3xl drop-shadow-md">menu</span>
            </button>
          </div>
        </div>

        {/* Full Mobile Drawer Navigation with Backdrop */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => setMobileMenuOpen(false)}
                className="pointer-events-auto fixed inset-0 bg-slate-950/65 backdrop-blur-xs z-[95]"
              />

              {/* Slide-out Drawer */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className="pointer-events-auto fixed top-0 right-0 h-full w-[min(340px,88vw)] bg-surface-bright dark:bg-surface-container-highest shadow-2xl border-l border-outline-variant/30 flex flex-col z-[100] overflow-hidden"
              >
                {/* Drawer Top Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/20 bg-surface-container-low/40">
                  <div className="flex items-center gap-2.5" onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}>
                    <img src="/logo.svg?v=1783890290950" alt="Vidhya Tutorials" className="h-8 w-auto object-contain" />
                    <span className="font-bold text-base text-primary dark:text-white">Vidhya Tutorials</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container cursor-pointer transition-colors"
                    aria-label="Close menu"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Nav Links */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 no-scrollbar">
                  <nav className="flex flex-col gap-1.5">
                    {[
                      { route: 'home', label: 'Home', icon: 'home' },
                      { route: 'courses', label: 'Courses & Wings', icon: 'school' },
                      { route: 'admissions', label: 'Admissions 2026-27', icon: 'how_to_reg' },
                      { route: 'gallery', label: 'Campus Gallery', icon: 'photo_library' },
                      { route: 'achievers', label: 'Wall of Fame / Achievers', icon: 'workspace_premium' },
                      { route: 'about', label: 'About Vidhya', icon: 'info' },
                      { route: 'our-locations', label: 'Locate Us (Matunga)', icon: 'location_on' },
                    ].map((item) => (
                      <button 
                        key={item.route}
                        onClick={() => { onNavigate(item.route); setMobileMenuOpen(false); }} 
                        className={`text-left text-base font-semibold py-3 px-3.5 rounded-xl transition-all duration-200 flex items-center justify-between group cursor-pointer ${
                          isActive(item.route) 
                            ? 'text-primary bg-primary/10 font-bold shadow-xs' 
                            : 'text-on-surface-variant dark:text-white/80 hover:text-primary hover:bg-surface-container'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-[20px] text-primary/80 dark:text-blue-400">{item.icon}</span>
                          <span>{item.label}</span>
                        </div>
                        <span className="material-symbols-outlined text-sm opacity-50 group-hover:opacity-100 transition-opacity">chevron_right</span>
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Drawer Footer Actions */}
                <div className="p-5 bg-surface-container-low dark:bg-surface-container-low/50 border-t border-outline-variant/20 flex flex-col gap-3 shrink-0">
                  <button 
                    onClick={() => setIsDark(!isDark)} 
                    className="flex justify-between items-center w-full px-4 py-2.5 bg-surface-bright dark:bg-surface-container rounded-xl font-bold text-xs text-on-surface-variant hover:text-primary transition-all border border-outline-variant/20 cursor-pointer min-h-[44px]"
                  >
                    <span>{isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
                    {isDark ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} className="text-primary" />}
                  </button>
                  
                  {isAuthenticated && user ? (
                    <div className="flex flex-col gap-2">
                      <button onClick={() => { onOpenProfileSelector(); setMobileMenuOpen(false); }} className="bg-primary/10 text-primary border border-primary/20 px-4 py-2.5 rounded-xl font-bold hover:bg-primary/20 transition-all text-xs w-full cursor-pointer min-h-[44px]">
                        My Portal ({user.role})
                      </button>
                      <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="bg-error text-white px-4 py-2.5 rounded-xl font-bold hover:bg-error/90 transition-all text-xs w-full cursor-pointer min-h-[44px]">
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => { navigate('/apply'); setMobileMenuOpen(false); }}
                        className="bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-xl font-bold text-xs w-full shadow-md flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
                      >
                        <span>Online Admission Form</span>
                        <ArrowUpRight size={14} />
                      </button>
                      <button 
                        onClick={() => { onOpenProfileSelector(); setMobileMenuOpen(false); }} 
                        className="bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/30 px-4 py-2.5 rounded-xl font-bold transition-all text-xs w-full cursor-pointer min-h-[44px]"
                      >
                        Admin Portal Login
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* Main Core Content container */}
      <main className={`flex-1 ${heroRoutes.includes(normalizedRoute) ? '' : 'mt-20'} print:mt-0`}>{children || <Outlet />}</main>

      {/* ═══════════ VIDYA TUTORIALS MASTER FOOTER ═══════════ */}
      <footer className="bg-white dark:bg-[#071324] text-gray-800 dark:text-slate-200 pt-12 md:pt-16 pb-8 border-t-4 border-primary shadow-2xl shrink-0 mt-auto font-body-md transition-colors select-none print:hidden">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8 mb-12"
          >
            {/* Col 1: Institute Brand & Socials (Col-span 2) */}
            <div className="lg:col-span-2 flex flex-col">
              <div 
                onClick={() => onNavigate('home')} 
                className="flex items-center gap-3 mb-4 cursor-pointer group w-fit"
              >
                <img 
                  src="/logo.svg?v=1783890290950" 
                  alt="Vidhya Tutorials" 
                  className="h-11 w-auto object-contain transition-transform group-hover:scale-105" 
                />
                <div className="flex flex-col">
                  <span className="font-h2 text-2xl font-bold text-primary dark:text-white leading-tight tracking-tight">
                    Vidhya Tutorials
                  </span>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-secondary dark:text-blue-400">
                    Defining Coaching Excellence
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed mb-2.5">
                Your trusted partner in academic success. Defining the standard of coaching excellence for over two decades with dedicated personal attention from school to college level.
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed mb-6">
                Empowering students to achieve their highest potential through concept clarity, disciplined test series, and personalized mentorship.
              </p>

              {/* Instagram Exclusive Showcase Button */}
              <div className="mt-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse"></span>
                  <span>Connect With Us</span>
                </p>

                <motion.a 
                  href="https://www.instagram.com/vidhya_tutorials" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl bg-gradient-to-r from-[#f09433]/15 via-[#dc2743]/15 to-[#bc1888]/15 hover:from-[#f09433]/25 hover:via-[#dc2743]/25 hover:to-[#bc1888]/25 border border-pink-500/30 hover:border-pink-500/60 shadow-sm hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-300 cursor-pointer w-full max-w-[260px]"
                  aria-label="Follow Vidhya Tutorials on Instagram"
                >
                  {/* Glowing Instagram Icon Badge */}
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shadow-md shadow-pink-500/30 shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Instagram size={20} className="stroke-[2.2]" />
                  </div>

                  {/* Handle & Follow Callout */}
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-[#dc2743] dark:group-hover:text-pink-400 transition-colors flex items-center gap-1 truncate">
                      <span>@vidhya_tutorials</span>
                      <ExternalLink size={11} className="shrink-0 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </span>
                    <span className="text-[11px] text-gray-500 dark:text-slate-400 font-medium">
                      Follow us on Instagram
                    </span>
                  </div>
                </motion.a>
              </div>
            </div>

            {/* Col 2: Quick Links (Col-span 1) */}
            <div className="lg:col-span-1 flex flex-col">
              <h4 className="text-gray-900 dark:text-white font-bold text-base md:text-lg mb-4 border-b-2 border-primary dark:border-blue-400 pb-1.5 w-max">
                Quick Links
              </h4>
              <ul className="space-y-2.5">
                {[
                  { name: 'Home', href: '/' },
                  { name: 'About Us', href: '/about' },
                  { name: 'Courses', href: '/courses' },
                  { name: 'Gallery', href: '/gallery' },
                  { name: 'Admissions 2026', href: '/admissions' },
                  { name: 'Life at Vidhya', href: '/life' },
                  { name: 'Our Center', href: '/our-locations' },
                ].map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(link.href);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-primary dark:hover:text-blue-400 hover:translate-x-1.5 transition-all duration-200 inline-flex items-center gap-1.5"
                    >
                      <span className="text-primary/60 dark:text-blue-400/70 text-xs">›</span>
                      <span>{link.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Our Courses (Col-span 1) */}
            <div className="lg:col-span-1 flex flex-col">
              <h4 className="text-gray-900 dark:text-white font-bold text-base md:text-lg mb-4 border-b-2 border-primary dark:border-blue-400 pb-1.5 w-max">
                Our Courses
              </h4>
              <ul className="space-y-2.5">
                {[
                  { title: 'Class 7–10 (Foundation)', href: '/courses?wing=school#wings' },
                  { title: 'Class 11–12 Science', href: '/courses?wing=science#wings' },
                  { title: 'Class 11–12 Commerce', href: '/courses?wing=commerce#wings' },
                  { title: 'Competitive Exams', href: '/courses?wing=neet#wings' },
                  { title: 'Regular Batch', href: '/courses?wing=all#wings' },
                  { title: 'Test Series & Mock', href: '/courses?wing=test-series#wings' },
                ].map((course) => (
                  <li key={course.title}>
                    <a
                      href={course.href}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(course.href);
                        const element = document.getElementById('wings');
                        if (element && window.location.pathname === '/courses') {
                          const yOffset = -90;
                          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                          window.scrollTo({ top: y, behavior: 'smooth' });
                        }
                      }}
                      className="text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-primary dark:hover:text-blue-400 hover:translate-x-1.5 transition-all duration-200 inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="text-primary/60 dark:text-blue-400/70 text-xs">›</span>
                      <span>{course.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4: Contact Info with colorful icons (Col-span 2) */}
            <div className="lg:col-span-2 flex flex-col">
              <h4 className="text-gray-900 dark:text-white font-bold text-base md:text-lg mb-4 border-b-2 border-primary dark:border-blue-400 pb-1.5 w-max">
                Contact Info
              </h4>
              
              <ul className="space-y-3.5">
                {/* Location */}
                <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-slate-300">
                  <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/40 flex items-center justify-center shrink-0 mt-0.5 border border-red-200 dark:border-red-900/40">
                    <MapPin size={17} className="text-red-500" />
                  </div>
                  <div className="flex flex-col">
                    <a 
                      href="https://www.google.com/maps/search/?api=1&query=Vidhya+Tutorials+90+Feet+Road+Kumbhar+Wada+Mumbai"
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-primary dark:hover:text-blue-400 leading-snug transition-colors group flex items-start gap-1"
                    >
                      <span>Matunga Road, Mumbai - 400016</span>
                      <ExternalLink size={13} className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-1 text-primary" />
                    </a>
                  </div>
                </li>

                {/* Phone Numbers */}
                <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-slate-300">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200 dark:border-emerald-900/40">
                    <PhoneCall size={17} className="text-emerald-500" />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    {/* Primary Line */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <a 
                        href="tel:+918898117343" 
                        className="hover:text-primary dark:hover:text-blue-400 font-bold font-mono text-[15px] text-gray-900 dark:text-white transition-colors"
                      >
                        +91 88981 17343
                      </a>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('+91 88981 17343', 'phone1')}
                        className="text-xs text-gray-400 hover:text-primary px-1.5 py-0.5 rounded bg-gray-100 dark:bg-slate-800 transition-colors cursor-pointer ml-auto"
                        title="Copy primary phone number"
                      >
                        {copiedKey === 'phone1' ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                      </button>
                    </div>

                    {/* Helpline / Alternate Line */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <a 
                        href="tel:+918765432109" 
                        className="hover:text-primary dark:hover:text-blue-400 font-bold font-mono text-[15px] text-gray-900 dark:text-white transition-colors"
                      >
                        +91 87654 32109
                      </a>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('+91 87654 32109', 'phone2')}
                        className="text-xs text-gray-400 hover:text-primary px-1.5 py-0.5 rounded bg-gray-100 dark:bg-slate-800 transition-colors cursor-pointer ml-auto"
                        title="Copy helpline phone number"
                      >
                        {copiedKey === 'phone2' ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>
                </li>

                {/* Email (Standard Mailto) */}
                <li className="flex items-center gap-3 text-sm text-gray-600 dark:text-slate-300">
                  <a
                    href="mailto:vidhyatutorials22@gmail.com?subject=Inquiry%20Regarding%20Vidhya%20Tutorials"
                    className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-900/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors group cursor-pointer"
                    title="Send an email to Vidhya Tutorials"
                  >
                    <Mail size={17} className="text-amber-500 group-hover:scale-110 transition-transform" />
                  </a>
                  <div className="flex items-center gap-2">
                    <a 
                      href="mailto:vidhyatutorials22@gmail.com?subject=Inquiry%20Regarding%20Vidhya%20Tutorials" 
                      className="hover:text-primary dark:hover:text-blue-400 font-medium transition-colors cursor-pointer"
                      title="Click to send email"
                    >
                      vidhyatutorials22@gmail.com
                    </a>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('vidhyatutorials22@gmail.com', 'email')}
                      className="text-xs text-gray-400 hover:text-primary px-1.5 py-0.5 rounded bg-gray-100 dark:bg-slate-800 transition-colors cursor-pointer"
                      title="Copy email address"
                    >
                      {copiedKey === 'email' ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                    </button>
                  </div>
                </li>

                {/* Timings */}
                <li className="flex items-center gap-3 text-sm text-gray-600 dark:text-slate-300">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-900/40">
                    <Clock size={17} className="text-blue-500" />
                  </div>
                  <span className="font-medium text-xs sm:text-sm">Mon – Sat: 7:00 AM – 10:00 PM | Sun: 7:00 AM – 9:00 PM</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Bottom Copyright & Accreditation Bar */}
          <div className="border-t border-gray-200 dark:border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-gray-500 dark:text-slate-400">
            <p className="text-center sm:text-left">
              © {new Date().getFullYear()} <span className="font-semibold text-gray-800 dark:text-white">Vidhya Tutorials</span>. All rights reserved.
            </p>

            <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
              <a
                href="https://www.justdial.com/Mumbai/Vidhya-Tutorials-Dharavi/022PXX22-XX22-181229042515-M5C7_BZDET"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors font-semibold flex items-center gap-1.5"
                title="Vidhya Tutorials on Justdial"
              >
                <span className="px-1.5 py-0.5 rounded bg-[#F85A00] text-white text-[9px] font-black">JD</span>
                <span>Justdial 5.0 ★</span>
              </a>
              <span className="text-gray-300 dark:text-slate-700">•</span>
              <a 
                href="/admissions" 
                onClick={(e) => { e.preventDefault(); navigate('/admissions'); }}
                className="hover:text-primary dark:hover:text-blue-400 transition-colors font-medium"
              >
                Admissions
              </a>
              <span className="text-gray-300 dark:text-slate-700">•</span>
              <a 
                href="/login" 
                onClick={(e) => { e.preventDefault(); navigate('/login'); }}
                className="hover:text-primary dark:hover:text-blue-400 transition-colors font-medium flex items-center gap-1 text-primary dark:text-blue-400"
              >
                <span>Portal Login</span>
                <ArrowUpRight size={13} />
              </a>
            </div>
          </div>

        </div>
      </footer>

      {/* Academic Year Admissions Auto-Popup & Floating Side Trigger */}
      <AdmissionModalPopup />
    </div>
    </SmoothScroll>
  );
};
