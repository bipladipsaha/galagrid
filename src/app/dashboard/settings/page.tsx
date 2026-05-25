'use client';

import { motion } from 'framer-motion';
import { Settings, User, Bell, Palette, Shield, Save } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState({
    diseaseAlerts: true,
    sensorWarnings: true,
    weatherUpdates: true,
    weeklyReport: true,
  });

  return (
    <div className="p-4 lg:p-6 min-h-full bg-gradient-mesh">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold text-[#e8f5e9]">
          <span className="text-[#81c784]">Settings</span>
        </h1>
        <p className="text-sm text-[#4a7c5c] mt-1">Manage your account and preferences</p>
      </motion.div>

      <div className="max-w-2xl space-y-6">
        {/* Profile */}
        <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-4">
            <User className="w-4 h-4 text-[#00ff88]" />
            <h3 className="text-sm font-medium text-[#81c784]">Profile</h3>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00ff88] to-[#00a857] flex items-center justify-center text-[#030806] font-bold text-xl">
              {user?.displayName?.[0] || 'G'}
            </div>
            <div>
              <p className="text-base font-semibold text-[#e8f5e9]">{user?.displayName || 'Demo User'}</p>
              <p className="text-sm text-[#4a7c5c]">{user?.email || 'demo@gaiagrid.ai'}</p>
              <Badge variant="outline" className="mt-1 text-[10px] border-[rgba(0,255,136,0.2)] text-[#00ff88] capitalize">
                {user?.role || 'farmer'}
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#81c784] mb-1 block">Display Name</label>
              <input
                type="text"
                defaultValue={user?.displayName || 'Ravi Kumar'}
                className="w-full px-3 py-2 rounded-lg bg-[rgba(0,255,136,0.04)] border border-[rgba(0,255,136,0.08)] text-sm text-[#e8f5e9] outline-none focus:border-[rgba(0,255,136,0.3)]"
              />
            </div>
            <div>
              <label className="text-xs text-[#81c784] mb-1 block">Email</label>
              <input
                type="email"
                defaultValue={user?.email || 'demo@gaiagrid.ai'}
                className="w-full px-3 py-2 rounded-lg bg-[rgba(0,255,136,0.04)] border border-[rgba(0,255,136,0.08)] text-sm text-[#e8f5e9] outline-none focus:border-[rgba(0,255,136,0.3)]"
              />
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-[#ffab00]" />
            <h3 className="text-sm font-medium text-[#81c784]">Notifications</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(notifications).map(([key, enabled]) => (
              <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-[rgba(0,255,136,0.02)] border border-[rgba(0,255,136,0.05)]">
                <span className="text-sm text-[#e8f5e9] capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                <button
                  onClick={() => setNotifications((prev) => ({ ...prev, [key]: !enabled }))}
                  className={`w-10 h-6 rounded-full transition-colors relative ${enabled ? 'bg-[#00ff88]' : 'bg-[rgba(0,255,136,0.1)]'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${enabled ? 'left-5' : 'left-1'}`} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Save */}
        <motion.button
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00ff88] to-[#00cc6a] text-[#030806] font-bold text-sm flex items-center gap-2"
          whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0,255,136,0.3)' }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Save className="w-4 h-4" />
          Save Changes
        </motion.button>
      </div>
    </div>
  );
}
