'use client';

import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface ShimmerButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  asChild?: boolean;
}

export default function ShimmerButton({
  children,
  className = '',
  onClick,
  asChild = false,
}: ShimmerButtonProps) {
  return (
    <div className="relative overflow-hidden group rounded-full inline-block">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          transform: 'translateX(-100%)',
        }}
      >
        <motion.div
          animate={{
            translateX: ['-100%', '200%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
            repeatDelay: 1,
          }}
          className="w-full h-full"
        />
      </div>
      <div
        onClick={onClick}
        className={`relative z-10 ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
