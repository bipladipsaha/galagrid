'use client';

import { motion } from 'framer-motion';
import {
  Brain,
  TrendingUp,
  Clock,
  Zap,
  Activity,
  Leaf,
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
} from 'recharts';
import { useScanStore } from '@/store/useScanStore';
import { MOCK_DISEASES } from '@/data/mockDiseases';
import { Badge } from '@/components/ui/badge';
import { useMemo, useState, useEffect } from 'react';

export default function AnalysisPage() {
  const { result } = useScanStore();

  const data = useMemo(
    () => result ? { disease: result.disease, rootCause: result.rootCause, treatments: result.treatments } : MOCK_DISEASES['early_blight'],
    [result]
  );

  const { disease, rootCause } = data;
  const [revealedSteps, setRevealedSteps] = useState(0);

  useEffect(() => {
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

  const radarData = rootCause.factors.map((f) => ({
    factor: f.name,
    current: (f.current / (f.category === 'weather' && f.name === 'Temperature' ? 50 : f.name === 'Humidity' ? 100 : 500)) * 100,
    optimal: (f.optimal / (f.category === 'weather' && f.name === 'Temperature' ? 50 : f.name === 'Humidity' ? 100 : 500)) * 100,
    impact: f.impact,
  }));

  const correlationData = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      day: `Day ${i + 1}`,
      humidity: 60 + Math.random() * 30,
      temperature: 20 + Math.random() * 15,
      diseaseIndex: i > 10 ? 20 + (i - 10) * 8 + Math.random() * 10 : 10 + Math.random() * 10,
    }));
  }, []);

  return (
    <div className="max-w-[1600px] mx-auto min-h-full space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8 relative z-20">
        <div className="flex items-center gap-3 text-[var(--gaia-cyan)] text-xs mb-3">
          <Brain className="w-4 h-4 animate-pulse" />
          <span className="uppercase tracking-[0.2em] font-bold">Neural Root Cause Analysis Matrix</span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold text-[var(--gaia-text-primary)] tracking-tight">
          Causality: <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--gaia-red)] to-[var(--gaia-amber)] drop-shadow-[0_0_15px_rgba(255,42,77,0.3)]">{disease.name}</span>
        </h1>
      </motion.div>

      {/* Primary Cause Banner */}
      <motion.div
        className="glass-panel p-6 border-l-4 border-l-[var(--gaia-green-500)] relative overflow-hidden shadow-[0_0_20px_rgba(0,255,136,0.1)]"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[var(--gaia-green-500)] opacity-10 -translate-y-10 translate-x-10 blur-3xl pointer-events-none" />
        <div className="flex items-center gap-3 mb-3 relative z-10">
          <Zap className="w-5 h-5 text-[var(--gaia-green-500)] drop-shadow-[0_0_8px_rgba(0,255,136,0.5)]" />
          <span className="text-xs text-[var(--gaia-green-500)] uppercase tracking-widest font-bold">Primary Causal Vector</span>
        </div>
        <p className="text-lg text-[var(--gaia-text-primary)] font-medium leading-relaxed relative z-10 tracking-wide">{rootCause.primaryCause}</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        {/* AI Reasoning Panel */}
        <motion.div
          className="glass-panel p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Brain className="w-5 h-5 text-[var(--gaia-cyan)] drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]" />
            <h3 className="text-sm font-bold text-[var(--gaia-text-primary)] tracking-widest uppercase">Neural Inference Chain</h3>
          </div>
          <div className="space-y-4">
            {rootCause.reasoning.map((step, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: i < revealedSteps ? 1 : 0.2,
                  x: i < revealedSteps ? 0 : -10,
                }}
                transition={{ duration: 0.6 }}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 font-mono text-sm font-bold ${
                  i < revealedSteps ? 'bg-[rgba(0,255,136,0.1)] text-[var(--gaia-green-500)] border border-[rgba(0,255,136,0.3)] shadow-[0_0_10px_rgba(0,255,136,0.2)]' : 'bg-black/5 text-[var(--gaia-text-dim)] border border-transparent'
                }`}>
                  0{i + 1}
                </div>
                <p className={`text-sm leading-relaxed pt-1 ${i < revealedSteps ? 'text-[var(--gaia-text-primary)]' : 'text-[var(--gaia-text-dim)]'}`}>
                  {step}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Environmental Radar */}
        <motion.div
          className="glass-panel p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-5 h-5 text-[var(--gaia-purple)] drop-shadow-[0_0_10px_rgba(196,122,255,0.5)]" />
            <h3 className="text-sm font-bold text-[var(--gaia-text-primary)] tracking-widest uppercase">Ecosystem Radar</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--gaia-border-glass)" strokeDasharray="3 3" />
                <PolarAngleAxis dataKey="factor" tick={{ fill: 'var(--gaia-text-muted)', fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                <PolarRadiusAxis tick={false} axisLine={false} />
                <Radar name="Current" dataKey="current" stroke="var(--gaia-red)" fill="var(--gaia-red)" fillOpacity={0.2} strokeWidth={2} />
                <Radar name="Optimal" dataKey="optimal" stroke="var(--gaia-green-500)" fill="var(--gaia-green-500)" fillOpacity={0.1} strokeWidth={2} strokeDasharray="4 4" />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-8 mt-4">
            <div className="flex items-center gap-2 text-xs font-mono">
              <div className="w-4 h-1 bg-[var(--gaia-red)] shadow-[0_0_8px_var(--gaia-red)]" />
              <span className="text-[var(--gaia-text-muted)]">CURRENT</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <div className="w-4 h-1 bg-[var(--gaia-green-500)] opacity-60 border-t border-dashed border-white" />
              <span className="text-[var(--gaia-text-muted)]">OPTIMAL</span>
            </div>
          </div>
        </motion.div>

        {/* Factor Impact Analysis */}
        <motion.div
          className="glass-panel p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-5 h-5 text-[var(--gaia-amber)] drop-shadow-[0_0_10px_rgba(255,183,0,0.5)]" />
            <h3 className="text-sm font-bold text-[var(--gaia-text-primary)] tracking-widest uppercase">Parameter Impact Weights</h3>
          </div>
          <div className="space-y-4">
            {rootCause.factors.map((factor, i) => (
              <motion.div
                key={i}
                className="p-4 rounded-xl bg-black/5 border border-[var(--gaia-border-glass)] hover:border-[var(--gaia-border-glass)] transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-[10px] font-mono px-2 py-0.5 border-[var(--gaia-border-glass)] text-[var(--gaia-text-muted)] uppercase tracking-widest">
                      {factor.category}
                    </Badge>
                    <span className="text-sm font-bold text-[var(--gaia-text-primary)] tracking-wide">{factor.name}</span>
                  </div>
                  <span className={`text-xs font-mono font-bold ${
                    factor.status === 'critical' ? 'text-[var(--gaia-red)]' : factor.status === 'suboptimal' ? 'text-[var(--gaia-amber)]' : 'text-[var(--gaia-green-500)]'
                  }`}>
                    {factor.current} {factor.unit} <span className="text-[var(--gaia-text-dim)] font-normal">/ {factor.optimal} {factor.unit}</span>
                  </span>
                </div>
                <div className="h-2 rounded-full bg-black/5 overflow-hidden mb-3 border border-[var(--gaia-border-glass)]">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: factor.status === 'critical' ? 'var(--gaia-red)' : factor.status === 'suboptimal' ? 'var(--gaia-amber)' : 'var(--gaia-green-500)',
                      boxShadow: `0 0 10px ${factor.status === 'critical' ? 'var(--gaia-red)' : factor.status === 'suboptimal' ? 'var(--gaia-amber)' : 'var(--gaia-green-500)'}`
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${factor.impact}%` }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                  />
                </div>
                <p className="text-[11px] text-[var(--gaia-text-muted)] leading-relaxed font-medium">{factor.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Correlation Chart */}
        <motion.div
          className="glass-panel p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-5 h-5 text-[var(--gaia-cyan)] drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]" />
            <h3 className="text-sm font-bold text-[var(--gaia-text-primary)] tracking-widest uppercase">Multi-Variable Correlation</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={correlationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: 'var(--gaia-text-muted)', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} interval={4} />
                <YAxis tick={{ fill: 'var(--gaia-text-muted)', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ stroke: 'rgba(0,0,0,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }}
                  contentStyle={{ background: 'rgba(2, 6, 4, 0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                  itemStyle={{ fontSize: 11, fontFamily: 'JetBrains Mono', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="humidity" stroke="var(--gaia-cyan)" strokeWidth={3} dot={false} name="HUMIDITY %" />
                <Line type="monotone" dataKey="temperature" stroke="var(--gaia-amber)" strokeWidth={3} dot={false} name="TEMP °C" />
                <Line type="monotone" dataKey="diseaseIndex" stroke="var(--gaia-red)" strokeWidth={3} dot={false} name="DISEASE IDX" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-6">
            {[
              { color: 'var(--gaia-cyan)', label: 'HUMIDITY' },
              { color: 'var(--gaia-amber)', label: 'TEMPERATURE' },
              { color: 'var(--gaia-red)', label: 'DISEASE IDX' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-xs text-[var(--gaia-text-muted)] font-mono font-bold tracking-widest">
                <div className="w-3 h-3 rounded-full shadow-[0_0_8px_currentColor]" style={{ background: item.color, color: item.color }} />
                {item.label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Risk Timeline */}
      {rootCause.timeline.length > 0 && (
        <motion.div
          className="glass-panel p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <Clock className="w-5 h-5 text-[var(--gaia-amber)] drop-shadow-[0_0_10px_rgba(255,183,0,0.5)]" />
            <h3 className="text-sm font-bold text-[var(--gaia-text-primary)] tracking-widest uppercase">Chronological Risk Progression</h3>
          </div>
          <div className="relative pl-4">
            <div className="absolute left-[27px] top-4 bottom-4 w-px bg-gradient-to-b from-[rgba(0,255,136,0.3)] via-[rgba(255,183,0,0.3)] to-[rgba(255,42,77,0.3)]" />
            <div className="space-y-8">
              {rootCause.timeline.map((event, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.15 }}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2 border-[#000] ${
                    event.severity === 'high' ? 'bg-[var(--gaia-red)] shadow-[0_0_15px_var(--gaia-red)]' :
                    event.severity === 'medium' ? 'bg-[var(--gaia-amber)] shadow-[0_0_15px_var(--gaia-amber)]' :
                    'bg-[var(--gaia-green-500)] shadow-[0_0_15px_var(--gaia-green-500)]'
                  }`}>
                    <div className="w-2 h-2 rounded-full bg-white opacity-90" />
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-mono text-[var(--gaia-text-muted)] tracking-widest">{event.date}</span>
                      <Badge variant="outline" className="text-[9px] px-2 py-0.5 border-[var(--gaia-border-glass)] text-[var(--gaia-text-primary)] uppercase tracking-widest bg-black/5">
                        {event.factor}
                      </Badge>
                    </div>
                    <p className="text-base text-[var(--gaia-text-primary)] tracking-wide font-medium">{event.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Sustainability Score */}
      <motion.div
        className="glass-panel p-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Leaf className="w-5 h-5 text-[var(--gaia-green-500)] drop-shadow-[0_0_10px_rgba(0,255,136,0.5)]" />
            <h3 className="text-sm font-bold text-[var(--gaia-text-primary)] tracking-widest uppercase">Ecosystem Impact Assessment</h3>
          </div>
          <span className="text-3xl font-bold text-[var(--gaia-green-500)] font-mono drop-shadow-[0_0_10px_rgba(0,255,136,0.4)]">{rootCause.sustainabilityImpact}/100</span>
        </div>
        <div className="h-4 rounded-full bg-black/5 overflow-hidden border border-[var(--gaia-border-glass)] mb-3 relative">
          <motion.div
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[var(--gaia-red)] via-[var(--gaia-amber)] to-[var(--gaia-green-500)]"
            initial={{ width: 0 }}
            animate={{ width: `${rootCause.sustainabilityImpact}%` }}
            transition={{ delay: 0.7, duration: 1.5, ease: "easeOut" }}
          >
            <div className="absolute top-0 bottom-0 right-0 w-20 bg-gradient-to-r from-transparent to-white opacity-30" />
          </motion.div>
        </div>
        <div className="flex justify-between text-[11px] text-[var(--gaia-text-muted)] font-mono tracking-widest uppercase font-bold">
          <span>Critical Disruption</span>
          <span>Equilibrium</span>
        </div>
      </motion.div>
    </div>
  );
}
