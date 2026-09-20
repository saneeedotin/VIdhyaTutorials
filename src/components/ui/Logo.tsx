import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export function Logo({ className = '', variant = 'light' }: LogoProps) {
  const navigate = useNavigate();
  
  const mainColor = variant === 'light' ? 'text-white' : 'text-[#0f8ff7]';
  const subColor = variant === 'light' ? 'text-[#D9F89A]' : 'text-[#1A1A2E]';

  return (
    <div 
      className={`flex flex-col cursor-pointer select-none ${className}`} 
      onClick={() => navigate('/')}
    >
      <span className={`font-extrabold text-2xl tracking-normal uppercase font-[var(--font-display)] leading-tight flex items-center gap-1 ${mainColor}`}>
        Vidhya
      </span>
      <span className={`font-bold text-xs tracking-widest uppercase italic font-[var(--font-display)] leading-none ${subColor}`}>
        Tutorials
      </span>
    </div>
  );
}
