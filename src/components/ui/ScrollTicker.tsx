import { motion, useScroll, useTransform } from 'framer-motion';
import { BookOpen } from 'lucide-react';

export function ScrollTicker({ items, className = "" }: { items: string[], className?: string }) {
  const { scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  
  // Repeat the array enough times so it never runs out during the scroll
  const repeatedItems = Array(20).fill(items).flat();

  return (
    <div className={`w-full py-3 overflow-hidden whitespace-nowrap z-20 ${className}`}>
      <motion.div style={{ x }} className="inline-flex items-center gap-6 font-data-label text-[12px] md:text-[13px] uppercase tracking-[0.15em] font-medium opacity-80">
        {repeatedItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-6">
            <span>{item}</span>
            <BookOpen size={14} className="opacity-50" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
