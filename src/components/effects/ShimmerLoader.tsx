'use client';

export function ShimmerLoader({
  className = '',
  lines = 3,
}: {
  className?: string;
  lines?: number;
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="shimmer rounded-lg"
          style={{
            height: i === 0 ? '24px' : '16px',
            width: i === lines - 1 ? '60%' : '100%',
          }}
        />
      ))}
    </div>
  );
}

export function ShimmerCard({ className = '' }: { className?: string }) {
  return (
    <div className={`glass-card p-6 space-y-4 ${className}`}>
      <div className="shimmer rounded-lg h-5 w-1/3" />
      <div className="shimmer rounded-lg h-10 w-2/3" />
      <div className="space-y-2">
        <div className="shimmer rounded h-3 w-full" />
        <div className="shimmer rounded h-3 w-4/5" />
      </div>
    </div>
  );
}
