import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Navigation, 
  Phone, 
  Sparkles, 
  Tag, 
  ArrowRight,
  Mail,
  Clock,
  Star,
  ExternalLink
} from 'lucide-react';
import { ScrollTicker } from '../ui/ScrollTicker';

const FadeInWhenVisible = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => {
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

export function OurLocationsPage() {
  return (
    <div className="bg-background min-h-[100dvh] font-body-md text-on-surface overflow-x-hidden flex flex-col w-full">
      
      {/* 1. Hero Banner */}
      <section className="relative w-full pt-28 sm:pt-36 md:pt-44 pb-12 sm:pb-16 px-4 md:px-[64px] overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img src="/locations-hero-bg.png?v=2" alt="Vidhya Tutorials Center" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/40 backdrop-blur-[0.5px]"></div>
        </div>
        
        <div className="relative z-10 max-w-[1280px] mx-auto flex flex-col items-start text-left w-full">
          <FadeInWhenVisible className="max-w-2xl">
            <span className="inline-block px-3.5 py-1.5 bg-white/15 backdrop-blur-md text-white border border-white/20 rounded-full text-[11px] sm:text-data-label font-data-label mb-4 sm:mb-5 tracking-widest uppercase shadow-md">
              ✨ Flagship Center
            </span>
            <h1 className="text-3xl sm:text-[46px] md:text-[64px] font-bold text-white leading-tight tracking-[-0.02em] mb-3 sm:mb-4">
              Our <span className="italic text-amber-300 font-serif">Location</span>
            </h1>
            <p className="text-white/90 text-sm sm:text-[18px] max-w-2xl font-medium leading-relaxed">
              Dedicated educational institute at Matunga Road, Mumbai — offering structured learning experiences for school (6th to 10th) and 11th & 12th Science & Commerce.
            </p>
          </FadeInWhenVisible>
        </div>
      </section>

      <div className="relative z-10 w-full bg-surface-container-low shadow-[0_-20px_50px_rgba(0,0,0,0.06)] overflow-hidden">
        <ScrollTicker items={["Free Demo Classes", "6th to 12th Science & Commerce", "Visit Our Institute", "Referral Benefits"]} className="bg-primary text-white dark:text-[#001b3c] border-b border-white/10 dark:border-[#001b3c]/20" />
        
        <div className="pt-10 sm:pt-16 pb-20 sm:pb-24 space-y-10 sm:space-y-16 md:space-y-20 px-3.5 sm:px-6 md:px-[64px] max-w-[1280px] mx-auto">

          {/* 2. Matunga Road Hub Highlights & Details */}
          <section className="bg-white dark:bg-[#071326] rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800/80 p-5 sm:p-8 md:p-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              
              {/* Left Column: Institute Profile */}
              <div className="lg:col-span-7 space-y-6">
                <FadeInWhenVisible>
                  <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 mb-3">
                    <MapPin size={13} />
                    <span>Matunga Road, Mumbai</span>
                  </span>
                  <h2 className="font-h2 text-[30px] md:text-[38px] font-bold text-slate-900 dark:text-white leading-tight">
                    Dedicated Educational Hub
                  </h2>
                  <div className="w-20 h-1.5 bg-secondary rounded-full my-4" />
                  
                  <p className="text-slate-600 dark:text-slate-300 font-body-lg text-[16px] sm:text-[17px] leading-relaxed">
                    Vidhya Tutorials serves as a dedicated educational hub in Mumbai, offering specialized academic support for students from Class 6th to 12th Standard. Located at Matunga Road, Mumbai, this institute focuses on delivering structured learning experiences for those seeking academic excellence in school boards and 11th & 12th Science and Commerce streams.
                  </p>
                  
                  <p className="text-slate-600 dark:text-slate-300 font-body-lg text-[16px] sm:text-[17px] leading-relaxed">
                    We emphasize a supportive and interactive classroom environment with regular classes conducted at our institute, providing a consistent routine for students.
                  </p>
                </FadeInWhenVisible>

                {/* Key Benefits Grid */}
                <FadeInWhenVisible delay={0.1}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0c1a30] border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-sm">
                      <div className="flex items-center gap-2 font-bold text-sm text-primary dark:text-blue-400">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>Free Demo Classes</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        Experience our teaching methodology firsthand before committing to assess instructional style fit.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0c1a30] border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-sm">
                      <div className="flex items-center gap-2 font-bold text-sm text-emerald-600 dark:text-emerald-400">
                        <Tag className="w-4 h-4" />
                        <span>Referral Discounts</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        Special discounts available for new enrollments to make quality education genuinely accessible.
                      </p>
                    </div>
                  </div>
                </FadeInWhenVisible>

              </div>

              {/* Right Column: Address, Contact & Directions */}
              <div className="lg:col-span-5 space-y-6">
                <FadeInWhenVisible delay={0.15}>
                  <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c1a30] border border-slate-200 dark:border-slate-800 space-y-6 shadow-xl">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-primary dark:text-blue-400">Institute Center Address</span>
                      <h3 className="font-h3 text-[20px] font-bold text-slate-900 dark:text-white mt-1">Matunga Road Center</h3>
                    </div>

                    <div className="flex items-start gap-3.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5 border border-primary/20">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-[15px]">Vidhya Tutorials</div>
                        <p className="mt-1 text-[13px] leading-relaxed">
                          90 Feet Road, Kumbhar Wada, Matunga Road / Dharavi, Mumbai, Maharashtra 400017
                        </p>
                      </div>
                    </div>

                    {/* Verified Justdial & Google Rating Snapshot */}
                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#F85A00] text-white flex items-center justify-center font-black text-[10px] shadow-xs">
                          JD
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-xs text-slate-900 dark:text-white">5.0</span>
                            <div className="flex text-amber-400">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-amber-400" />
                              ))}
                            </div>
                            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 ml-1">Verified</span>
                          </div>
                          <p className="text-[10px] text-slate-600 dark:text-slate-400">
                            276+ Customer Ratings on Justdial
                          </p>
                        </div>
                      </div>
                      <a
                        href="https://www.justdial.com/Mumbai/Vidhya-Tutorials-Dharavi/022PXX22-XX22-181229042515-M5C7_BZDET"
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1.5 rounded-lg bg-[#F85A00] hover:bg-[#e05100] text-white text-[11px] font-bold inline-flex items-center gap-1 transition-all shadow-xs"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    {/* Institute Operating Hours Card */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#081224] border border-slate-200 dark:border-slate-800/80 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        <Clock className="w-4 h-4 text-primary dark:text-blue-400" />
                        <span>Working & Batch Hours</span>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                        <div className="flex justify-between">
                          <span>Monday – Saturday:</span>
                          <span className="font-semibold text-slate-900 dark:text-white">07:00 AM – 10:00 PM</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sunday:</span>
                          <span className="font-semibold text-slate-900 dark:text-white">07:00 AM – 09:00 PM</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium pt-0.5 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>Open 7 Days a week for Classes & Inquiries</span>
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <a
                        href="https://www.google.com/maps/search/?api=1&query=Vidhya+Tutorials+90+Feet+Road+Kumbhar+Wada+Mumbai"
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-3.5 px-5 rounded-xl bg-primary hover:bg-primary-container text-white dark:text-[#001b3c] font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md btn-magnetic"
                      >
                        <Navigation className="w-4 h-4" />
                        <span>Open Exact Location in Google Maps</span>
                      </a>

                      <Link
                        to="/admission-form"
                        className="w-full py-3.5 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-bold text-sm flex items-center justify-center gap-2 transition-all"
                      >
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>Apply for Admission</span>
                      </Link>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        <a
                          href="tel:+918898117343"
                          className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-center text-xs font-semibold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Desk: +91 88981 17343</span>
                        </a>
                        <a
                          href="tel:+918765432109"
                          className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-center text-xs font-semibold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5 text-blue-500" />
                          <span>Help: +91 87654 32109</span>
                        </a>
                        <a
                          href="mailto:vidhyatutorials22@gmail.com?subject=Institute%20Inquiry%20-%20Vidhya%20Tutorials"
                          className="col-span-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-center text-xs font-semibold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          title="Click to send email"
                        >
                          <Mail className="w-3.5 h-3.5 text-amber-500" />
                          <span>Email: vidhyatutorials22@gmail.com</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </FadeInWhenVisible>
              </div>

            </div>
          </section>

          {/* 3. Google Maps Integration */}
          <section className="bg-surface theme-dark-card rounded-3xl shadow-xl border border-outline-variant/20 p-4 sm:p-7 md:p-10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-h3 text-lg sm:text-[20px] font-bold text-on-surface flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>Interactive Institute Location</span>
                </h3>
                <p className="text-xs text-on-surface-variant">
                  90 Feet Road, Kumbhar Wada, Matunga Road / Dharavi, Mumbai - 400017
                </p>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Vidhya+Tutorials+90+Feet+Road+Kumbhar+Wada+Mumbai"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-secondary uppercase tracking-wider"
              >
                <span>Full Screen Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <FadeInWhenVisible delay={0.1}>
              <div className="w-full h-[300px] sm:h-[400px] md:h-[55vh] bg-surface-container rounded-2xl border border-outline-variant/30 shadow-inner overflow-hidden relative z-10">
                <iframe 
                  src="https://maps.google.com/maps?q=Vidhya+Tutorials+90+Feet+Road+Kumbhar+Wada+Mumbai&t=&z=17&ie=UTF8&iwloc=&output=embed" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Vidhya Tutorials Mumbai Location"
                ></iframe>
              </div>
            </FadeInWhenVisible>
          </section>

        </div>
      </div>

    </div>
  );
}


