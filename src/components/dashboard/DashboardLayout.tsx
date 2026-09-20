import React, { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { LayoutDashboard, BookOpen, Award, Calendar, Library, Settings, Search, Bell, Trophy, IndianRupee, Users, FileText, Upload, ArrowLeft, Megaphone, UserPlus, LogOut, Globe, MoreHorizontal, X, ChevronRight } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const studentNav: NavItem[] = [
  { name: 'Overview', href: '/student/dashboard', icon: LayoutDashboard },
  { name: 'My Courses', href: '/student/courses', icon: BookOpen },
];

const teacherNav: NavItem[] = [
  { name: 'Overview', href: '/teacher/dashboard', icon: LayoutDashboard },
  { name: 'Upload Materials', href: '/teacher/materials/upload', icon: Upload },
  { name: 'Attendance', href: '/teacher/attendance', icon: Calendar },
];

const adminNav: NavItem[] = [
  { name: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Admissions', href: '/admin/admissions', icon: UserPlus },
  { name: 'Forms', href: '/admin/forms', icon: FileText },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Announcements', href: '/admin/announcements', icon: Megaphone },
  { name: 'Website Content', href: '/admin/content', icon: Globe },
];

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  // Determine which nav to use
  let activeNav = studentNav;
  if (user?.role === 'TEACHER') activeNav = teacherNav;
  else if (user?.role === 'ADMIN') activeNav = adminNav;

  const rolePath = user?.role?.toLowerCase() || 'admin';

  const avatarSrc = (user?.role === 'ADMIN' && (!user.profilePic || user.profilePic.includes('ui-avatars.com') || user.profilePic === '/admin-avatar.jpg'))
    ? '/admin-avatar.jpg?v=3'
    : (user?.profilePic || '/admin-avatar.jpg?v=3');

  // Primary mobile nav (limit to max 4 + optional "More" sheet trigger)
  const isLargeNav = activeNav.length > 4;
  const primaryMobileNav = isLargeNav ? activeNav.slice(0, 4) : activeNav;
  const extraMobileNav = isLargeNav ? [
    ...activeNav.slice(4),
    { name: 'Profile & Settings', href: `/${rolePath}/settings`, icon: Settings }
  ] : [
    { name: 'Settings', href: `/${rolePath}/settings`, icon: Settings }
  ];

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-background flex flex-col lg:flex-row text-on-surface font-sans lg:p-6 lg:gap-6">
      
      {/* ═══════ MOBILE TOP HEADER ═══════ */}
      <div className="lg:hidden flex items-center justify-between bg-surface border-b border-outline-variant/30 px-4 py-3 sticky top-0 z-50 shadow-sm w-full">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <ArrowLeft className="w-4 h-4 text-primary" />
          </div>
          <div className="flex items-center gap-2">
            <img 
              src="/vidhya-tutorials-logo.png" 
              alt="Vidhya Tutorials" 
              className="w-7 h-7 object-contain rounded-md"
              onError={(e) => { (e.target as HTMLImageElement).src = '/logo.svg'; }}
            />
            <span className="text-sm font-bold text-primary leading-tight">Vidhya</span>
          </div>
        </Link>
        <button 
          onClick={() => navigate(`/${rolePath}/settings`)}
          className="w-9 h-9 rounded-xl overflow-hidden border-2 border-primary/30 shadow-sm"
          title="Profile & Settings"
        >
          <img 
            src={avatarSrc} 
            alt={user?.name || 'Admin'} 
            className="w-full h-full object-cover" 
          />
        </button>
      </div>

      {/* ═══════ FLOATING SIDEBAR ═══════ */}
      <motion.aside
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
        className="hidden lg:flex flex-col w-[250px] h-full shrink-0 select-none"
      >
        <div className="bg-surface rounded-[28px] h-full flex flex-col py-5 px-3.5 shadow-sm border border-outline-variant/30 relative">
          
          {/* Top Brand Header */}
          <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-outline-variant/20 px-1">
            <Link to="/" className="flex items-center gap-2.5 group cursor-pointer min-w-0" title="Vidhya Tutorials">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-outline-variant/30 p-1 flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:border-primary/50 transition-all overflow-hidden shrink-0">
                <img 
                  src="/vidhya-tutorials-logo.png" 
                  alt="Vidhya Tutorials Logo" 
                  className="w-full h-full object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/logo.svg'; }}
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-extrabold text-primary tracking-tight truncate">
                  Vidhya Tutorials
                </span>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                  {user?.role === 'ADMIN' ? 'Admin Portal' : `${user?.role || 'User'} Panel`}
                </span>
              </div>
            </Link>
          </div>

          {/* Back to Public Website Link */}
          <div className="mb-3 px-1">
            <Link 
              to="/" 
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container hover:bg-primary/10 text-on-surface-variant hover:text-primary transition-all duration-200 text-xs font-semibold group border border-outline-variant/20"
              title="Back to Public Website"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform shrink-0" />
              <span>Back to Website</span>
            </Link>
          </div>

          {/* Navigation Section Title */}
          <div className="px-2 mb-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-on-surface-variant/70">
              Menu
            </span>
          </div>

          {/* Main Navigation with Clear Naming */}
          <nav className="flex flex-col gap-1 w-full flex-1 overflow-y-auto no-scrollbar">
            {activeNav.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200
                  ${isActive 
                    ? 'text-primary bg-primary/15 shadow-xs border border-primary/30' 
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60'}
                `}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Bottom Divider */}
          <div className="w-full h-[1px] bg-outline-variant/30 my-3 shrink-0" />

          {/* Bottom User Controls */}
          <div className="flex flex-col gap-2 w-full shrink-0">
            {/* Settings Button */}
            <NavLink
              to={`/${rolePath}/settings`}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200
                ${isActive 
                  ? 'text-primary bg-primary/15 shadow-xs border border-primary/30' 
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60'}
              `}
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span>Settings</span>
            </NavLink>

            {/* User Profile Info Card */}
            <div 
              onClick={() => navigate(`/${rolePath}/settings`)}
              className="flex items-center gap-2.5 p-2 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/20 transition-all cursor-pointer group"
              title="Click to Open Profile Settings"
            >
              <div className="relative w-8 h-8 rounded-xl overflow-hidden ring-2 ring-primary/30 shrink-0">
                <img 
                  src={avatarSrc} 
                  alt={user?.name || 'User'} 
                  className="w-full h-full object-cover" 
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 border-2 border-surface rounded-full"></span>
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <p className="font-bold text-xs text-on-surface truncate leading-tight">
                  {user?.name || 'Administrator'}
                </p>
                <p className="text-[10px] text-primary font-bold uppercase tracking-wider truncate">
                  {user?.role || 'ADMIN'}
                </p>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={async () => {
                await logout();
                navigate('/');
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-500 hover:text-white hover:bg-rose-600 transition-all cursor-pointer border border-rose-500/20 hover:border-rose-600 w-full"
              title="Log out of portal"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </motion.aside>

      {/* ═══════ MAIN CONTENT ═══════ */}
      <main className="flex-1 min-w-0 min-h-0 relative p-4 pb-24 lg:p-0 overflow-y-auto custom-scrollbar lg:pr-2">
        <div className="w-full max-w-[1200px] mx-auto flex flex-col min-h-full pb-8">
          <ErrorBoundary fallbackTitle="Could not load dashboard section">
            <Outlet />
          </ErrorBoundary>
        </div>
      </main>

      {/* ═══════ MOBILE BOTTOM NAVIGATION ═══════ */}
      <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-outline-variant/30 flex items-center justify-around px-2 py-1.5 lg:hidden z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        {primaryMobileNav.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) => `
              relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 min-w-[56px] min-h-[44px]
              ${isActive ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary font-medium'}
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 mb-0.5 ${isActive ? 'scale-110 text-primary' : ''} transition-transform`} />
                <span className="text-[10px] tracking-tight truncate max-w-[64px]">{item.name}</span>
                {isActive && (
                  <motion.div 
                    layoutId="mobileNavIndicator"
                    className="absolute -bottom-0.5 w-1.5 h-1.5 bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}

        {/* More Menu Trigger (for Admin or multi-item roles) */}
        {isLargeNav ? (
          <button
            onClick={() => setMoreMenuOpen(true)}
            className="relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-on-surface-variant hover:text-primary font-medium min-w-[56px] min-h-[44px] cursor-pointer"
            aria-label="More navigation options"
          >
            <MoreHorizontal className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">More</span>
          </button>
        ) : (
          <NavLink
            to={`/${rolePath}/settings`}
            className={({ isActive }) => `
              relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 min-w-[56px] min-h-[44px]
              ${isActive ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary font-medium'}
            `}
          >
            <Settings className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Settings</span>
          </NavLink>
        )}
      </nav>

      {/* ═══════ MOBILE "MORE" BOTTOM SHEET ═══════ */}
      <AnimatePresence>
        {moreMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMoreMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[60] lg:hidden"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="fixed bottom-0 left-0 right-0 bg-surface rounded-t-3xl border-t border-outline-variant/30 p-6 z-[70] shadow-2xl lg:hidden flex flex-col max-h-[80vh] overflow-y-auto"
            >
              {/* Top Handle & Title */}
              <div className="w-12 h-1.5 bg-outline-variant/40 rounded-full mx-auto mb-4" />
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                    {user?.role?.[0] || 'A'}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-on-surface">Additional Tools & Settings</h3>
                    <p className="text-[11px] text-on-surface-variant font-medium">{user?.role} Portal Navigation</p>
                  </div>
                </div>
                <button
                  onClick={() => setMoreMenuOpen(false)}
                  className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-container text-on-surface-variant cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Extra Navigation Links */}
              <div className="flex flex-col gap-1.5 py-2">
                {extraMobileNav.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={() => setMoreMenuOpen(false)}
                    className={({ isActive }) => `
                      flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all min-h-[46px]
                      ${isActive 
                        ? 'bg-primary/15 text-primary border border-primary/30 shadow-xs' 
                        : 'text-on-surface hover:bg-surface-container-high/60'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4 text-primary" />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-on-surface-variant/60" />
                  </NavLink>
                ))}
              </div>

              {/* Bottom Actions: Website & Sign Out */}
              <div className="pt-4 mt-2 border-t border-outline-variant/20 flex flex-col gap-2.5">
                <Link
                  to="/"
                  onClick={() => setMoreMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface border border-outline-variant/20 transition-all min-h-[44px]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Public Website</span>
                </Link>
                <button
                  onClick={async () => {
                    setMoreMenuOpen(false);
                    await logout();
                    navigate('/');
                  }}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500 hover:text-white text-xs font-bold text-rose-600 transition-all border border-rose-500/20 min-h-[44px] cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out of Portal</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
