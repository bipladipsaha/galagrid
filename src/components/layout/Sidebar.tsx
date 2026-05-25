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
  LogOut,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';

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
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <motion.aside
      className={cn(
        'hidden lg:flex flex-col sticky top-4 h-[calc(100vh-2rem)] ml-4 z-40',
        'glass-panel transition-all duration-300'
      )}
      animate={{ width: collapsed ? 80 : 260 }}
    >
      {/* Brand Logo */}
      <div className="flex items-center gap-4 px-5 h-20 border-b border-[var(--gaia-border-glass)] relative overflow-hidden bg-white/50">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[var(--gaia-green-500)] flex items-center justify-center shadow-md relative">
          <Leaf className="w-5 h-5 text-[var(--gaia-text-primary)]" />
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex flex-col"
          >
            <h1 className="text-lg font-bold text-[var(--gaia-green-800)] tracking-wide font-display">
              AGRI<span className="text-[var(--gaia-green-500)]">MIND</span>
            </h1>
            <p className="text-[10px] text-[var(--gaia-text-muted)] tracking-[0.2em] uppercase font-mono mt-0.5">
              Intelligence
            </p>
          </motion.div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto no-scrollbar">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                className={cn(
                  'flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden',
                  isActive
                    ? 'bg-[var(--gaia-green-50)] text-[var(--gaia-green-500)] border border-[var(--gaia-green-200)] shadow-sm'
                    : 'text-[var(--gaia-text-muted)] hover:bg-[rgba(0,0,0,0.02)] hover:text-[var(--gaia-green-800)] border border-transparent'
                )}
                whileHover={{ x: isActive ? 0 : 4 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--gaia-green-500)]"
                    layoutId="activeIndicator"
                  />
                )}
                
                {/* Icon Container */}
                <div className="relative flex items-center justify-center w-6 h-6">
                  {isActive && <div className="absolute inset-0 bg-[var(--gaia-green-200)] blur-md opacity-40 rounded-full" />}
                  <Icon className={cn('w-5 h-5 relative z-10 transition-colors', isActive ? 'text-[var(--gaia-green-500)]' : 'group-hover:text-[var(--gaia-green-800)]')} />
                </div>

                {!collapsed && (
                  <span className="text-sm font-semibold tracking-wide">{item.label}</span>
                )}
                
                {/* Badge */}
                {isActive && item.label === 'AI Scanner' && !collapsed && (
                  <span className="ml-auto px-2 py-0.5 text-[10px] font-bold bg-[var(--gaia-cyan)] text-[var(--gaia-green-900)] rounded-full shadow-sm">
                    AI
                  </span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 space-y-2 border-t border-[var(--gaia-border-glass)] bg-white/40">
        {BOTTOM_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  'flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all duration-200',
                  isActive
                    ? 'bg-[var(--gaia-green-50)] text-[var(--gaia-green-500)]'
                    : 'text-[var(--gaia-text-muted)] hover:bg-[rgba(0,0,0,0.02)] hover:text-[var(--gaia-green-800)]'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </div>
            </Link>
          );
        })}
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all duration-200 text-[var(--gaia-red)] hover:bg-red-50 w-full"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Log Out</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-12 bg-white/60 hover:bg-[var(--gaia-green-50)] text-[var(--gaia-text-muted)] hover:text-[var(--gaia-green-500)] transition-colors border-t border-[var(--gaia-border-glass)]"
      >
        {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
      </button>
    </motion.aside>
  );
}
