'use client';

import { motion } from 'framer-motion';
import {
  Brain,
  AlertTriangle,
  TrendingUp,
  Clock,
  Zap,
  Activity,
  Droplets,
  Thermometer,
  Leaf,
  ChevronRight,
  Shield,
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';
import { useScanStore } from '@/store/useScanStore';
import { MOCK_DISEASES } from '@/data/mockDiseases';
import { Badge } from '@/components/ui/badge';
import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';

export default function AnalysisPage() {
  const { result } = useScanStore();

  // Use the last scan result or default to early blight for demo
  const data = useMemo(
    () => result ? { disease: result.disease, rootCause: result.rootCause, treatments: result.treatments } : MOCK_DISEASES['early_blight'],
    [result]
  );

  const { disease, rootCause, treatments } = data;
  const [revealedSteps, setRevealedSteps] = useState(0);

  useEffect(() => {
    // Staggered reveal of reasoning steps
    const timer = setInterval(() => {
      setRevealedSteps((prev) => {
        if (prev >= rootCause.reasoning.length) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 800);
    return () => clearInterval(timer);
  }, [rootCause.reasoning.length]);

  // Prepare radar data
  const radarData = rootCause.factors.map((f) => ({
    factor: f.name,
    current: (f.current / (f.category === 'weather' && f.name === 'Temperature' ? 50 : f.name === 'Humidity' ? 100 : 500)) * 100,
    optimal: (f.optimal / (f.category === 'weather' && f.name === 'Temperature' ? 50 : f.name === 'Humidity' ? 100 : 500)) * 100,
    impact: f.impact,
  }));

  // Correlation data
  const correlationData = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      day: `Day ${i + 1}`,
      humidity: 60 + Math.random() * 30,
      temperature: 20 + Math.random() * 15,
      diseaseIndex: i > 10 ? 20 + (i - 10) * 8 + Math.random() * 10 : 10 + Math.random() * 10,
    }));
  }, []);

  return (
    <div className="p-4 lg:p-6 min-h-full bg-gradient-mesh">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-2 text-[#00e5ff] text-xs mb-2">
          <Brain className="w-4 h-4" />
          <span className="uppercase tracking-wider font-medium">Root Cause Analysis Engine</span>
        </div>
        <h1 className="text-2xl font-bold text-[#e8f5e9]">
          Why did <span className="text-[#ff3d57]">{disease.name}</span> occur?
        </h1>
        <p className="text-sm text-[#4a7c5c] mt-1">
          AI-powered environmental analysis & causal reasoning
        </p>
      </motion.div>

      {/* Primary Cause Banner */}
      <motion.div
        className="glass-card p-5 mb-6 border-l-4 border-l-[#00ff88] relative overflow-hidden"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-[#00ff88] opacity-[0.03] -translate-y-10 translate-x-10" />
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-[#00ff88]" />
          <span className="text-xs text-[#81c784] uppercase tracking-wider font-medium">Primary Cause Identified</span>
        </div>
        <p className="text-base text-[#e8f5e9] font-medium">{rootCause.primaryCause}</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Reasoning Panel */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-4 h-4 text-[#00e5ff]" />
            <h3 className="text-sm font-medium text-[#81c784]">AI Reasoning Chain</h3>
          </div>
          <div className="space-y-3">
            {rootCause.reasoning.map((step, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: i < revealedSteps ? 1 : 0.2,
                  x: i < revealedSteps ? 0 : -10,
                }}
                transition={{ duration: 0.5 }}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold ${
                  i < revealedSteps ? 'bg-[rgba(0,255,136,0.15)] text-[#00ff88]' : 'bg-[rgba(0,255,136,0.05)] text-[#2d5a3f]'
                }`}>
                  {i + 1}
                </div>
                <p className={`text-sm leading-relaxed ${i < revealedSteps ? 'text-[#e8f5e9]' : 'text-[#2d5a3f]'}`}>
                  {step}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Environmental Radar */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-[#b388ff]" />
            <h3 className="text-sm font-medium text-[#81c784]">Environmental Radar</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(0,255,136,0.1)" />
                <PolarAngleAxis dataKey="factor" tick={{ fill: '#81c784', fontSize: 10 }} />
                <PolarRadiusAxis tick={false} axisLine={false} />
                <Radar name="Current" dataKey="current" stroke="#ff3d57" fill="#ff3d57" fillOpacity={0.15} strokeWidth={2} />
                <Radar name="Optimal" dataKey="optimal" stroke="#00ff88" fill="#00ff88" fillOpacity={0.1} strokeWidth={2} strokeDasharray="5 5" />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-0.5 bg-[#ff3d57]" />
              <span className="text-[#81c784]">Current</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-0.5 bg-[#00ff88] opacity-50" style={{ borderTop: '2px dashed #00ff88' }} />
              <span className="text-[#81c784]">Optimal</span>
            </div>
          </div>
        </motion.div>

        {/* Factor Impact Analysis */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-[#ffab00]" />
            <h3 className="text-sm font-medium text-[#81c784]">Factor Impact Analysis</h3>
          </div>
          <div className="space-y-3">
            {rootCause.factors.map((factor, i) => (
              <motion.div
                key={i}
                className="p-3 rounded-lg bg-[rgba(0,255,136,0.02)] border border-[rgba(0,255,136,0.05)]"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-[rgba(0,255,136,0.2)] text-[#4a7c5c]">
                      {factor.category}
                    </Badge>
                    <span className="text-sm font-medium text-[#e8f5e9]">{factor.name}</span>
                  </div>
                  <span className={`text-xs font-bold ${
                    factor.status === 'critical' ? 'text-[#ff3d57]' : factor.status === 'suboptimal' ? 'text-[#ffab00]' : 'text-[#00ff88]'
                  }`}>
                    {factor.current} {factor.unit} <span className="text-[#4a7c5c] font-normal">/ {factor.optimal} {factor.unit}</span>
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-[rgba(0,255,136,0.06)] overflow-hidden mb-1.5">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: factor.status === 'critical' ? '#ff3d57' : factor.status === 'suboptimal' ? '#ffab00' : '#00ff88',
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${factor.impact}%` }}
                    transition={{ delay: 0.5 + i * 0.08, duration: 0.8 }}
                  />
                </div>
                <p className="text-[11px] text-[#4a7c5c]">{factor.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Correlation Chart */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-[#00e5ff]" />
            <h3 className="text-sm font-medium text-[#81c784]">Environmental Correlation</h3>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={correlationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,136,0.06)" />
                <XAxis dataKey="day" tick={{ fill: '#4a7c5c', fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
                <YAxis tick={{ fill: '#4a7c5c', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#0a1a10', border: '1px solid rgba(0,255,136,0.2)', borderRadius: '10px' }}
                  itemStyle={{ fontSize: 11 }}
                />
                <Line type="monotone" dataKey="humidity" stroke="#00e5ff" strokeWidth={2} dot={false} name="Humidity %" />
                <Line type="monotone" dataKey="temperature" stroke="#ffab00" strokeWidth={2} dot={false} name="Temperature °C" />
                <Line type="monotone" dataKey="diseaseIndex" stroke="#ff3d57" strokeWidth={2} dot={false} name="Disease Index" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {[
              { color: '#00e5ff', label: 'Humidity' },
              { color: '#ffab00', label: 'Temperature' },
              { color: '#ff3d57', label: 'Disease Index' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5 text-xs text-[#81c784]">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                {item.label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Risk Timeline */}
      {rootCause.timeline.length > 0 && (
        <motion.div
          className="glass-card p-6 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-[#ffab00]" />
            <h3 className="text-sm font-medium text-[#81c784]">Risk Event Timeline</h3>
          </div>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-[rgba(0,255,136,0.1)]" />
            <div className="space-y-4">
              {rootCause.timeline.map((event, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-4 pl-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                    event.severity === 'high' ? 'bg-[#ff3d57] shadow-[0_0_10px_rgba(255,61,87,0.5)]' :
                    event.severity === 'medium' ? 'bg-[#ffab00] shadow-[0_0_10px_rgba(255,171,0,0.5)]' :
                    'bg-[#00ff88] shadow-[0_0_10px_rgba(0,255,136,0.5)]'
                  }`}>
                    <div className="w-2 h-2 rounded-full bg-white opacity-80" />
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-[#4a7c5c]">{event.date}</span>
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-[rgba(0,255,136,0.15)] text-[#4a7c5c]">
                        {event.factor}
                      </Badge>
                    </div>
                    <p className="text-sm text-[#e8f5e9]">{event.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Sustainability Score */}
      <motion.div
        className="glass-card p-6 mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-[#00ff88]" />
            <h3 className="text-sm font-medium text-[#81c784]">Sustainability Impact Assessment</h3>
          </div>
          <span className="text-2xl font-bold text-[#00ff88]">{rootCause.sustainabilityImpact}/100</span>
        </div>
        <div className="h-3 rounded-full bg-[rgba(0,255,136,0.06)] overflow-hidden mb-2">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#ff3d57] via-[#ffab00] to-[#00ff88]"
            initial={{ width: 0 }}
            animate={{ width: `${rootCause.sustainabilityImpact}%` }}
            transition={{ delay: 0.7, duration: 1.2 }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-[#4a7c5c]">
          <span>Critical Impact</span>
          <span>Minimal Impact</span>
        </div>
      </motion.div>
    </div>
  );
}
