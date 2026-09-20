import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const words = ["Creative", "Brilliant", "Astute", "Cunning"];

export const AnimatedWord: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-grid place-items-center relative text-secondary dark:text-blue-100 italic">
      {/* Invisible placeholders for all words to guarantee the container matches the widest one perfectly */}
      {words.map((w) => (
        <span key={`ph-${w}`} className="invisible col-start-1 row-start-1 px-1">
          {w}
        </span>
      ))}
      
      <AnimatePresence>
        <motion.span
          key={words[index]}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="col-start-1 row-start-1"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};
