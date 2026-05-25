'use client';

export function AnimatedGradient({
  className = '',
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Animated gradient bg */}
      <div className="absolute inset-0 bg-animated-gradient" />
      {/* Radial overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 20% 50%, rgba(0,255,136,0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(0,229,255,0.04) 0%, transparent 50%)',
        }}
      />
      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
