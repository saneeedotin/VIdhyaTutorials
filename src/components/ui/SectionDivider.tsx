import React from 'react';

type DividerType = 'triangle' | 'diagonal-right' | 'diagonal-left' | 'zigzag';

interface SectionDividerProps {
  type?: DividerType;
  className?: string;
  fill?: string;
  flip?: boolean;
}

export function SectionDivider({ type = 'triangle', className = '', fill = 'fill-background', flip = false }: SectionDividerProps) {
  const transform = flip ? 'rotate(180deg)' : 'none';
  const containerClass = `absolute left-0 w-full overflow-hidden leading-none z-10 ${className}`;

  let svgContent = null;

  switch (type) {
    case 'triangle':
      svgContent = (
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className={`relative block w-[calc(100%+1.3px)] h-[40px] md:h-[60px] ${fill}`} style={{ transform }}>
          <path d="M1200 0L0 0 598.97 114.72 1200 0z"></path>
        </svg>
      );
      break;
    case 'diagonal-right':
      svgContent = (
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className={`relative block w-[calc(100%+1.3px)] h-[40px] md:h-[80px] ${fill}`} style={{ transform }}>
          <path d="M1200 120L0 0V0h1200v120z"></path>
        </svg>
      );
      break;
    case 'diagonal-left':
      svgContent = (
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className={`relative block w-[calc(100%+1.3px)] h-[40px] md:h-[80px] ${fill}`} style={{ transform }}>
          <path d="M0 120L1200 0V0H0v120z"></path>
        </svg>
      );
      break;
    case 'zigzag':
      svgContent = (
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className={`relative block w-[calc(100%+1.3px)] h-[20px] md:h-[40px] ${fill}`} style={{ transform }}>
          <path d="M0 0l60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60v-60H0z"></path>
        </svg>
      );
      break;
  }

  return (
    <div className={containerClass}>
      {svgContent}
    </div>
  );
}
