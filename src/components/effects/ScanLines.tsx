'use client';

export function ScanLines({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} style={{ zIndex: 2 }}>
      {/* Horizontal scan lines */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 255, 136, 1) 2px,
            rgba(0, 255, 136, 1) 4px
          )`,
        }}
      />
      {/* Moving scan line */}
      <div
        className="absolute left-0 right-0 h-[2px]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.4), transparent)',
          animation: 'scan-line 4s linear infinite',
        }}
      />
    </div>
  );
}
