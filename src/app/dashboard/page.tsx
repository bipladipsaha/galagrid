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
    <span>
      {prefix}{display}{suffix}
    </span>
  );
}

// ─── Health Score Gauge ───
function HealthScoreGauge({ score }: { score: number }) {
  const gaugeData = [{ value: score, fill: '#00ff88' }];
  
  return (
    <motion.div
      className="glass-card p-6 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-[#81c784]">Farm Health Score</h3>
        <ShieldCheck className="w-4 h-4 text-[#00ff88]" />
      </div>
      <div className="flex items-center justify-center py-2">
        <div className="relative w-36 h-36">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              innerRadius="75%"
              outerRadius="100%"
              data={gaugeData}
              startAngle={180}
              endAngle={0}
              barSize={10}
            >
              <RadialBar
                dataKey="value"
                cornerRadius={5}
                background={{ fill: 'rgba(0,255,136,0.08)' }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-[#00ff88] text-glow">
              <AnimatedCounter value={score} />
            </span>
            <span className="text-[10px] text-[#4a7c5c] uppercase tracking-wider">/ 100</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between text-[11px] text-[#4a7c5c]">
        <span>Poor</span>
        <span>Excellent</span>
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
      className="glass-card glass-card-hover p-5 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-[0.06] -translate-y-8 translate-x-8"
        style={{ background: color }}
      />
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${color}15`, boxShadow: `0 0 15px ${color}20` }}
        >
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <span className="text-xs text-[#81c784]">{title}</span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-[#e8f5e9]">
          <AnimatedCounter value={value} suffix={suffix || ''} />
        </span>
        {trend && (
          <span className="text-[11px] text-[#00ff88] flex items-center gap-0.5 mb-1">
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
      className="glass-card glass-card-hover p-4 relative overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-[#81c784]">{config.label}</span>
        <div className={`status-dot ${isNormal ? 'status-dot-normal' : 'status-dot-warning'}`} />
      </div>
      <div className="flex items-end gap-2 mb-2">
        <span className="text-xl font-bold text-[#e8f5e9]">{currentValue}</span>
        <span className="text-xs text-[#4a7c5c] mb-0.5">{config.unit}</span>
      </div>
      <div className="h-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparkData.map((v, i) => ({ i, v }))}>
            <defs>
              <linearGradient id={`spark-${config.type}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={config.color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={config.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={config.color}
              strokeWidth={1.5}
              fill={`url(#spark-${config.type})`}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

// ─── Weather Card ───
function WeatherCard() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadWeather() {
      try {
        setLoading(true);
        const data = await fetchWeatherData();
        if (mounted) {
          setWeatherData(data);
          setError(false);
        }
      } catch (err) {
        console.error(err);
        if (mounted) setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadWeather();
    // Auto refresh every 10 minutes
    const interval = setInterval(loadWeather, 10 * 60 * 1000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <motion.div
      className="glass-card p-6 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* Decorative background gradient based on weather */}
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-[0.03] -translate-y-12 translate-x-12 bg-gradient-to-br from-[#00e5ff] to-[#448aff]" />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-sm font-medium text-[#81c784]">Weather Intelligence</h3>
        {!loading && weatherData && (
          <span className="text-[10px] text-[#4a7c5c] flex items-center gap-1 bg-[rgba(0,255,136,0.05)] px-2 py-0.5 rounded-full border border-[rgba(0,255,136,0.1)]">
            <MapPin className="w-3 h-3 text-[#00ff88]" />
            {weatherData.location}
          </span>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <ShimmerLoader className="w-16 h-16 rounded-2xl" />
            <div className="space-y-2">
              <ShimmerLoader className="w-24 h-6" />
              <ShimmerLoader className="w-32 h-4" />
              <ShimmerLoader className="w-28 h-4" />
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {[...Array(7)].map((_, i) => (
              <ShimmerLoader key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        </div>
      ) : error || !weatherData ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <CloudRain className="w-8 h-8 text-[#4a7c5c] mb-2" />
          <p className="text-sm text-[#81c784]">Weather data unavailable</p>
          <p className="text-[10px] text-[#4a7c5c] mt-1">Check your connection</p>
        </div>
      ) : (
        <div className="relative z-10">
          <div className="flex items-center gap-5 mb-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[rgba(0,229,255,0.1)] to-[rgba(68,138,255,0.1)] border border-[rgba(0,229,255,0.2)] flex items-center justify-center flex-shrink-0">
              {weatherData.current.isDay ? (
                <Sun className="w-8 h-8 text-[#ffab00]" style={{ filter: 'drop-shadow(0 0 10px rgba(255,171,0,0.5))' }} />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#e8f5e9] shadow-[0_0_15px_rgba(255,255,255,0.5)]" /> // Moon fallback
              )}
            </div>
            <div>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-4xl font-bold text-[#e8f5e9] leading-none">{weatherData.current.temperature}°</span>
                <span className="text-sm text-[#00e5ff] font-medium mb-1">{weatherData.current.condition}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#81c784]">
                <div className="flex items-center gap-1"><Droplets className="w-3 h-3 text-[#00e5ff]" /> {weatherData.current.humidity}%</div>
                <div className="flex items-center gap-1"><Wind className="w-3 h-3 text-[#b388ff]" /> {weatherData.current.windSpeed} km/h</div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-1.5">
            {weatherData.forecast.map((day, i) => (
              <motion.div
                key={day.date}
                className="text-center p-2 rounded-xl bg-[rgba(0,255,136,0.02)] border border-[rgba(0,255,136,0.05)] hover:border-[rgba(0,229,255,0.3)] hover:bg-[rgba(0,229,255,0.05)] transition-all cursor-pointer group"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
              >
                <div className="text-[10px] text-[#4a7c5c] mb-1.5 font-medium group-hover:text-[#81c784] transition-colors">{day.date}</div>
                <div className="flex flex-col items-center gap-1">
                  {day.precipitationProb > 40 ? (
                    <CloudRain className="w-4 h-4 text-[#448aff]" />
                  ) : (
                    <Sun className="w-4 h-4 text-[#ffab00]" />
                  )}
                  <div className="mt-1 flex flex-col">
                    <span className="text-xs font-bold text-[#e8f5e9]">{day.maxTemp}°</span>
                    <span className="text-[10px] text-[#4a7c5c]">{day.minTemp}°</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ─── Alert Feed ───
function AlertFeed() {
  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-[#81c784]">AI Alerts</h3>
        <span className="px-2 py-0.5 text-[10px] font-medium bg-[rgba(255,61,87,0.15)] text-[#ff3d57] rounded-full">
          {MOCK_ALERTS.filter((a) => !a.isRead).length} new
        </span>
      </div>
      <div className="space-y-3">
        {MOCK_ALERTS.slice(0, 4).map((alert, i) => (
          <motion.div
            key={alert.id}
            className="flex items-start gap-3 p-3 rounded-lg bg-[rgba(0,255,136,0.02)] hover:bg-[rgba(0,255,136,0.05)] transition-colors cursor-pointer"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
          >
            <div className={`mt-0.5 status-dot ${alert.severity === 'critical' ? 'status-dot-critical' : alert.severity === 'warning' ? 'status-dot-warning' : 'status-dot-normal'}`} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[#e8f5e9]">{alert.title}</p>
              <p className="text-[11px] text-[#4a7c5c] mt-0.5 line-clamp-1">{alert.message}</p>
            </div>
            <span className="text-[10px] text-[#4a7c5c] whitespace-nowrap">
              {formatTimeAgo(alert.timestamp)}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function formatTimeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
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
    <div className="p-4 lg:p-6 space-y-6 bg-gradient-mesh min-h-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-[#e8f5e9]">
            Farm Operations <span className="text-[#00ff88] text-glow">Dashboard</span>
          </h1>
          <p className="text-sm text-[#4a7c5c] mt-1">
            Real-time monitoring • AI-powered insights • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link href="/dashboard/scanner">
          <motion.button
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#00ff88] to-[#00cc6a] text-[#030806] font-semibold text-sm flex items-center gap-2 hover:shadow-[0_0_25px_rgba(0,255,136,0.3)] transition-shadow"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <ScanLine className="w-4 h-4" />
            Scan Leaf
          </motion.button>
        </Link>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Disease Risk" value={metrics.diseaseRisk} suffix="%" icon={AlertTriangle} color="#ff3d57" trend="-5%" delay={0.1} />
        <MetricCard title="Sustainability" value={metrics.sustainabilityIndex} suffix="/100" icon={Leaf} color="#00ff88" trend="+3" delay={0.15} />
        <MetricCard title="Water Usage" value={metrics.waterUsage} suffix="L" icon={Droplets} color="#00e5ff" delay={0.2} />
        <MetricCard title="Total Scans" value={metrics.totalScans} icon={Zap} color="#b388ff" trend="+12" delay={0.25} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Score */}
        <HealthScoreGauge score={metrics.healthScore} />

        {/* Yield Prediction */}
        <motion.div
          className="glass-card p-6 lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-[#81c784]">Yield Prediction vs Actual</h3>
            <TrendingUp className="w-4 h-4 text-[#00ff88]" />
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yieldData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,136,0.06)" />
                <XAxis dataKey="month" tick={{ fill: '#4a7c5c', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#4a7c5c', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#0a1a10',
                    border: '1px solid rgba(0,255,136,0.2)',
                    borderRadius: '10px',
                    boxShadow: '0 0 20px rgba(0,255,136,0.1)',
                  }}
                  itemStyle={{ color: '#e8f5e9', fontSize: 12 }}
                  labelStyle={{ color: '#81c784', fontSize: 12 }}
                />
                <Bar dataKey="predicted" fill="#00ff88" radius={[4, 4, 0, 0]} opacity={0.8} name="Predicted" />
                <Bar dataKey="actual" fill="#00e5ff" radius={[4, 4, 0, 0]} opacity={0.6} name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Sensors Grid */}
      <div>
        <h3 className="text-sm font-medium text-[#81c784] mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Live Sensor Readings
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {SENSOR_CONFIGS.slice(0, 5).map((config, i) => {
            const sparkData = liveHistory.map(r => {
              if (config.type === 'temperature') return r.temperature;
              if (config.type === 'humidity') return r.humidity;
              if (config.type === 'soil_moisture') return r.soilMoisture;
              return config.min + (config.max - config.min) * 0.5; // fallback
            }).filter(v => v !== undefined) as number[];
            
            // If no data yet, show skeleton
            if (sparkData.length === 0) {
              return <ShimmerLoader key={config.type} className="h-[120px] rounded-xl" />;
            }
            
            return (
              <SensorMiniCard key={config.type} config={config} delay={0.3 + i * 0.05} sparkData={sparkData} />
            );
          })}
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Water Usage */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-[#81c784]">Water Usage Analytics</h3>
            <Droplets className="w-4 h-4 text-[#00e5ff]" />
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={waterData}>
                <defs>
                  <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00e5ff" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#00e5ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,136,0.06)" />
                <XAxis dataKey="day" tick={{ fill: '#4a7c5c', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#4a7c5c', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#0a1a10',
                    border: '1px solid rgba(0,255,136,0.2)',
                    borderRadius: '10px',
                  }}
                  itemStyle={{ color: '#e8f5e9', fontSize: 12 }}
                />
                <Area type="monotone" dataKey="usage" stroke="#00e5ff" strokeWidth={2} fill="url(#waterGrad)" name="Usage (L)" />
                <Line type="monotone" dataKey="optimal" stroke="#00ff88" strokeWidth={1} strokeDasharray="5 5" dot={false} name="Optimal" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Weather */}
        <WeatherCard />
      </div>

      {/* Alert Feed */}
      <AlertFeed />
    </div>
  );
}
