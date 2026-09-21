import React, { useState, ReactNode } from 'react';
import {
  Loader2,
  Send,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Star,
  ThumbsUp,
  Sparkles,
  GraduationCap,
  BookOpen,
  Award,
  CheckCircle2,
  Tag,
  ArrowRight,
  Building2,
  Calendar,
  Clock,
  Users,
  Target,
  Quote,
  ShieldCheck
} from 'lucide-react';
import { apiClient } from '../../api/apiClient';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollTicker } from '../ui/ScrollTicker';
import { PushPin, STICKY_PALETTES, PinColor } from './GoogleReviewsWall';

interface StudentStoryItem {
  id: string;
  name: string;
  role: string;
  title: string;
  comment: string;
  avatarText?: string;
  avatarImg?: string;
  rating: number;
  paletteKey: string;
  frontRotate: number;
  backRotate: number;
  pin: PinColor;
  likes: number;
}

const STUDENT_STORIES: StudentStoryItem[] = [
  {
    id: 'tanvi-chitroda',
    name: 'Tanvi Chitroda',
    role: 'Student • 5 Years at Vidhya',
    title: 'Wonderful journey!',
    comment:
      'My journey in vidhya tutorial started from std 8th is has been since 5 year I am here. I observed in vidhya tutorial that they takes regular orals and tests which build confidence in the students... Each and every teachers in vidhya tutorial take effort behind not only toppers students but also they try to progress weaker one.',
    avatarText: 'T',
    rating: 5,
    paletteKey: 'cream',
    frontRotate: -2.0,
    backRotate: 3.8,
    pin: 'red',
    likes: 48,
  },
  {
    id: 'piyush-patil',
    name: 'piyush Patil',
    role: 'Student • Science Wing',
    title: 'Excellent coaching class',
    comment:
      'Vidhya Tutorial is an excellent coaching class with a very positive learning environment. The teaching quality is outstanding... He explains every concept clearly and makes even difficult topics easy to understand. Sir gives personal attention to students and clears all doubts patiently.',
    avatarImg: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    paletteKey: 'sky_blue',
    frontRotate: 2.2,
    backRotate: -4.2,
    pin: 'yellow',
    likes: 39,
  },
  {
    id: 'kalpana-praful',
    name: 'Kalpana Praful',
    role: 'Student • SSC Batch',
    title: 'Like my home',
    comment:
      'I am here in this class since 8th std. In this class i have not just learnt maths or science but here in this class i have learnt here many life lessons. Here all teachers our supportive and understanding. This vidhya tutorial class is not just a class but i feel here like my home.',
    avatarText: 'K',
    rating: 5,
    paletteKey: 'bubblegum_pink',
    frontRotate: -1.6,
    backRotate: 4.2,
    pin: 'green',
    likes: 54,
  },
  {
    id: 'pooja-rathod',
    name: 'Pooja Rathod',
    role: 'Student • 10th SSC 92.4%',
    title: 'All Doubts Cleared Personally',
    comment:
      'Also the weak students also gets improved here, all the doubts are cleared down by all the teachers. I have never thought that I would get classes like this which gives me so much knowledge. Highly recommend Vidhya Tutorials!',
    avatarText: 'P',
    rating: 5,
    paletteKey: 'mint_aqua',
    frontRotate: 1.8,
    backRotate: -3.5,
    pin: 'pink',
    likes: 45,
  },
  {
    id: 'tisha-kumbhar-story',
    name: 'Tisha Kumbhar',
    role: 'Student • HSC Topper 92.33%',
    title: 'Maths 99 & Accounts 96!',
    comment:
      'The systematic syllabus planning, Sunday board prelim series, and individual feedback from Sir helped me achieve 99/100 in Mathematics and 96/100 in Book Keeping. Best learning experience of my life!',
    avatarText: 'T',
    rating: 5,
    paletteKey: 'lavender',
    frontRotate: -2.4,
    backRotate: 3.5,
    pin: 'purple',
    likes: 62,
  },
  {
    id: 'sneha-jadhav-story',
    name: 'Sneha Jadhav',
    role: 'Student • 10th Board 94.6%',
    title: 'Confidence Boost for Boards',
    comment:
      'Best coaching for 9th and 10th std. Both Maths 1 & 2 and Science 1 & 2 are covered in depth with multiple prelim test series. Teachers are always available for doubt clearing even late evenings.',
    avatarText: 'S',
    rating: 5,
    paletteKey: 'peach_salmon',
    frontRotate: 1.5,
    backRotate: -4.0,
    pin: 'red',
    likes: 37,
  },
];

const FadeInWhenVisible = ({ children, delay = 0, className = "" }: { children: ReactNode, delay?: number, className?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export function AboutPage() {
  const [showAllStories, setShowAllStories] = useState(false);
  const displayedStories = showAllStories ? STUDENT_STORIES : STUDENT_STORIES.slice(0, 3);
  const [storyLikes, setStoryLikes] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('vt_student_story_likes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleLikeStory = (id: string, initialLikes: number) => {
    setStoryLikes(prev => {
      const current = prev[id] !== undefined ? prev[id] : initialLikes;
      const isLiked = prev[`${id}_liked`] === 1;
      const updated = {
        ...prev,
        [id]: isLiked ? current - 1 : current + 1,
        [`${id}_liked`]: isLiked ? 0 : 1,
      };
      try {
        localStorage.setItem('vt_student_story_likes', JSON.stringify(updated));
      } catch { }
      return updated;
    });
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    standard: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await apiClient.post('/api/appointments/book', formData);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', standard: '', message: '' });
    } catch (error) {
      console.error('Failed to book appointment', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="bg-background min-h-[100dvh] font-body-md text-on-surface overflow-x-hidden flex flex-col w-full">

      {/* 1. Hero Section */}
      <section className="relative w-full pt-28 sm:pt-36 md:pt-44 pb-12 sm:pb-16 px-4 md:px-[64px] overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/about-hero-bg.png?v=2" 
            alt="Vidhya Tutorials Campus & Educational Heritage" 
            className="w-full h-full object-cover object-center" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/40 backdrop-blur-[0.5px]"></div>
        </div>

        <div className="relative z-10 max-w-[1280px] mx-auto flex flex-col items-start text-left w-full">
          <FadeInWhenVisible className="max-w-4xl">
            <span className="inline-block px-3.5 py-1.5 bg-white/15 backdrop-blur-md text-white border border-white/20 rounded-full text-[11px] sm:text-data-label font-data-label mb-4 sm:mb-5 tracking-widest uppercase shadow-md">
              ✨ Established 2007 • 18+ Years of Academic Excellence
            </span>
            <h1 className="font-h1 text-2xl sm:text-4xl md:text-[54px] font-bold text-white leading-tight tracking-[-0.02em] mb-3 sm:mb-4">
              Dedicated to <span className="italic text-amber-300 font-serif">Excellence</span> to shape future achievers.
            </h1>
            <p className="text-white/90 font-body-lg text-sm sm:text-base md:text-[18px] max-w-2xl font-medium leading-relaxed">
              Operating since 2007 at Matunga Road, Mumbai, Vidhya Tutorials delivers concept-oriented teaching, disciplined test series, and personalized individual mentorship.
            </p>
          </FadeInWhenVisible>
        </div>
      </section>

      <div className="relative z-10 w-full bg-surface-container-low shadow-[0_-20px_50px_rgba(0,0,0,0.06)] overflow-hidden">
        <ScrollTicker items={["Established in 2007", "18+ Years of Academic Brilliance", "Dedicated Faculty Mentorship", "Matunga Road Campus", "10,000+ Alumni Mentored"]} className="bg-primary text-white dark:text-[#001b3c] border-b border-white/10 dark:border-[#001b3c]/20" />
        <div className="pt-10 sm:pt-16 pb-20 sm:pb-24 space-y-10 sm:space-y-16 md:space-y-24 px-3.5 sm:px-6 md:px-[64px]">

          {/* 1.5 Quick Heritage Highlights Strip */}
          <section className="max-w-[1280px] mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
              <FadeInWhenVisible delay={0.05} className="bg-surface theme-dark-card rounded-2xl p-3 sm:p-5 md:p-6 border border-outline-variant/30 shadow-md flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <p className="text-lg sm:text-2xl font-extrabold text-primary dark:text-blue-400">2007</p>
                  <p className="text-[10px] sm:text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Established</p>
                </div>
              </FadeInWhenVisible>

              <FadeInWhenVisible delay={0.1} className="bg-surface theme-dark-card rounded-2xl p-3 sm:p-5 md:p-6 border border-outline-variant/30 shadow-md flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <p className="text-lg sm:text-2xl font-extrabold text-amber-500">18+ Years</p>
                  <p className="text-[10px] sm:text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Legacy</p>
                </div>
              </FadeInWhenVisible>

              <FadeInWhenVisible delay={0.15} className="bg-surface theme-dark-card rounded-2xl p-3 sm:p-5 md:p-6 border border-outline-variant/30 shadow-md flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <p className="text-lg sm:text-2xl font-extrabold text-emerald-500">10,000+</p>
                  <p className="text-[10px] sm:text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Mentored</p>
                </div>
              </FadeInWhenVisible>

              <FadeInWhenVisible delay={0.2} className="bg-surface theme-dark-card rounded-2xl p-3 sm:p-5 md:p-6 border border-outline-variant/30 shadow-md flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <p className="text-lg sm:text-2xl font-extrabold text-indigo-500">98.9%</p>
                  <p className="text-[10px] sm:text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Top Score</p>
                </div>
              </FadeInWhenVisible>
            </div>
          </section>

          {/* 2. Content & Form Section */}
          <section className="max-w-[1280px] mx-auto bg-surface theme-dark-card rounded-3xl shadow-xl border border-outline-variant/20 p-5 sm:p-8 md:p-14">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

              {/* Left: About Us Text */}
              <FadeInWhenVisible className="space-y-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                    <MapPin size={13} />
                    <span>Matunga Road, Mumbai</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-secondary/15 text-secondary border border-secondary/25">
                    <Calendar size={13} />
                    <span>Started Since 2007</span>
                  </span>
                </div>

                <h2 className="font-h2 text-[30px] md:text-[38px] font-bold text-primary leading-tight">
                  About Vidhya Tutorials
                </h2>
                <div className="w-24 h-1.5 bg-secondary rounded-full mb-4" />

                <p className="text-on-surface-variant font-body-lg text-[16px] md:text-[17px] leading-relaxed">
                  <strong className="text-primary font-bold">Vidhya Tutorials</strong> was established in <strong className="text-on-surface font-semibold">2007</strong> with a visionary purpose: to provide disciplined, concept-driven, and truly student-centric coaching in Mumbai.
                </p>

                <p className="text-on-surface-variant font-body-lg text-[16px] md:text-[17px] leading-relaxed">
                  Over the last 18 years, the institute has earned immense trust across Matunga Road, Mumbai for turning complex syllabi into intuitive, enjoyable learning. Led by senior mentors <strong className="text-on-surface font-semibold">Vikas Sir</strong> and <strong className="text-on-surface font-semibold">Vinayak Sir</strong> along with our dedicated faculty, our educators dedicate equal effort to every student — transforming average learners into high achievers and guiding toppers toward 100/100 subject scores.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-surface-container/60 border border-outline-variant/30 flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-on-surface">Academic Legacy</div>
                      <div className="text-[12px] text-on-surface-variant">Established Since 2007</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-surface-container/60 border border-outline-variant/30 flex items-start gap-3">
                    <Users className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-on-surface">Academic Mentorship</div>
                      <div className="text-[12px] text-on-surface-variant">Vikas Sir & Vinayak Sir</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-surface-container/60 border border-outline-variant/30 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-on-surface">Free Demo Sessions</div>
                      <div className="text-[12px] text-on-surface-variant">Experience classes before joining</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-surface-container/60 border border-outline-variant/30 flex items-start gap-3">
                    <Tag className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-on-surface">Flexible Installments</div>
                      <div className="text-[12px] text-on-surface-variant">Easy fee payment options for parents</div>
                    </div>
                  </div>
                </div>
              </FadeInWhenVisible>

              {/* Right: Booking Form */}
              <FadeInWhenVisible delay={0.2}>
                <div className="bg-surface p-8 md:p-12 rounded-2xl shadow-xl border border-outline-variant/30 relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full z-0 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(31,64,109,0.05) 0%, rgba(31,64,109,0) 70%)' }}></div>

                  <div className="relative z-10">
                    <h3 className="font-h3 text-[24px] font-medium text-primary mb-2">Book an Appointment</h3>
                    <p className="text-on-surface-variant text-sm mb-8 uppercase tracking-widest font-bold">Schedule a free consultation</p>

                    {submitStatus === 'success' ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
                        <div className="w-20 h-20 bg-secondary-container rounded-full flex items-center justify-center mb-4">
                          <Send className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="font-h3 text-[24px] font-semibold text-primary">Request Sent!</h3>
                        <p className="text-on-surface-variant">
                          Thank you for reaching out. We will contact you shortly to confirm your appointment time.
                        </p>
                        <button
                          onClick={() => setSubmitStatus('idle')}
                          className="mt-6 text-primary font-bold uppercase tracking-widest hover:text-secondary transition-colors"
                        >
                          Book another appointment
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Student Name <span className="text-error">*</span></label>
                            <input
                              required
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium"
                              placeholder="John Doe"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Phone Number <span className="text-error">*</span></label>
                            <input
                              required
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium"
                              placeholder="+91 98765 43210"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Email Address <span className="text-error">*</span></label>
                          <input
                            required
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium"
                            placeholder="john@example.com"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Standard / Grade</label>
                          <select
                            name="standard"
                            value={formData.standard}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-slate-900 dark:text-white font-medium cursor-pointer"
                          >
                            <option value="" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Select standard...</option>
                            <option value="6th - 8th Standard" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">6th - 8th Standard (School Foundation)</option>
                            <option value="9th Standard" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">9th Standard (SSC / ICSE / CBSE)</option>
                            <option value="10th Standard" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">10th Standard (Board Exam Prep)</option>
                            <option value="11th Commerce" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">11th Commerce (FYJC)</option>
                            <option value="12th Commerce" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">12th Commerce (HSC Board)</option>
                            <option value="11th Science" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">11th Science (PCM / PCB)</option>
                            <option value="12th Science" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">12th Science (PCM / PCB)</option>
                            <option value="Other" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Other Consultation</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Additional Message</label>
                          <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none font-medium"
                            placeholder="Any specific subjects or concerns you'd like to discuss?"
                          />
                        </div>

                        {submitStatus === 'error' && (
                          <div className="p-4 bg-error-container text-on-error-container rounded-xl font-medium text-sm">
                            Failed to submit request. Please try again or contact us directly.
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-primary hover:bg-primary-container text-white dark:text-[#001b3c] px-8 py-4 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-3 disabled:opacity-70 btn-magnetic btn-ripple cursor-pointer"
                        >
                          {isSubmitting ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
                          ) : (
                            <><Send className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" /> Confirm Booking</>
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </FadeInWhenVisible>
            </div>
          </section>

          {/* 2.5 Academic Offerings & Learning Experience */}
          <section className="max-w-[1280px] mx-auto space-y-8">
            <FadeInWhenVisible className="text-center max-w-3xl mx-auto space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
                <GraduationCap size={13} />
                <span>Academic Offerings & Environment</span>
              </span>
              <h2 className="font-h2 text-[30px] sm:text-[38px] font-extrabold text-on-surface">
                Structured Pathways to Academic Excellence
              </h2>
              <div className="h-1.5 w-24 bg-secondary mx-auto rounded-full"></div>
              <p className="text-on-surface-variant text-sm sm:text-base">
                Delivering specialized academic coaching and structured routines tailored for School (6th to 10th) and Junior College (11th & 12th Science & Commerce).
              </p>
            </FadeInWhenVisible>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Card 1: Academic Offerings */}
              <FadeInWhenVisible delay={0.1}>
                <div className="h-full bg-surface theme-dark-card rounded-3xl p-8 sm:p-10 border border-outline-variant/30 shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-primary/40 transition-all">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-h3 text-[22px] font-bold text-on-surface">Academic Offerings</h3>
                        <p className="text-xs text-on-surface-variant uppercase font-semibold tracking-wider">School & Junior College (6th to 12th)</p>
                      </div>
                    </div>

                    <p className="text-on-surface-variant text-sm leading-relaxed">
                      The institute specializes in foundational school education and junior college board prep (Class 6th to 12th Standard), building strong conceptual clarity in science, commerce, and school subjects to achieve board distinctions.
                    </p>

                    <div className="space-y-3.5 pt-2">
                      <div className="p-4 rounded-2xl bg-surface-container/50 border border-outline-variant/20 hover:bg-surface-container transition-colors">
                        <div className="flex items-center gap-2 font-bold text-sm text-primary mb-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span>School Section (6th to 10th Std)</span>
                        </div>
                        <p className="text-xs text-on-surface-variant pl-6">
                          Comprehensive coaching for SSC, ICSE & CBSE boards covering Maths, Science, Social Studies, and languages with weekly testing.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-surface-container/50 border border-outline-variant/20 hover:bg-surface-container transition-colors">
                        <div className="flex items-center gap-2 font-bold text-sm text-primary mb-1">
                          <Award className="w-4 h-4 text-amber-500" />
                          <span>Commerce Wing (11th & 12th HSC)</span>
                        </div>
                        <p className="text-xs text-on-surface-variant pl-6">
                          Specialized coaching in Book Keeping, Accountancy, Economics, OCM, Mathematics, and Secretarial Practice (SP).
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-surface-container/50 border border-outline-variant/20 hover:bg-surface-container transition-colors">
                        <div className="flex items-center gap-2 font-bold text-sm text-primary mb-1">
                          <GraduationCap className="w-4 h-4 text-primary" />
                          <span>Science Wing (11th & 12th HSC / CBSE)</span>
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 ml-auto">✨ Started in 2026</span>
                        </div>
                        <p className="text-xs text-on-surface-variant pl-6">
                          Newly introduced in 2026: In-depth coaching for PCM, PCB, and PCMB with laboratory practical guidance, numerical drills, and board model prelims.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-surface-container/50 border border-outline-variant/20 hover:bg-surface-container transition-colors">
                        <div className="flex items-center gap-2 font-bold text-sm text-primary mb-1">
                          <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                          <span>Board Test Series & Entrance Sync (MHT-CET / NEET)</span>
                        </div>
                        <p className="text-xs text-on-surface-variant pl-6">
                          Chapter-wise prelim test series, past 10 years solved board papers, and foundation entrance preparation for 12th science students.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-outline-variant/20 flex items-center justify-between text-xs text-on-surface-variant">
                    <span>📍 Matunga Road Educational Campus</span>
                    <span className="font-semibold text-primary">Class 6th to 12th Standard</span>
                  </div>
                </div>
              </FadeInWhenVisible>

              {/* Card 2: Learning Experience */}
              <FadeInWhenVisible delay={0.2}>
                <div className="h-full bg-surface theme-dark-card rounded-3xl p-8 sm:p-10 border border-outline-variant/30 shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-secondary/40 transition-all">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center font-bold">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-h3 text-[22px] font-bold text-on-surface">Learning Experience</h3>
                        <p className="text-xs text-on-surface-variant uppercase font-semibold tracking-wider">Supportive & Interactive Classrooms</p>
                      </div>
                    </div>

                    <p className="text-on-surface-variant text-sm leading-relaxed">
                      Vidhya Tutorials emphasizes a supportive and interactive classroom environment. Regular classes conducted at the institute provide a consistent routine for students, bridging the gap between school-level understanding and professional academic demands.
                    </p>

                    <div className="space-y-4 pt-2">
                      <div className="p-4.5 rounded-2xl bg-primary/5 border border-primary/20 space-y-2">
                        <div className="flex items-center gap-2 font-bold text-sm text-primary">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          <span>Free Demo Classes Available</span>
                        </div>
                        <p className="text-xs text-on-surface-variant leading-relaxed">
                          A notable feature is the availability of free demo classes, allowing prospective students to experience the teaching methodology before committing. This approach helps learners assess whether the instructional style matches their needs.
                        </p>
                      </div>

                      <div className="p-4.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                        <div className="flex items-center gap-2 font-bold text-sm text-emerald-600 dark:text-emerald-400">
                          <Tag className="w-4 h-4" />
                          <span>Referral Discount Benefits</span>
                        </div>
                        <p className="text-xs text-on-surface-variant leading-relaxed">
                          For those interested in starting their journey, a referral discount is often available, making quality education more accessible to everyone.
                        </p>
                      </div>

                      <div className="p-4.5 rounded-2xl bg-surface-container/50 border border-outline-variant/20 space-y-2">
                        <div className="flex items-center gap-2 font-bold text-sm text-on-surface">
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                          <span>Bridging School to Professional Success</span>
                        </div>
                        <p className="text-xs text-on-surface-variant leading-relaxed">
                          Particularly in the competitive field of commerce, our structured mentorship equips students with real-world analytical precision alongside academic distinction.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-outline-variant/20">
                    <button
                      onClick={() => {
                        const formElem = document.querySelector('form');
                        formElem?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full py-3.5 px-6 rounded-xl bg-primary hover:bg-primary-container text-white dark:text-[#001b3c] font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md btn-magnetic"
                    >
                      <span>Book Free Demo / Consultation</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </FadeInWhenVisible>
            </div>
          </section>

          {/* 2.6 Leadership & Faculty Mentors */}
          <section className="max-w-[1280px] mx-auto space-y-8">
            <FadeInWhenVisible className="text-center max-w-3xl mx-auto space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
                <Users size={13} />
                <span>Leadership & Faculty Mentors</span>
              </span>
              <h2 className="font-h2 text-[30px] sm:text-[38px] font-extrabold text-on-surface">
                Meet the Guiding Minds of Vidhya Tutorials
              </h2>
              <div className="h-1.5 w-24 bg-secondary mx-auto rounded-full"></div>
              <p className="text-on-surface-variant text-sm sm:text-base">
                Experienced, approachable educators dedicated to individual student progress, concept clarity, and academic transformation.
              </p>
            </FadeInWhenVisible>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto">
              {/* Card 1: Vikas Sir (Founder & Academic Head) */}
              <FadeInWhenVisible delay={0.1} className="h-full">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200/90 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full relative group">
                  
                  {/* Top Role Badge */}
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/80 text-xs font-bold uppercase tracking-wider">
                      <ShieldCheck size={13} className="text-blue-600 dark:text-blue-400" />
                      <span>Founder & Academic Head</span>
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      Est. 2007
                    </span>
                  </div>

                  {/* Header: Photo + Name + Credentials */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-6">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-sm shrink-0 bg-slate-100 dark:bg-slate-800">
                      <img 
                        src="/sir-real-photo.jpg" 
                        alt="Vikas Sir — Founder & Academic Head" 
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" 
                      />
                    </div>
                    <div>
                      <h3 className="font-h2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Vikas Sir
                      </h3>
                      <p className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide mt-0.5">
                        Founder & Chief Academic Mentor
                      </p>
                      <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium block mt-1">
                        Mathematics & Science Pedagogy • 1-on-1 Student Mentorship
                      </span>
                    </div>
                  </div>

                  {/* Short Bio Summary */}
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                    Widely respected across Matunga Road for turning complex syllabi into intuitive, enjoyable learning. Vikas Sir personally leads academic planning, student motivation, and mathematics coaching.
                  </p>

                  {/* Core Mentorship Highlights */}
                  <ul className="space-y-2.5 flex-1 mb-6">
                    <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong>First-Principles Pedagogy:</strong> Concept-first teaching that eliminates rote memorization.</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong>Personal Doubt Desks:</strong> Daily 1-on-1 counseling and test evaluation with every student.</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong>Proven Board Results:</strong> Consistent record of 90%+ achievers and 100/100 subject scores.</span>
                    </li>
                  </ul>

                  {/* Footer Highlights Strip */}
                  <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      <Award size={14} className="text-amber-500" />
                      <span>18+ Years Mentorship</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300">
                      <Users size={14} className="text-blue-600 dark:text-blue-400" />
                      <span>10,000+ Students Mentored</span>
                    </span>
                  </div>
                </div>
              </FadeInWhenVisible>

              {/* Card 2: Vinayak Sir (Senior Faculty & Commerce Head) */}
              <FadeInWhenVisible delay={0.2} className="h-full">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200/90 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full relative group">
                  
                  {/* Top Role Badge */}
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 text-xs font-bold uppercase tracking-wider">
                      <Award size={13} className="text-indigo-600 dark:text-indigo-400" />
                      <span>Senior Faculty • Commerce Head</span>
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      Commerce Wing
                    </span>
                  </div>

                  {/* Header: Academic Insignia + Name + Credentials */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-6">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-indigo-50 to-slate-100 dark:from-indigo-950/40 dark:to-slate-800 border-2 border-indigo-200 dark:border-indigo-800/60 shadow-sm shrink-0 flex flex-col items-center justify-center p-2 text-center group-hover:border-indigo-400 transition-colors">
                      <div className="w-11 h-11 rounded-xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-1">
                        <GraduationCap size={22} />
                      </div>
                      <span className="text-[10px] font-extrabold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                        Commerce
                      </span>
                    </div>
                    <div>
                      <h3 className="font-h2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Vinayak Sir
                      </h3>
                      <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mt-0.5">
                        Senior Faculty & Exam Strategist
                      </p>
                      <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium block mt-1">
                        Accounts & Commerce Specialist • Board Paper Presentation
                      </span>
                    </div>
                  </div>

                  {/* Short Bio Summary */}
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                    Specializing in high-scoring examination techniques, Book Keeping accuracy, and structured time-management drills for Junior College commerce students.
                  </p>

                  {/* Core Mentorship Highlights */}
                  <ul className="space-y-2.5 flex-1 mb-6">
                    <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong>Book Keeping & Accounts:</strong> Precision ledger and balance sheet techniques for 100/100 scores.</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong>PYQ Exam Workshops:</strong> Systematic drills on past 10-year Maharashtra State Board papers.</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong>Step-Marking Mastery:</strong> Individual prelim paper correction and examiner presentation tips.</span>
                    </li>
                  </ul>

                  {/* Footer Highlights Strip */}
                  <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      <BookOpen size={14} className="text-indigo-500" />
                      <span>Board Paper Specialist</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300">
                      <Target size={14} className="text-indigo-600 dark:text-indigo-400" />
                      <span>PYQ & Prelim Evaluator</span>
                    </span>
                  </div>
                </div>
              </FadeInWhenVisible>
            </div>
          </section>

          {/* 2.7 Institute Milestones Timeline (2007 - Present) */}
          <section className="max-w-[1280px] mx-auto bg-surface theme-dark-card rounded-3xl shadow-xl border border-outline-variant/20 p-8 sm:p-12 md:p-16">
            <FadeInWhenVisible className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-secondary/15 text-secondary border border-secondary/25 mb-3">
                <Clock size={13} />
                <span>Our Journey</span>
              </span>
              <h2 className="font-h2 text-[28px] sm:text-[34px] font-bold text-primary">
                18 Years of Consistent Growth & Excellence
              </h2>
              <div className="h-1.5 w-20 bg-secondary mx-auto rounded-full mt-3"></div>
            </FadeInWhenVisible>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              {/* Milestone 1: 2007 */}
              <FadeInWhenVisible delay={0.1} className="relative p-6 rounded-2xl bg-surface-container/50 border border-outline-variant/30 flex flex-col justify-between hover:border-primary/40 transition-all">
                <div>
                  <span className="text-3xl font-extrabold text-primary block mb-2">2007</span>
                  <h4 className="font-bold text-base text-on-surface mb-2">Foundation of Vidhya Tutorials</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Established in Mumbai with small interactive batches focused purely on concept clarity, disciplined study routines, and individual doubt resolution.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-outline-variant/20 text-[11px] font-semibold text-secondary">
                  First Batch: 100% Success
                </div>
              </FadeInWhenVisible>

              {/* Milestone 2: 2013 */}
              <FadeInWhenVisible delay={0.2} className="relative p-6 rounded-2xl bg-surface-container/50 border border-outline-variant/30 flex flex-col justify-between hover:border-primary/40 transition-all">
                <div>
                  <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 block mb-2">2013</span>
                  <h4 className="font-bold text-base text-on-surface mb-2">Senior Commerce Wing Expansion</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Expanded into specialized Junior College commerce (Book Keeping, Accountancy, Maths, Economics) alongside dedicated weekly board prelim test series.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-outline-variant/20 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                  State Board Merit Ranks
                </div>
              </FadeInWhenVisible>

              {/* Milestone 3: 2019 */}
              <FadeInWhenVisible delay={0.3} className="relative p-6 rounded-2xl bg-surface-container/50 border border-outline-variant/30 flex flex-col justify-between hover:border-primary/40 transition-all">
                <div>
                  <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 block mb-2">2019</span>
                  <h4 className="font-bold text-base text-on-surface mb-2">Modern Matunga Road AC Campus</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Upgraded to a fully air-conditioned campus at Matunga Road, Mumbai with foundation study corners and dedicated personal counseling cabins.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-outline-variant/20 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  Tech & Smart Classrooms
                </div>
              </FadeInWhenVisible>

              {/* Milestone 4: 2026 */}
              <FadeInWhenVisible delay={0.4} className="relative p-6 rounded-2xl bg-surface-container/50 border-2 border-amber-500/30 flex flex-col justify-between hover:border-amber-500 transition-all">
                <div>
                  <span className="text-3xl font-extrabold text-amber-500 block mb-2">2026</span>
                  <h4 className="font-bold text-base text-on-surface mb-2">Launch of Science Wing (PCM/PCB/PCMB)</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Officially launched the brand new Science section in 2026 for 11th & 12th Standard, synchronized with MHT-CET & NEET entrance preparation, practical journals, and personalized mentorship.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-outline-variant/20 text-[11px] font-semibold text-amber-500">
                  ✨ Newly Launched in 2026
                </div>
              </FadeInWhenVisible>
            </div>
          </section>

          {/* 3. Testimonials - Realistic Sticky Notes Pinboard */}
          <section className="max-w-[1280px] mx-auto bg-surface theme-dark-card rounded-3xl shadow-xl border border-outline-variant/20 p-6 sm:p-12 md:p-16 relative overflow-hidden">
            {/* Subtle pinboard cork / dotted texture */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-50" />

            <div className="relative z-10">
              <FadeInWhenVisible className="text-center mb-12 sm:mb-16">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-400/10 text-amber-500 border border-amber-400/20 mb-3 shadow-xs">
                  <Sparkles size={13} />
                  <span>Student Experiences & Memories</span>
                </span>
                <h2 className="font-h2 text-[30px] sm:text-[36px] font-extrabold text-on-surface">
                  Student Stories
                </h2>
                <div className="h-1.5 w-24 bg-secondary mx-auto rounded-full mt-3 mb-4 animate-pulse"></div>
                <p className="text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto">
                  Real handwritten notes, heartfelt journeys, and experiences pinned by students of Vidhya Tutorials.
                </p>
              </FadeInWhenVisible>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 sm:gap-10 pt-3">
                {displayedStories.map((story, idx) => {
                  const cfg = STICKY_PALETTES[story.paletteKey] || STICKY_PALETTES.cream;
                  const isLiked = storyLikes[`${story.id}_liked`] === 1;
                  const count = storyLikes[story.id] !== undefined ? storyLikes[story.id] : story.likes;

                  return (
                    <motion.div
                      key={story.id}
                      layout
                      initial={{ opacity: 0, scale: 0.93, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: idx * 0.08 }}
                      whileHover={{
                        scale: 1.035,
                        rotate: 0,
                        zIndex: 25,
                        transition: { duration: 0.2 },
                      }}
                      className="relative group cursor-default select-none pt-4"
                    >
                      {/* ── Back Paper Sheet (Rotated Behind for Stacked Pad Look) ── */}
                      <div
                        className="absolute inset-0 rounded-[3px] pointer-events-none transition-transform duration-300 group-hover:rotate-0"
                        style={{
                          backgroundColor: cfg.backBg,
                          transform: `rotate(${story.backRotate}deg) scale(0.99)`,
                          boxShadow: '0 10px 24px -3px rgba(0,0,0,0.22), 0 4px 8px -2px rgba(0,0,0,0.12)',
                        }}
                      />

                      {/* ── Foreground Main Sticky Note Paper ── */}
                      <div
                        className="relative rounded-[3px] p-6 sm:p-7 flex flex-col justify-between min-h-[350px] transition-all duration-300 border"
                        style={{
                          backgroundColor: cfg.frontBg,
                          borderColor: 'rgba(0,0,0,0.06)',
                          transform: `rotate(${story.frontRotate}deg)`,
                          boxShadow: '0 16px 32px -5px rgba(0,0,0,0.28), 0 6px 14px -3px rgba(0,0,0,0.15), inset 0 -2px 6px rgba(0,0,0,0.04)',
                        }}
                      >
                        {/* Realistic 3D Push Pin at Top Center */}
                        <PushPin pinColor={story.pin} />

                        {/* Paper Curl Crease at Bottom Right */}
                        <div className="absolute bottom-0 right-0 w-6 h-6 overflow-hidden pointer-events-none rounded-br-[3px]">
                          <div className="w-8 h-8 -rotate-45 origin-bottom-right bg-gradient-to-tl from-black/20 to-transparent" />
                        </div>

                        {/* Top: Stars + Title */}
                        <div>
                          <div className="flex items-center justify-between mb-3 pt-1">
                            <div className="flex text-amber-500 gap-0.5">
                              {[...Array(story.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-amber-500" />
                              ))}
                            </div>
                            <span
                              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                              style={{
                                backgroundColor: 'rgba(0,0,0,0.08)',
                                color: cfg.textColor,
                              }}
                            >
                              Pinned Note 📌
                            </span>
                          </div>

                          <h3
                            className="font-bold text-[18px] sm:text-[19px] leading-snug mb-3 tracking-tight"
                            style={{ color: cfg.textColor }}
                          >
                            {story.title}
                          </h3>

                          {/* Review Quote Body */}
                          <p
                            className="font-serif italic text-[14px] sm:text-[15px] leading-relaxed mb-6"
                            style={{ color: cfg.quoteColor }}
                          >
                            "{story.comment}"
                          </p>
                        </div>

                        {/* Footer: Student Info + Like Button */}
                        <div
                          className="pt-3 border-t flex items-center justify-between mt-auto"
                          style={{ borderColor: 'rgba(0,0,0,0.12)' }}
                        >
                          <div className="flex items-center gap-3">
                            {story.avatarImg ? (
                              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/70 shadow-xs shrink-0">
                                <img src={story.avatarImg} alt={story.name} className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div
                                className="w-10 h-10 rounded-full font-bold text-sm flex items-center justify-center shrink-0 shadow-xs border"
                                style={{
                                  backgroundColor: cfg.avatarBg,
                                  color: cfg.avatarText,
                                  borderColor: 'rgba(0,0,0,0.15)',
                                }}
                              >
                                {story.avatarText || story.name.charAt(0)}
                              </div>
                            )}
                            <div>
                              <h4
                                className="font-bold text-sm leading-tight"
                                style={{ color: cfg.textColor }}
                              >
                                {story.name}
                              </h4>
                              <span
                                className="text-[11px] font-semibold block leading-tight mt-0.5 opacity-80"
                                style={{ color: cfg.metaColor }}
                              >
                                {story.role}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleLikeStory(story.id, story.likes)}
                            className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-xl transition-all cursor-pointer font-bold shadow-xs hover:scale-105 active:scale-95"
                            style={{
                              backgroundColor: isLiked ? 'rgba(0,0,0,0.18)' : 'rgba(0,0,0,0.07)',
                              color: cfg.textColor,
                            }}
                            title="Helpful Note"
                          >
                            <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                            <span className="tabular-nums text-xs">{count}</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {STUDENT_STORIES.length > 3 && (
                <div className="flex justify-center mt-12 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAllStories(!showAllStories)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-surface-container hover:bg-surface-container-highest border border-outline-variant/40 text-primary dark:text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer hover:scale-105"
                  >
                    <span>{showAllStories ? 'Show Less' : `View All Student Stories (${STUDENT_STORIES.length})`}</span>
                  </button>
                </div>
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
