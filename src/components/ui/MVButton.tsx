import { motion, HTMLMotionProps } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ReactNode } from 'react';

type Variant = 'primary' | 'ghost' | 'danger';

interface MVButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: Variant;
  children: ReactNode;
  arrow?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-accent text-dark font-semibold hover:brightness-110',
  ghost:
    'bg-transparent border border-white/30 text-white hover:bg-white/10',
  danger:
    'bg-danger text-white font-semibold hover:brightness-110',
};

export function MVButton({
  variant = 'primary',
  children,
  arrow = false,
  fullWidth = false,
  className = '',
  ...rest
}: MVButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`
        inline-flex items-center justify-center gap-2
        px-7 py-3.5 rounded-full text-sm tracking-wide
        cursor-pointer select-none transition-all duration-200
        font-[var(--font-sans)]
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...rest}
    >
      {children}
      {arrow && <ArrowRight className="w-4 h-4" />}
    </motion.button>
  );
}
