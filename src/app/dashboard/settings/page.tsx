'use client';

import { motion } from 'framer-motion';
import { Settings, User, Bell, Palette, Shield, Save, Key, Cpu, Zap } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState({
    pathogenAlerts: true,
    telemetryWarnings: true,
    meteorologicalUpdates: true,
    neuralAnalysisReports: true,
  });

  return (
    <div className="max-w-[1200px] mx-auto min-h-full space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8 relative z-20">
        <div className="flex items-center gap-3 text-[var(--gaia-cyan)] text-xs mb-3">
          <Settings className="w-4 h-4 animate-spin-slow" />
          <span className="uppercase tracking-[0.2em] font-bold">System Configuration</span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold text-[var(--gaia-text-primary)] tracking-tight">
          Command <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--gaia-cyan)] to-[var(--gaia-green-500)] drop-shadow-[0_0_15px_rgba(0,240,255,0.4)]">Parameters</span>
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        <div className="lg:col-span-2 space-y-6">
          {/* Profile */}
          <motion.div className="glass-panel p-8" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-[var(--gaia-cyan)] drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]" />
              <h3 className="text-sm font-bold text-[var(--gaia-text-primary)] tracking-widest uppercase">Operator Identity</h3>
            </div>
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-2xl bg-[rgba(0,240,255,0.1)] border border-[rgba(0,240,255,0.3)] flex items-center justify-center text-[var(--gaia-text-primary)] font-bold text-3xl shadow-[0_0_20px_rgba(0,240,255,0.2)] font-mono">
                {user?.displayName?.[0] || 'G'}
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--gaia-text-primary)] tracking-wide">{user?.displayName || 'Operator Alpha'}</p>
                <p className="text-sm text-[var(--gaia-text-muted)] font-mono mt-1 mb-2">{user?.email || 'alpha@nexus.local'}</p>
                <Badge variant="outline" className="text-[10px] font-mono tracking-widest uppercase border-[var(--gaia-cyan)] text-[var(--gaia-cyan)] bg-[rgba(0,240,255,0.05)]">
                  CLEARANCE: {user?.role || 'COMMANDER'}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] text-[var(--gaia-text-muted)] font-mono uppercase tracking-widest mb-2 block font-bold">Designation</label>
                <input
                  type="text"
                  defaultValue={user?.displayName || 'Operator Alpha'}
                  className="w-full px-4 py-3 rounded-xl bg-white/50 border border-[var(--gaia-border-glass)] text-sm text-[var(--gaia-text-primary)] font-mono outline-none focus:border-[var(--gaia-cyan)] focus:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] text-[var(--gaia-text-muted)] font-mono uppercase tracking-widest mb-2 block font-bold">Comms Link (Email)</label>
                <input
                  type="email"
                  defaultValue={user?.email || 'alpha@nexus.local'}
                  className="w-full px-4 py-3 rounded-xl bg-white/50 border border-[var(--gaia-border-glass)] text-sm text-[var(--gaia-text-primary)] font-mono outline-none focus:border-[var(--gaia-cyan)] focus:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all"
                />
              </div>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div className="glass-panel p-8" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-5 h-5 text-[var(--gaia-amber)] drop-shadow-[0_0_10px_rgba(255,183,0,0.5)]" />
              <h3 className="text-sm font-bold text-[var(--gaia-text-primary)] tracking-widest uppercase">Alert Subroutines</h3>
            </div>
            <div className="space-y-4">
              {Object.entries(notifications).map(([key, enabled]) => (
                <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-black/5 border border-[var(--gaia-border-glass)]">
                  <span className="text-sm text-[var(--gaia-text-primary)] tracking-wide font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <button
                    onClick={() => setNotifications((prev) => ({ ...prev, [key]: !enabled }))}
                    className={`w-12 h-6 rounded-full transition-all relative ${enabled ? 'bg-[var(--gaia-green-500)] shadow-[0_0_10px_var(--gaia-green-500)]' : 'bg-black/10'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${enabled ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Save */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-end"
          >
            <motion.button
              className="btn-cyber px-8 py-4 rounded-xl font-bold tracking-widest uppercase flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Save className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Compile Configuration</span>
            </motion.button>
          </motion.div>
        </div>

        {/* System Diagnostics */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div className="glass-panel p-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
             <div className="flex items-center gap-3 mb-6">
              <Cpu className="w-5 h-5 text-[var(--gaia-purple)] drop-shadow-[0_0_10px_rgba(196,122,255,0.5)]" />
              <h3 className="text-sm font-bold text-[var(--gaia-text-primary)] tracking-widest uppercase">System Core</h3>
            </div>
            <div className="space-y-4">
               <div className="p-3 bg-white/50 rounded-lg border border-[var(--gaia-border-glass)]">
                 <p className="text-[10px] text-[var(--gaia-text-muted)] font-mono uppercase tracking-widest mb-1">Nexus Version</p>
                 <p className="text-sm font-bold text-[var(--gaia-purple)] font-mono">v4.2.0-beta</p>
               </div>
               <div className="p-3 bg-white/50 rounded-lg border border-[var(--gaia-border-glass)]">
                 <p className="text-[10px] text-[var(--gaia-text-muted)] font-mono uppercase tracking-widest mb-1">Neural Engine Status</p>
                 <div className="flex items-center gap-2">
                   <Zap className="w-3 h-3 text-[var(--gaia-green-500)]" />
                   <p className="text-sm font-bold text-[var(--gaia-green-500)] font-mono">ONLINE</p>
                 </div>
               </div>
               <div className="p-3 bg-white/50 rounded-lg border border-[var(--gaia-border-glass)]">
                 <p className="text-[10px] text-[var(--gaia-text-muted)] font-mono uppercase tracking-widest mb-1">Encryption Protocol</p>
                 <div className="flex items-center gap-2">
                   <Key className="w-3 h-3 text-[var(--gaia-cyan)]" />
                   <p className="text-sm font-bold text-[var(--gaia-cyan)] font-mono">AES-256 GCM</p>
                 </div>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
