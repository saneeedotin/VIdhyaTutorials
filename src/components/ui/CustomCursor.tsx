import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MousePointer2, Pointer } from 'lucide-react';

export const CustomCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    document.body.classList.add('hide-cursor');
    
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a') ||
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.body.classList.remove('hide-cursor');
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  // Render a highly professional, sleek custom cursor
  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[99999] hidden md:flex items-center justify-center text-primary dark:text-white print:hidden"
      animate={{
        x: mousePosition.x - (isHovering ? 12 : 2), // Adjust tip based on icon shape
        y: mousePosition.y - (isHovering ? 4 : 2),
      }}
      transition={{
        x: { type: 'tween', duration: 0 }, // instant real-time tracking
        y: { type: 'tween', duration: 0 },
      }}
    >
      <div className="drop-shadow-sm">
        {isHovering ? (
          <Pointer className="w-6 h-6" strokeWidth={2} />
        ) : (
          <MousePointer2 className="w-6 h-6" strokeWidth={2} fill="currentColor" />
        )}
      </div>
    </motion.div>
  );
};
