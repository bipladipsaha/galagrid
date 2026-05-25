'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  ScanLine,
  Brain,
  FlaskConical,
  MessageSquare,
  Activity,
  Settings,
  Shield,
  Leaf,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/scanner', label: 'AI Scanner', icon: ScanLine },
  { href: '/dashboard/analysis', label: 'Root Cause', icon: Brain },
  { href: '/dashboard/chemicals', label: 'Chemicals', icon: FlaskConical },
  { href: '/dashboard/assistant', label: 'AI Assistant', icon: MessageSquare },
  { href: '/dashboard/sensors', label: 'Sensors', icon: Activity },
];

const BOTTOM_ITEMS = [
  { href: '/dashboard/admin', label: 'Admin', icon: Shield },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      className={cn(
        'hidden lg:flex flex-col h-screen sticky top-0 border-r border-[rgba(0,255,136,0.08)] bg-[#050a07] z-40',
        'transition-all duration-300'
      )}
      animate={{ width: collapsed ? 72 : 240 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-[rgba(0,255,136,0.08)]">
        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-[#00ff88] to-[#00cc6a] flex items-center justify-center">
          <Leaf className="w-5 h-5 text-[#030806]" />
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
          >
            <h1 className="text-base font-bold text-[#e8f5e9] tracking-tight">
              AGRI<span className="text-[#00ff88]">MIND</span>
            </h1>
            <p className="text-[10px] text-[#4a7c5c] tracking-widest uppercase -mt-0.5">
              AGRIMIND AI
            </p>
          </motion.div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
                  isActive
                    ? 'bg-[rgba(0,255,136,0.1)] text-[#00ff88]'
                    : 'text-[#81c784] hover:bg-[rgba(0,255,136,0.05)] hover:text-[#a5d6a7]'
                )}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-[#00ff88]"
                    layoutId="activeIndicator"
                    style={{ boxShadow: '0 0 10px rgba(0,255,136,0.5)' }}
                  />
                )}
                <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'drop-shadow-[0_0_6px_rgba(0,255,136,0.5)]')} />
                {!collapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
                {isActive && item.label === 'AI Scanner' && !collapsed && (
                  <span className="ml-auto px-1.5 py-0.5 text-[9px] font-bold bg-[#00ff88] text-[#030806] rounded-full">
                    AI
                  </span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom items */}
      <div className="px-2 pb-2 space-y-1 border-t border-[rgba(0,255,136,0.08)] pt-2">
        {BOTTOM_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-[rgba(0,255,136,0.1)] text-[#00ff88]'
                    : 'text-[#4a7c5c] hover:bg-[rgba(0,255,136,0.05)] hover:text-[#81c784]'
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span className="text-sm">{item.label}</span>}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-10 border-t border-[rgba(0,255,136,0.08)] text-[#4a7c5c] hover:text-[#00ff88] transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </motion.aside>
  );
}
