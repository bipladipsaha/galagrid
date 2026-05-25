'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ScanLine, Brain, MessageSquare, Activity, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/dashboard/sensors', label: 'IoT', icon: Activity },
  { href: '/dashboard/scanner', label: 'Scan', icon: ScanLine, isFab: true },
  { href: '/dashboard/analysis', label: 'Analysis', icon: Brain },
  { href: '/dashboard/assistant', label: 'AI', icon: MessageSquare },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2">
      <div className="glass-panel flex items-center justify-around py-3 px-2">
        {NAV_ITEMS.map((item, i) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.isFab) {
            return (
              <div key={item.href} className="relative -top-6">
                <Link href={item.href}>
                  <motion.button
                    className="btn-cyber w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,255,136,0.4)]"
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icon className="w-6 h-6 text-[var(--gaia-text-primary)]" />
                  </motion.button>
                </Link>
              </div>
            );
          }

          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <div className="flex flex-col items-center gap-1 group">
                <div className={cn(
                  "relative w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300",
                  isActive ? "bg-[rgba(0,255,136,0.15)] shadow-[inset_0_0_10px_rgba(0,255,136,0.2)]" : "transparent"
                )}>
                  {isActive && <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[var(--gaia-green-500)] rounded-full shadow-[0_0_5px_var(--gaia-green-500)]" />}
                  <Icon className={cn("w-5 h-5", isActive ? "text-[var(--gaia-green-500)]" : "text-[var(--gaia-text-muted)] group-hover:text-[var(--gaia-text-primary)]")} />
                </div>
                <span className={cn("text-[10px] font-medium tracking-wide", isActive ? "text-[var(--gaia-green-500)]" : "text-[var(--gaia-text-muted)]")}>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
