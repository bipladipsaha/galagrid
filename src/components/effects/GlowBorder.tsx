'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export function GlowBorder({
  children,
  className = '',
  glowColor = 'rgba(0, 255, 136, 0.3)',
  animate = true,
}: {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  animate?: boolean;
}) {
  return (
    <motion.div
      className={`relative rounded-xl overflow-hidden ${className}`}
      whileHover={animate ? { scale: 1.01 } : undefined}
      transition={{ duration: 0.2 }}
    >
      {/* Glow border */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          padding: '1px',
          background: `linear-gradient(135deg, ${glowColor}, transparent 40%, transparent 60%, ${glowColor})`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
        }}
      />
      {/* Inner glow */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none opacity-50"
        style={{
          boxShadow: `inset 0 0 30px ${glowColor.replace('0.3', '0.05')}`,
        }}
      />
      {children}
    </motion.div>
  );
}

export function GlowText({
  children,
  className = '',
  as: Component = 'span',
}: {
  children: ReactNode;
  className?: string;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'p';
}) {
  return (
    <Component className={`text-glow ${className}`} style={{ color: '#00ff88' }}>
      {children}
    </Component>
  );
}
