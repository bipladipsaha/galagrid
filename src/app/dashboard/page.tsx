'use client';

import { motion } from 'framer-motion';
import {
  Activity,
  Droplets,
  Leaf,
  ShieldCheck,
  TrendingUp,
  Zap,
  CloudRain,
  Thermometer,
  Wind,
  Sun,
  AlertTriangle,
  ArrowUpRight,
  ScanLine,
  MapPin,
  Wifi,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from 'recharts';
import { MOCK_DASHBOARD_METRICS, MOCK_ALERTS, MOCK_WEATHER, generateYieldData, generateWaterUsageData } from '@/data/mockWeather';
import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchWeatherData, WeatherData } from '@/lib/weather';
import { ShimmerLoader } from '@/components/effects/ShimmerLoader';
import { rtdb } from '@/lib/firebase';
import { ref, onValue } from 'firebase/database';
import { SENSOR_CONFIGS } from '@/data/mockSensors';

// ─── Animated Counter ───
function AnimatedCounter({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <span className="data-value">
      {prefix}{display}{suffix}
    </span>
  );
}

// ─── Health Score Gauge ───
function HealthScoreGauge({ score }: { score: number }) {
  const gaugeData = [{ value: score, fill: 'var(--gaia-green-500)' }];
  
  return (
    <motion.div
      className="glass-panel p-6 relative"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.6 }}
    >
      {/* Holographic sweep */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(0,255,136,0.05)] to-transparent -translate-x-full animate-[shimmer_4s_infinite_linear]" />
      
      <div className="flex items-center justify-between mb-2 relative z-10">
        <h3 className="text-sm font-bold text-[var(--gaia-text-primary)] tracking-wide">System Integrity</h3>
        <ShieldCheck className="w-5 h-5 text-[var(--gaia-green-500)] drop-shadow-[0_0_8px_rgba(0,255,136,0.5)]" />
      </div>
      <div className="flex items-center justify-center py-4 relative z-10">
        <div className="relative w-40 h-40">
          {/* Inner glowing core */}
          <div className="absolute inset-0 m-auto w-24 h-24 rounded-full bg-[var(--gaia-green-500)] opacity-10 blur-xl animate-pulse-soft" />
          
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              innerRadius="75%"
              outerRadius="100%"
              data={gaugeData}
              startAngle={180}
              endAngle={0}
              barSize={12}
            >
              <RadialBar
                dataKey="value"
                cornerRadius={10}
                background={{ fill: 'rgba(0,0,0,0.05)' }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center -mt-4">
            <span className="text-4xl font-bold text-[var(--gaia-green-500)] drop-shadow-[0_0_15px_rgba(0,255,136,0.6)] font-mono">
              <AnimatedCounter value={score} />
            </span>
            <span className="text-[10px] text-[var(--gaia-text-muted)] uppercase tracking-[0.2em] mt-1 font-bold">Optimal</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Metric Card ───
function MetricCard({
  title,
  value,
  suffix,
  icon: Icon,
  color,
  trend,
  delay = 0,
}: {
  title: string;
  value: number;
  suffix?: string;
  icon: React.ElementType;
  color: string;
  trend?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className="glass-panel glass-panel-hover p-5"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-[0.08] -translate-y-12 translate-x-12 blur-xl"
        style={{ background: color }}
      />
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center relative"
        >
          <div className="absolute inset-0 rounded-xl opacity-20" style={{ background: color }} />
          <Icon className="w-5 h-5 relative z-10" style={{ color, filter: `drop-shadow(0 0 8px ${color})` }} />
        </div>
        <span className="text-xs font-bold text-[var(--gaia-text-secondary)] uppercase tracking-wider">{title}</span>
      </div>
      <div className="flex items-end gap-3 relative z-10">
        <span className="text-3xl font-bold text-[var(--gaia-text-primary)] font-mono tracking-tight drop-shadow-[0_0_10px_rgba(0,0,0,0.15)]">
          <AnimatedCounter value={value} suffix={suffix || ''} />
        </span>
        {trend && (
          <span className="text-[11px] font-bold flex items-center gap-0.5 mb-1.5 px-2 py-0.5 rounded-md bg-[rgba(0,255,136,0.1)] text-[var(--gaia-green-500)] border border-[rgba(0,255,136,0.2)]">
            <ArrowUpRight className="w-3 h-3" />
            {trend}
          </span>
        )}
      </div>
    </motion.div>
  );
}

// ─── Sensor Mini Card ───
function SensorMiniCard({ config, delay, sparkData }: { config: typeof SENSOR_CONFIGS[0]; delay: number; sparkData: number[] }) {
  const currentValue = sparkData.length > 0 ? sparkData[sparkData.length - 1] : 0;
  const isNormal = currentValue >= config.optimalMin && currentValue <= config.optimalMax;

  return (
    <motion.div
      className="glass-panel p-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-bold text-[var(--gaia-text-muted)] uppercase tracking-wider">{config.label}</span>
        <div className={`w-2 h-2 rounded-full ${isNormal ? 'bg-[var(--gaia-green-500)] shadow-[0_0_8px_var(--gaia-green-500)] animate-pulse' : 'bg-[var(--gaia-amber)] shadow-[0_0_8px_var(--gaia-amber)]'}`} />
      </div>
      <div className="flex items-end gap-1 mb-2">
        <span className="text-2xl font-bold text-[var(--gaia-text-primary)] font-mono">{currentValue}</span>
        <span className="text-[10px] text-[var(--gaia-text-muted)] mb-1 font-bold">{config.unit}</span>
      </div>
      <div className="h-12 -mx-2 -mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparkData.map((v, i) => ({ i, v }))}>
            <defs>
              <linearGradient id={`spark-${config.type}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={config.color} stopOpacity={0.4} />
                <stop offset="100%" stopColor={config.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={config.color}
              strokeWidth={2}
              fill={`url(#spark-${config.type})`}
              dot={false}
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

// ─── Main Dashboard ───
export default function DashboardPage() {
  const yieldData = useMemo(() => generateYieldData(), []);
  const waterData = useMemo(() => generateWaterUsageData(), []);
  const metrics = MOCK_DASHBOARD_METRICS;

  const [liveHistory, setLiveHistory] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;

    const unsub = onValue(ref(rtdb, 'AGRIMIND'), (snapshot) => {
      if (snapshot.exists() && mounted) {
        const data = snapshot.val();
        setLiveHistory(prev => {
          const newData = {
            temperature: data.temperature || 0,
            humidity: data.humidity || 0,
            soilMoisture: data.soilMoisture || 0,
            timestamp: Date.now(),
          };
          const arr = [...prev, newData];
          return arr.length > 15 ? arr.slice(1) : arr;
        });
      }
    });

    return () => {
      mounted = false;
      unsub();
    };
  }, []);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 relative z-20"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.2)] mb-3">
            <Wifi className="w-3 h-3 text-[var(--gaia-green-500)] animate-pulse" />
            <span className="text-[10px] text-[var(--gaia-green-500)] font-bold tracking-widest uppercase">System Online</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-[var(--gaia-text-primary)] tracking-tight">
            Command <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--gaia-green-500)] to-[var(--gaia-cyan)] drop-shadow-[0_0_15px_rgba(0,255,136,0.3)]">Nexus</span>
          </h1>
        </div>
        <Link href="/dashboard/scanner">
          <motion.button
            className="btn-cyber px-6 py-3 rounded-xl font-bold tracking-wide flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ScanLine className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Initialize Scanner</span>
          </motion.button>
        </Link>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 relative z-10">
        <MetricCard title="Pathogen Risk" value={metrics.diseaseRisk} suffix="%" icon={AlertTriangle} color="var(--gaia-red)" trend="-5.2%" delay={0.1} />
        <MetricCard title="Eco Score" value={metrics.sustainabilityIndex} suffix="/100" icon={Leaf} color="var(--gaia-green-500)" trend="+3.1" delay={0.2} />
        <MetricCard title="H2O Flux" value={metrics.waterUsage} suffix="L" icon={Droplets} color="var(--gaia-cyan)" delay={0.3} />
        <MetricCard title="Neural Scans" value={metrics.totalScans} icon={Zap} color="var(--gaia-purple)" trend="+12" delay={0.4} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        {/* Health Score */}
        <HealthScoreGauge score={metrics.healthScore} />

        {/* Yield Prediction */}
        <motion.div
          className="glass-panel p-6 lg:col-span-2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-[var(--gaia-text-primary)] tracking-wide">Predictive Yield Modeling</h3>
            <TrendingUp className="w-5 h-5 text-[var(--gaia-green-500)] drop-shadow-[0_0_8px_rgba(0,255,136,0.5)]" />
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yieldData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: 'var(--gaia-text-muted)', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--gaia-text-muted)', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  contentStyle={{
                    background: 'rgba(2, 6, 4, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0,255,136,0.2)',
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  }}
                  itemStyle={{ color: '#fff', fontSize: 12, fontFamily: 'JetBrains Mono', fontWeight: 'bold' }}
                  labelStyle={{ color: 'var(--gaia-green-500)', fontSize: 10, uppercase: true, letterSpacing: '0.1em' }}
                />
                <Bar dataKey="predicted" fill="var(--gaia-green-500)" radius={[4, 4, 0, 0]} opacity={0.9} name="PREDICTED" />
                <Bar dataKey="actual" fill="var(--gaia-cyan)" radius={[4, 4, 0, 0]} opacity={0.7} name="ACTUAL" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Sensors Grid */}
      <div className="relative z-10">
        <h3 className="text-sm font-bold text-[var(--gaia-text-primary)] mb-4 flex items-center gap-2 uppercase tracking-widest">
          <Activity className="w-4 h-4 text-[var(--gaia-green-500)]" />
          IoT Telemetry Stream
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {SENSOR_CONFIGS.slice(0, 5).map((config, i) => {
            const sparkData = liveHistory.map(r => {
              if (config.type === 'temperature') return r.temperature;
              if (config.type === 'humidity') return r.humidity;
              if (config.type === 'soil_moisture') return r.soilMoisture;
              return config.min + (config.max - config.min) * 0.5;
            }).filter(v => v !== undefined) as number[];
            
            if (sparkData.length === 0) {
              return <ShimmerLoader key={config.type} className="h-[130px] rounded-2xl opacity-50" />;
            }
            
            return (
              <SensorMiniCard key={config.type} config={config} delay={0.4 + i * 0.1} sparkData={sparkData} />
            );
          })}
        </div>
      </div>
    </div>
  );
}
