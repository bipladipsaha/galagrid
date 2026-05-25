'use client';

import { Bell, Search, Menu, Leaf, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { MOCK_ALERTS } from '@/data/mockWeather';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user, logout } = useAuthStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const unreadCount = MOCK_ALERTS.filter((a) => !a.isRead).length;

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-[rgba(0,255,136,0.08)] bg-[rgba(5,8,7,0.85)] backdrop-blur-xl">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left - Mobile menu + Search */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-[#81c784] hover:bg-[rgba(0,255,136,0.1)] transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Mobile Logo */}
          <Link href="/dashboard" className="lg:hidden flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#00ff88] to-[#00cc6a] flex items-center justify-center">
              <Leaf className="w-4 h-4 text-[#030806]" />
            </div>
            <span className="text-sm font-bold text-[#e8f5e9]">
              AGRI<span className="text-[#00ff88]">MIND</span>
            </span>
          </Link>

          {/* Search */}
          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-[rgba(0,255,136,0.04)] border border-[rgba(0,255,136,0.08)] min-w-[280px]">
            <Search className="w-4 h-4 text-[#4a7c5c]" />
            <input
              type="text"
              placeholder="Search crops, diseases, sensors..."
              className="bg-transparent text-sm text-[#e8f5e9] placeholder-[#4a7c5c] outline-none w-full"
            />
            <kbd className="hidden lg:inline-flex text-[10px] text-[#4a7c5c] bg-[rgba(0,255,136,0.06)] px-1.5 py-0.5 rounded border border-[rgba(0,255,136,0.1)]">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right - Notifications + Profile */}
        <div className="flex items-center gap-2">
          {/* Live indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(0,255,136,0.06)] border border-[rgba(0,255,136,0.1)]">
            <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" style={{ boxShadow: '0 0 8px rgba(0,255,136,0.5)' }} />
            <span className="text-[11px] text-[#81c784] font-medium">Live</span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
              className="relative p-2 rounded-lg text-[#81c784] hover:bg-[rgba(0,255,136,0.1)] transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 text-[9px] font-bold bg-[#ff3d57] text-white rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute right-0 top-12 w-80 rounded-xl bg-[#0a1a10] border border-[rgba(0,255,136,0.12)] shadow-2xl overflow-hidden"
                  style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(0,255,136,0.05)' }}
                >
                  <div className="px-4 py-3 border-b border-[rgba(0,255,136,0.08)]">
                    <h3 className="text-sm font-semibold text-[#e8f5e9]">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {MOCK_ALERTS.slice(0, 5).map((alert) => (
                      <div
                        key={alert.id}
                        className={`px-4 py-3 border-b border-[rgba(0,255,136,0.05)] hover:bg-[rgba(0,255,136,0.04)] transition-colors ${!alert.isRead ? 'bg-[rgba(0,255,136,0.03)]' : ''}`}
                      >
                        <div className="flex items-start gap-2">
                          <div className={`mt-1 status-dot ${alert.severity === 'critical' ? 'status-dot-critical' : alert.severity === 'warning' ? 'status-dot-warning' : 'status-dot-normal'}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-[#e8f5e9] truncate">{alert.title}</p>
                            <p className="text-[11px] text-[#4a7c5c] mt-0.5 line-clamp-2">{alert.message}</p>
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
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[rgba(0,255,136,0.08)] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00ff88] to-[#00a857] flex items-center justify-center text-[#030806] font-bold text-sm">
                {user?.displayName?.[0] || 'G'}
              </div>
              {user && (
                <div className="hidden md:block text-left">
                  <p className="text-xs font-medium text-[#e8f5e9]">{user.displayName}</p>
                  <p className="text-[10px] text-[#4a7c5c] capitalize">{user.role}</p>
                </div>
              )}
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute right-0 top-12 w-48 rounded-xl bg-[#0a1a10] border border-[rgba(0,255,136,0.12)] shadow-2xl overflow-hidden"
                >
                  <div className="p-2">
                    <Badge variant="outline" className="w-full justify-center text-[10px] border-[rgba(0,255,136,0.2)] text-[#00ff88]">
                      {user?.role?.toUpperCase() || 'GUEST'}
                    </Badge>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      window.location.href = '/login';
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#ff3d57] hover:bg-[rgba(255,61,87,0.1)] transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
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
