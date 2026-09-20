import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from './Logo';

export const LoadingScreen: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 z-[9999] bg-[#f4f7f5] dark:bg-background flex flex-col items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col items-center gap-6"
      >
        <img src="/logo.svg" alt="Vidhya Tutorials Logo" className="h-20 w-auto" />
        
        {/* Animated Loading Bar */}
        <div className="w-48 h-1 bg-surface-container-low rounded-full overflow-hidden relative mt-4">
          <motion.div
            className="absolute top-0 left-0 h-full bg-primary"
            initial={{ width: '0%', left: '0%' }}
            animate={{ 
              width: ['0%', '100%', '0%'],
              left: ['0%', '0%', '100%']
            }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
              repeat: Infinity
            }}
          />
        </div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-primary font-medium tracking-widest uppercase text-sm mt-2"
        >
          Preparing Excellence...
        </motion.p>
      </motion.div>
    </motion.div>
  );
};
