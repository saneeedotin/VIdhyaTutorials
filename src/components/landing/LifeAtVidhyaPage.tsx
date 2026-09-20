import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { ScrollTicker } from '../ui/ScrollTicker';

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

export function LifeAtVidhyaPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-background min-h-screen font-body-md text-on-surface overflow-x-hidden flex flex-col w-full">
      
      {/* 1. Hero Section */}
      <section className="relative w-full pt-28 sm:pt-36 md:pt-48 pb-12 sm:pb-16 px-4 md:px-[64px] overflow-hidden bg-primary text-white">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/life-hero-bg.png" 
            alt="Life at Vidhya Tutorials" 
            className="w-full h-full object-cover object-center" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/40 backdrop-blur-[0.5px]"></div>
        </div>
        
        <div className="relative z-10 max-w-[1280px] mx-auto">
          <FadeInWhenVisible>
            <span className="inline-block px-3.5 py-1.5 bg-secondary/20 text-secondary border border-secondary/30 rounded-full text-[11px] sm:text-data-label font-data-label mb-3 sm:mb-4 tracking-widest uppercase">
              ✨ Student Experience
            </span>
            <h1 className="text-3xl sm:text-[44px] md:text-[64px] font-bold leading-tight tracking-[-0.02em] mb-3 text-white">
              Life at <span className="italic text-secondary">Vidhya</span>
            </h1>
            <p className="text-white/80 text-sm sm:text-base md:text-[18px] max-w-2xl font-medium leading-relaxed">
              Where academic rigor meets vibrant community life.
            </p>
          </FadeInWhenVisible>
        </div>
      </section>

      <div className="relative z-10 w-full bg-surface-container-low shadow-[0_-20px_50px_rgba(0,0,0,0.06)] overflow-hidden">
        <ScrollTicker items={["Life At Vidhya", "Vibrant Community", "Focused Environment"]} className="bg-primary text-white dark:text-[#001b3c] border-b border-white/10 dark:border-[#001b3c]/20" />
        <div className="pt-10 sm:pt-16 pb-20 sm:pb-24 space-y-10 sm:space-y-16 md:space-y-24 px-3.5 sm:px-6 md:px-[64px]">

      {/* 2. Welcome / Get Involved Section */}
      <section className="max-w-[1280px] mx-auto bg-surface theme-dark-card rounded-3xl shadow-xl border border-outline-variant/20 p-5 sm:p-8 md:p-16">
        <div>
          <FadeInWhenVisible className="max-w-4xl mb-16">
            <h2 className="font-h2 text-[32px] font-semibold text-primary mb-6">
              Welcome to Life at Vidhya!
            </h2>
            <p className="text-on-surface-variant font-body-lg text-[18px] mb-8 leading-relaxed max-w-3xl">
              Make the most of your time at Vidhya by exploring the many opportunities available to enhance your academic experience. Our learning centers blend a focused, quiet environment with highly interactive teaching spaces.
            </p>
            <button onClick={() => navigate('/courses')} className="bg-primary text-white dark:text-[#001b3c] px-8 py-4 rounded-lg font-bold transition-all shadow-md hover:-translate-y-1 hover:shadow-xl w-fit inline-flex items-center gap-2 btn-magnetic btn-ripple cursor-pointer group">
              <span>See All Opportunities</span> 
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1.5" />
            </button>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Academic Support */}
            <FadeInWhenVisible delay={0.1} className="bg-surface rounded-2xl overflow-hidden shadow-sm border border-outline-variant/30 flex flex-col hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 card-3d group cursor-pointer">
              <div className="w-full aspect-[4/3] overflow-hidden bg-surface-container-low shrink-0 relative img-zoom">
                <img src="/assets/wings/school.jpg" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Academic Support" />
              </div>
              <div className="p-8 flex flex-col flex-grow border-t-4 border-primary">
                <h3 className="text-[24px] font-medium text-primary mb-3 group-hover:text-secondary transition-colors">Academic Support</h3>
                <p className="text-on-surface-variant flex-grow leading-relaxed">
                  Experience the thrill of mastering complex concepts at Vidhya. We prioritize a balanced, structured atmosphere where regular doubt-solving sessions and professional mentorship ensure students feel supported.
                </p>
              </div>
            </FadeInWhenVisible>

            {/* Card 2: Focused Environment */}
            <FadeInWhenVisible delay={0.2} className="bg-surface rounded-2xl overflow-hidden shadow-sm border border-outline-variant/30 flex flex-col hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 card-3d group cursor-pointer">
              <div className="w-full aspect-[4/3] overflow-hidden bg-surface-container-low shrink-0 relative img-zoom">
                <img src="/gallery/gallery-16.jpg" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Focused Environment" />
              </div>
              <div className="p-8 flex flex-col flex-grow border-t-4 border-secondary">
                <h3 className="text-[24px] font-medium text-primary mb-3 group-hover:text-secondary transition-colors">Focused Environment</h3>
                <p className="text-on-surface-variant flex-grow leading-relaxed">
                  Our reading rooms and self-study hours provide the perfect setting to consolidate your daily learnings. Engage with peers in our collaborative zones or utilize quiet spaces for intense focus.
                </p>
              </div>
            </FadeInWhenVisible>

            {/* Card 3: Mentorship */}
            <FadeInWhenVisible delay={0.3} className="bg-surface rounded-2xl overflow-hidden shadow-sm border border-outline-variant/30 flex flex-col hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 card-3d group cursor-pointer">
              <div className="w-full aspect-[4/3] overflow-hidden bg-surface-container-low shrink-0 relative img-zoom">
                <img src="/assets/wings/commerce.jpg" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Mentorship" />
              </div>
              <div className="p-8 flex flex-col flex-grow border-t-4 border-tertiary-fixed-dim">
                <h3 className="text-[24px] font-medium text-primary mb-3 group-hover:text-secondary transition-colors">Expert Mentorship</h3>
                <p className="text-on-surface-variant flex-grow leading-relaxed">
                  Working with our senior faculty is a great way to gain valuable insights while staying on track for your competitive exams. There are a variety of opportunities available for one-on-one academic counseling.
                </p>
              </div>
            </FadeInWhenVisible>
          </div>
        </div>
      </section>

      {/* Campus Gallery Section CTA */}
      <FadeInWhenVisible delay={0.15}>
        <div className="bg-surface theme-dark-card rounded-3xl p-8 md:p-12 shadow-xl border border-outline-variant/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-secondary text-xs font-bold uppercase tracking-wider">Photo Album & Archives</span>
            <h3 className="text-2xl font-bold text-primary">Discover Student Life in Pictures</h3>
            <p className="text-on-surface-variant text-sm max-w-xl">
              From lively batch celebrations and award ceremonies to daily classroom focus sessions — explore our complete photo gallery.
            </p>
          </div>
          <button
            onClick={() => navigate('/gallery')}
            className="px-6 py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-md transition-all shrink-0 inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Browse Full Gallery</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </FadeInWhenVisible>

        </div>
      </div>


    </div>
  );
}
