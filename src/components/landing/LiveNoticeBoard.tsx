import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Megaphone, 
  Calendar, 
  Clock, 
  Tag, 
  ChevronRight, 
  Sparkles, 
  Bell, 
  AlertCircle,
  X,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { apiClient } from '../../api/apiClient';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export interface AnnouncementItem {
  _id: string;
  type?: string;
  title: string;
  date?: string;
  time?: string;
  imgUrl?: string;
  tags?: string[];
  content?: string;
  isActive: boolean;
  createdAt?: string;
}

export function LiveNoticeBoard() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementItem | null>(null);

  useEffect(() => {
    fetchLiveAnnouncements();
  }, []);

  const fetchLiveAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/api/announcements');
      if (Array.isArray(res.data)) {
        setAnnouncements(res.data.filter((a: AnnouncementItem) => a.isActive));
      }
    } catch (err) {
      console.error('Failed to fetch public announcements', err);
    } finally {
      setLoading(false);
    }
  };

  // If no announcements at all and not loading, don't show an empty broken section
  if (!loading && announcements.length === 0) {
    return null;
  }

  const filtered = announcements.filter(item => {
    if (activeFilter === 'ALL') return true;
    const typeUpper = (item.type || '').toUpperCase();
    if (activeFilter === 'EXAM') return typeUpper.includes('EXAM') || typeUpper.includes('TEST');
    if (activeFilter === 'WORKSHOP') return typeUpper.includes('WORKSHOP') || typeUpper.includes('EVENT');
    if (activeFilter === 'MEETING') return typeUpper.includes('MEET') || typeUpper.includes('PTM') || typeUpper.includes('NEWS');
    return true;
  });

  const getTypeBadge = (type?: string) => {
    const t = (type || 'NOTICE').toUpperCase();
    if (t.includes('EXAM') || t.includes('TEST')) {
      return { label: 'Exam / Test', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' };
    }
    if (t.includes('WORKSHOP')) {
      return { label: 'Workshop', color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20' };
    }
    if (t.includes('MEET') || t.includes('PTM')) {
      return { label: 'PTM / Meeting', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' };
    }
    if (t.includes('EVENT')) {
      return { label: 'Event', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' };
    }
    return { label: 'Announcement', color: 'bg-primary/10 text-primary dark:text-blue-400 border-primary/20' };
  };

  return (
    <section className="max-w-[1280px] mx-auto w-full my-8">
      {/* ── Detail View Modal ── */}
      <AnimatePresence>
        {selectedAnnouncement && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-surface rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-outline-variant/30 shadow-2xl relative text-on-surface"
            >
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getTypeBadge(selectedAnnouncement.type).color}`}>
                  {getTypeBadge(selectedAnnouncement.type).label}
                </span>
                {selectedAnnouncement.date && (
                  <span className="text-xs text-on-surface-variant flex items-center gap-1">
                    <Calendar size={13} /> {selectedAnnouncement.date}
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold text-on-surface mb-3 leading-snug">
                {selectedAnnouncement.title}
              </h3>

              {selectedAnnouncement.time && (
                <p className="text-xs text-on-surface-variant flex items-center gap-1.5 mb-4">
                  <Clock size={14} className="text-primary" /> Timing: <span className="font-semibold text-on-surface">{selectedAnnouncement.time}</span>
                </p>
              )}

              {selectedAnnouncement.content && (
                <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/20 text-sm leading-relaxed text-on-surface-variant mb-5 whitespace-pre-line">
                  {selectedAnnouncement.content}
                </div>
              )}

              {selectedAnnouncement.tags && selectedAnnouncement.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {selectedAnnouncement.tags.map((tag, i) => (
                    <span key={i} className="text-[11px] bg-surface-container px-2.5 py-1 rounded-lg text-on-surface-variant font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20">
                <span className="text-xs text-on-surface-variant">Vidhya Tutorials Official Notice</span>
                <button
                  onClick={() => setSelectedAnnouncement(null)}
                  className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Main Container ── */}
      <div className="bg-surface theme-dark-card rounded-3xl shadow-xl border border-outline-variant/20 p-6 sm:p-10 md:p-12 relative overflow-hidden">
        {/* Background Subtle Accent Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
              <Megaphone size={14} className="animate-bounce" />
              <span>Official Notice Board</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight">
              Latest Announcements & Schedules
            </h2>
            <p className="text-on-surface-variant text-sm sm:text-base mt-2 max-w-xl">
              Stay updated with upcoming exam test series, revision workshops, parent-teacher meetings, and academic alerts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { key: 'ALL', label: 'All Notices' },
              { key: 'EXAM', label: 'Exams' },
              { key: 'WORKSHOP', label: 'Workshops' },
              { key: 'MEETING', label: 'Meetings' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === tab.key
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                }`}
              >
                {tab.label}
              </button>
            ))}

            {user?.role === 'ADMIN' && (
              <Link
                to="/admin/announcements"
                className="px-3.5 py-2 rounded-xl text-xs font-bold border border-primary/40 text-primary hover:bg-primary/10 transition-colors flex items-center gap-1.5"
                title="Manage announcements in Admin Panel"
              >
                <span>Edit / Add</span>
                <ChevronRight size={14} />
              </Link>
            )}
          </div>
        </div>

        {/* Grid of Announcements */}
        {loading ? (
          <div className="py-16 text-center text-on-surface-variant text-sm flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span>Loading live announcements...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-on-surface-variant text-sm bg-surface-container-low rounded-2xl border border-dashed border-outline-variant/30">
            <Bell className="w-8 h-8 mx-auto text-on-surface-variant/40 mb-2" />
            <p className="font-semibold">No announcements under this category currently.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {filtered.map((item, idx) => {
              const badge = getTypeBadge(item.type);
              return (
                <motion.div
                  key={item._id || idx}
                  whileHover={{ y: -4 }}
                  className="bg-surface-container-low rounded-2xl p-5 sm:p-6 border border-outline-variant/30 hover:border-primary/40 hover:shadow-lg transition-all flex flex-col justify-between group cursor-pointer"
                  onClick={() => setSelectedAnnouncement(item)}
                >
                  <div>
                    {/* Top Row: Type Badge + Date */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${badge.color}`}>
                        {badge.label}
                      </span>
                      {item.date && (
                        <span className="text-[11px] font-semibold text-on-surface-variant flex items-center gap-1">
                          <Calendar size={12} className="text-primary" />
                          {item.date}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-base text-on-surface group-hover:text-primary transition-colors line-clamp-2 mb-2">
                      {item.title}
                    </h3>

                    {/* Time if available */}
                    {item.time && (
                      <div className="text-xs text-on-surface-variant flex items-center gap-1.5 mb-3 font-medium">
                        <Clock size={13} className="text-amber-500 shrink-0" />
                        <span>{item.time}</span>
                      </div>
                    )}

                    {/* Content Snippet */}
                    {item.content && (
                      <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3 mb-4">
                        {item.content}
                      </p>
                    )}
                  </div>

                  {/* Footer with Tags and Read More */}
                  <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      {item.tags && item.tags.slice(0, 2).map((t, ti) => (
                        <span key={ti} className="text-[10px] bg-surface-container px-2 py-0.5 rounded-md text-on-surface-variant/80 font-medium truncate max-w-[90px]">
                          #{t}
                        </span>
                      ))}
                    </div>

                    <span className="text-xs font-bold text-primary group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 shrink-0">
                      <span>Details</span>
                      <ArrowRight size={13} />
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
