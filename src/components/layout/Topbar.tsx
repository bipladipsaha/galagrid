'use client';

import { Bell, Search, Leaf, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { MOCK_ALERTS } from '@/data/mockWeather';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export function Topbar() {
  const { user, logout } = useAuthStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const unreadCount = MOCK_ALERTS.filter((a) => !a.isRead).length;

  return (
    <header className="sticky top-0 z-30 h-20 px-4 lg:px-8 py-4 pointer-events-none w-full">
      <div className="w-full flex items-center justify-between h-full max-w-[1600px] mx-auto pointer-events-auto glass-panel px-6 rounded-2xl" style={{ overflow: 'visible' }}>
        {/* Left - Mobile Logo + Search */}
        <div className="flex items-center gap-6">
          {/* Mobile Logo */}
          <Link href="/dashboard" className="lg:hidden flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--gaia-green-500)] flex items-center justify-center shadow-md">
              <Leaf className="w-4 h-4 text-[var(--gaia-text-primary)]" />
            </div>
            <span className="text-base font-bold text-[var(--gaia-green-800)] tracking-wide">
              AGRI<span className="text-[var(--gaia-green-500)]">MIND</span>
            </span>
          </Link>

          {/* Search */}
          <div className="hidden md:flex items-center gap-3 px-4 py-2.5 rounded-xl bg-black/5 border border-[var(--gaia-border-glass)] w-[320px] focus-within:border-[var(--gaia-green-500)] focus-within:bg-white transition-all">
            <Search className="w-4 h-4 text-[var(--gaia-text-muted)]" />
            <input
              type="text"
              placeholder="Search crops, diseases, commands..."
              className="bg-transparent text-sm text-[var(--gaia-text-primary)] placeholder-[var(--gaia-text-muted)] outline-none w-full font-mono"
            />
            <kbd className="hidden lg:inline-flex text-[10px] text-[var(--gaia-text-muted)] bg-black/5 px-2 py-1 rounded border border-[var(--gaia-border-glass)] font-mono">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right - Notifications + Profile */}
        <div className="flex items-center gap-4">
          {/* Live indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--gaia-green-200)] bg-[var(--gaia-green-50)]">
            <div className="w-2 h-2 rounded-full bg-[var(--gaia-green-500)] shadow-sm animate-pulse" />
            <span className="text-[10px] text-[var(--gaia-green-500)] font-bold tracking-widest uppercase">Live Feed</span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
              className="relative p-2.5 rounded-xl text-[var(--gaia-text-muted)] hover:bg-black/5 hover:text-[var(--gaia-green-800)] transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 text-[9px] font-bold bg-[var(--gaia-red)] text-[var(--gaia-text-primary)] rounded-full flex items-center justify-center shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-14 w-80 glass-panel shadow-2xl overflow-hidden"
                >
                  <div className="px-5 py-4 border-b border-[var(--gaia-border-glass)] bg-white/50">
                    <h3 className="text-sm font-bold text-[var(--gaia-text-primary)]">System Alerts</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto no-scrollbar bg-white">
                    {MOCK_ALERTS.slice(0, 5).map((alert) => (
                      <div
                        key={alert.id}
                        className={`px-5 py-4 border-b border-[var(--gaia-border-glass)] hover:bg-black/5 transition-colors cursor-pointer ${!alert.isRead ? 'bg-[var(--gaia-green-50)]' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-1.5 w-2 h-2 rounded-full ${alert.severity === 'critical' ? 'bg-[var(--gaia-red)] shadow-sm animate-pulse' : alert.severity === 'warning' ? 'bg-[var(--gaia-amber)] shadow-sm' : 'bg-[var(--gaia-green-500)] shadow-sm'}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[var(--gaia-text-primary)] truncate mb-1">{alert.title}</p>
                            <p className="text-[11px] text-[var(--gaia-text-muted)] line-clamp-2 leading-relaxed">{alert.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
              className="flex items-center gap-3 p-1.5 pr-3 rounded-xl hover:bg-black/5 transition-colors border border-transparent hover:border-[var(--gaia-border-glass)]"
            >
              <div className="w-8 h-8 rounded-lg bg-[var(--gaia-green-500)] flex items-center justify-center text-[var(--gaia-text-primary)] font-bold text-sm shadow-sm">
                {user?.displayName?.[0] || 'G'}
              </div>
              {user && (
                <div className="hidden md:block text-left">
                  <p className="text-xs font-bold text-[var(--gaia-text-primary)] tracking-wide">{user.displayName}</p>
                  <p className="text-[10px] text-[var(--gaia-green-500)] uppercase font-mono tracking-widest">{user.role}</p>
                </div>
              )}
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-14 w-48 glass-panel shadow-2xl overflow-hidden p-2 bg-white"
                >
                  <div className="p-2 mb-2 border-b border-[var(--gaia-border-glass)]">
                    <Badge variant="outline" className="w-full justify-center text-[10px] border-[var(--gaia-green-200)] text-[var(--gaia-green-500)] bg-[var(--gaia-green-50)]">
                      {user?.role?.toUpperCase() || 'GUEST'}
                    </Badge>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      window.location.href = '/login';
                    }}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--gaia-red)] hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Terminate Session
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
