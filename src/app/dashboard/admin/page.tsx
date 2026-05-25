'use client';

import { motion } from 'framer-motion';
import {
  Shield,
  MapPin,
  Users,
  AlertTriangle,
  Activity,
  TrendingUp,
  Globe,
  BarChart3,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { useMemo } from 'react';

const OUTBREAK_DATA = [
  { id: 1, region: 'North Karnataka', disease: 'Early Blight', severity: 'high' as const, farms: 34, status: 'active' as const },
  { id: 2, region: 'Coastal Maharashtra', disease: 'Late Blight', severity: 'critical' as const, farms: 67, status: 'active' as const },
  { id: 3, region: 'Tamil Nadu Delta', disease: 'Leaf Curl Virus', severity: 'moderate' as const, farms: 12, status: 'contained' as const },
  { id: 4, region: 'Punjab Plains', disease: 'Rust', severity: 'high' as const, farms: 45, status: 'active' as const },
  { id: 5, region: 'Andhra Pradesh', disease: 'Bacterial Wilt', severity: 'moderate' as const, farms: 8, status: 'resolved' as const },
];

const SEVERITY_CONFIG = {
  moderate: { color: '#ffab00', bg: 'rgba(255,171,0,0.1)' },
  high: { color: '#ff3d57', bg: 'rgba(255,61,87,0.1)' },
  critical: { color: '#ff1744', bg: 'rgba(255,23,68,0.15)' },
};

const STATUS_CONFIG = {
  active: { color: '#ff3d57', label: 'Active' },
  contained: { color: '#ffab00', label: 'Contained' },
  resolved: { color: '#00ff88', label: 'Resolved' },
};

export default function AdminPage() {
  const diseaseDistribution = useMemo(() => [
    { name: 'Early Blight', value: 34, color: '#00ff88' },
    { name: 'Late Blight', value: 28, color: '#00e5ff' },
    { name: 'Leaf Curl', value: 18, color: '#ffab00' },
    { name: 'Rust', value: 12, color: '#ff3d57' },
    { name: 'Other', value: 8, color: '#b388ff' },
  ], []);

  const farmActivityData = useMemo(() => [
    { week: 'W1', scans: 120, alerts: 15, treatments: 45 },
    { week: 'W2', scans: 145, alerts: 22, treatments: 38 },
    { week: 'W3', scans: 198, alerts: 31, treatments: 67 },
    { week: 'W4', scans: 167, alerts: 18, treatments: 52 },
  ], []);

  return (
    <div className="p-4 lg:p-6 min-h-full bg-gradient-mesh">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-2 text-[#ff3d57] text-xs mb-2">
          <Shield className="w-4 h-4" />
          <span className="uppercase tracking-wider font-medium">Admin Control Panel</span>
        </div>
        <h1 className="text-2xl font-bold text-[#e8f5e9]">
          System <span className="text-[#ff3d57]">Administration</span>
        </h1>
        <p className="text-sm text-[#4a7c5c] mt-1">Regional monitoring, outbreak tracking & system analytics</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { icon: Users, label: 'Active Farmers', value: '2,847', trend: '+12%', color: '#00ff88' },
          { icon: Globe, label: 'Regions Monitored', value: '24', color: '#00e5ff' },
          { icon: AlertTriangle, label: 'Active Outbreaks', value: '3', color: '#ff3d57' },
          { icon: BarChart3, label: 'Total Scans Today', value: '1,423', trend: '+8%', color: '#b388ff' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            className="glass-card p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              <span className="text-xs text-[#4a7c5c]">{stat.label}</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-[#e8f5e9]">{stat.value}</span>
              {stat.trend && <span className="text-[11px] text-[#00ff88] mb-1">{stat.trend}</span>}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Outbreak Table */}
        <motion.div
          className="glass-card p-6 lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-[#ff3d57]" />
            <h3 className="text-sm font-medium text-[#81c784]">Regional Outbreak Monitoring</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[rgba(0,255,136,0.06)]">
                  <th className="text-left py-2 text-[10px] text-[#4a7c5c] uppercase tracking-wider">Region</th>
                  <th className="text-left py-2 text-[10px] text-[#4a7c5c] uppercase tracking-wider">Disease</th>
                  <th className="text-left py-2 text-[10px] text-[#4a7c5c] uppercase tracking-wider">Severity</th>
                  <th className="text-left py-2 text-[10px] text-[#4a7c5c] uppercase tracking-wider">Farms</th>
                  <th className="text-left py-2 text-[10px] text-[#4a7c5c] uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {OUTBREAK_DATA.map((outbreak, i) => (
                  <motion.tr
                    key={outbreak.id}
                    className="border-b border-[rgba(0,255,136,0.03)] hover:bg-[rgba(0,255,136,0.03)] transition-colors"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                  >
                    <td className="py-3 text-[#e8f5e9]">{outbreak.region}</td>
                    <td className="py-3 text-[#81c784]">{outbreak.disease}</td>
                    <td className="py-3">
                      <Badge style={{ background: SEVERITY_CONFIG[outbreak.severity].bg, color: SEVERITY_CONFIG[outbreak.severity].color, border: 'none' }} className="text-[10px]">
                        {outbreak.severity}
                      </Badge>
                    </td>
                    <td className="py-3 text-[#e8f5e9]">{outbreak.farms}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ background: STATUS_CONFIG[outbreak.status].color }} />
                        <span className="text-xs" style={{ color: STATUS_CONFIG[outbreak.status].color }}>
                          {STATUS_CONFIG[outbreak.status].label}
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Disease Distribution */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-[#b388ff]" />
            <h3 className="text-sm font-medium text-[#81c784]">Disease Distribution</h3>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={diseaseDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  dataKey="value"
                  stroke="none"
                >
                  {diseaseDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#0a1a10', border: '1px solid rgba(0,255,136,0.2)', borderRadius: '10px' }}
                  itemStyle={{ color: '#e8f5e9', fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5">
            {diseaseDistribution.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                  <span className="text-[#81c784]">{item.name}</span>
                </div>
                <span className="text-[#e8f5e9]">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Farm Activity Chart */}
      <motion.div
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-[#00ff88]" />
          <h3 className="text-sm font-medium text-[#81c784]">Weekly Platform Activity</h3>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={farmActivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,136,0.06)" />
              <XAxis dataKey="week" tick={{ fill: '#4a7c5c', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4a7c5c', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0a1a10', border: '1px solid rgba(0,255,136,0.2)', borderRadius: '10px' }} />
              <Bar dataKey="scans" fill="#00ff88" radius={[4, 4, 0, 0]} name="Scans" />
              <Bar dataKey="treatments" fill="#00e5ff" radius={[4, 4, 0, 0]} name="Treatments" />
              <Bar dataKey="alerts" fill="#ff3d57" radius={[4, 4, 0, 0]} name="Alerts" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
