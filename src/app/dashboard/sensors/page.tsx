'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Wifi, Signal, RefreshCw, AlertCircle } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { SENSOR_CONFIGS } from '@/data/mockSensors';
import { useMemo, useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { rtdb } from '@/lib/firebase';
import { ref, onValue } from 'firebase/database';
import { ShimmerLoader } from '@/components/effects/ShimmerLoader';

interface LiveSensorData {
  temperature: number;
  humidity: number;
  soilMoisture: number;
  timestamp: any;
  sensorId: string;
  status: string;
}

export default function SensorsPage() {
  const [selectedSensor, setSelectedSensor] = useState(SENSOR_CONFIGS[0]);
  const [liveData, setLiveData] = useState<LiveSensorData | null>(null);
  const [historyRaw, setHistoryRaw] = useState<LiveSensorData[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'online' | 'error'>('connecting');

  useEffect(() => {
    setHistoryRaw([]);
  }, []);

  useEffect(() => {
    setConnectionStatus('connecting');
    
    const unsub = onValue(
      ref(rtdb, 'AGRIMIND'),
      (snapshot) => {
        if (snapshot.exists()) {
          const raw = snapshot.val();
          
          const data: LiveSensorData = {
            temperature: raw.temperature || 0,
            humidity: raw.humidity || 0,
            soilMoisture: raw.soilMoisture || 0,
            timestamp: Date.now(),
            sensorId: 'ESP32_MAIN',
            status: raw.status || 'Normal'
          };
          
          setLiveData(data);
          setConnectionStatus('online');
          
          setHistoryRaw(prev => {
            const newArray = [...prev, data];
            if (newArray.length > 24) return newArray.slice(1);
            return newArray;
          });
        } else {
          const data: LiveSensorData = {
            temperature: 0,
            humidity: 0,
            soilMoisture: 0,
            timestamp: Date.now(),
            sensorId: 'ESP32_MAIN',
            status: 'Offline'
          };
          setLiveData(data);
          setConnectionStatus('error');
        }
      },
      (error) => {
        console.error("Live sensor feed error:", error);
        setConnectionStatus('error');
      }
    );

    return () => unsub();
  }, []);

  const allReadings = useMemo(() => {
    if (!liveData) return null;
    return SENSOR_CONFIGS.map(config => {
      let value = 0;
      if (config.type === 'temperature') value = liveData.temperature;
      else if (config.type === 'humidity') value = liveData.humidity;
      else if (config.type === 'soil_moisture') value = liveData.soilMoisture;
      else value = config.min + (config.max - config.min) * 0.5;

      const status = value >= config.optimalMin && value <= config.optimalMax ? 'normal' : 'warning';
      return { config, latest: { value, status } };
    });
  }, [liveData]);

  const chartData = useMemo(() => {
    return historyRaw.map(r => {
      let value = 0;
      if (selectedSensor.type === 'temperature') value = r.temperature;
      else if (selectedSensor.type === 'humidity') value = r.humidity;
      else if (selectedSensor.type === 'soil_moisture') value = r.soilMoisture;
      else value = selectedSensor.min + (selectedSensor.max - selectedSensor.min) * 0.5;

      const dateObj = r.timestamp?.toDate ? r.timestamp.toDate() : new Date(r.timestamp);
      
      return {
        time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        value: Number(value?.toFixed(1) || 0)
      };
    });
  }, [historyRaw, selectedSensor]);

  return (
    <div className="max-w-[1600px] mx-auto min-h-full space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8 relative z-20">
        <div className="flex items-center gap-3 text-[var(--gaia-cyan)] text-xs mb-3">
          <Activity className="w-4 h-4 animate-pulse" />
          <span className="uppercase tracking-[0.2em] font-bold">IoT Telemetry Array</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-[var(--gaia-text-primary)] tracking-tight">
              Live <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--gaia-cyan)] to-[var(--gaia-green-500)] drop-shadow-[0_0_15px_rgba(0,240,255,0.4)]">Telemetry</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-3 px-5 py-2.5 rounded-xl border backdrop-blur-md shadow-md ${
              connectionStatus === 'online' ? 'bg-[rgba(0,255,136,0.05)] border-[rgba(0,255,136,0.3)] shadow-[0_0_15px_rgba(0,255,136,0.1)]' :
              connectionStatus === 'connecting' ? 'bg-[rgba(255,171,0,0.05)] border-[rgba(255,171,0,0.3)]' :
              'bg-[rgba(255,42,77,0.05)] border-[rgba(255,42,77,0.3)]'
            }`}>
              {connectionStatus === 'online' ? (
                <>
                  <Wifi className="w-4 h-4 text-[var(--gaia-green-500)]" />
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[var(--gaia-green-500)] tracking-widest uppercase">Stream Active</span>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--gaia-green-500)] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--gaia-green-500)] shadow-[0_0_8px_var(--gaia-green-500)]"></span>
                    </span>
                  </div>
                </>
              ) : connectionStatus === 'connecting' ? (
                <>
                  <RefreshCw className="w-4 h-4 text-[var(--gaia-amber)] animate-spin" />
                  <span className="text-xs font-bold text-[var(--gaia-amber)] tracking-widest uppercase">Syncing...</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-[var(--gaia-red)]" />
                  <span className="text-xs font-bold text-[var(--gaia-red)] tracking-widest uppercase">Signal Lost</span>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sensor Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 relative z-10">
        {!allReadings ? (
          [...Array(5)].map((_, i) => <ShimmerLoader key={i} className="h-32 rounded-2xl opacity-50" />)
        ) : (
          allReadings.map(({ config, latest }, i) => {
            const isSelected = selectedSensor.type === config.type;
            return (
              <motion.div
                key={config.type}
                className={`p-5 rounded-2xl cursor-pointer transition-all ${
                  isSelected
                    ? 'glass-panel border-[var(--gaia-cyan)] shadow-[0_0_20px_rgba(0,240,255,0.15)] bg-[rgba(0,240,255,0.05)]'
                    : 'bg-black/5 border border-[var(--gaia-border-glass)] hover:border-[rgba(0,0,0,0.15)]'
                }`}
                onClick={() => setSelectedSensor(config)}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-[var(--gaia-text-muted)] uppercase tracking-widest font-mono">{config.label}</span>
                  <div className={`w-2 h-2 rounded-full ${latest.status === 'normal' ? 'bg-[var(--gaia-green-500)] shadow-[0_0_8px_var(--gaia-green-500)] animate-pulse' : 'bg-[var(--gaia-amber)] shadow-[0_0_8px_var(--gaia-amber)] animate-ping'}`} />
                </div>
                <div className="flex items-end gap-1.5 mb-2">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={latest.value}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="text-3xl font-bold text-[var(--gaia-text-primary)] font-mono"
                    >
                      {latest.value}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-xs text-[var(--gaia-text-dim)] font-bold mb-1.5 font-mono">{config.unit}</span>
                </div>
                <div className="mt-2">
                  <div className="h-1.5 rounded-full bg-black/5 overflow-hidden border border-[var(--gaia-border-glass)]">
                    <motion.div
                      className="h-full rounded-full"
                      animate={{ width: `${Math.min(100, Math.max(0, ((latest.value - config.min) / (config.max - config.min)) * 100))}%` }}
                      transition={{ type: "spring", stiffness: 50 }}
                      style={{ background: config.color, boxShadow: `0 0 10px ${config.color}` }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Selected Sensor Detail */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedSensor.type}
          className="glass-panel p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h3 className="text-2xl font-bold text-[var(--gaia-text-primary)] flex items-center gap-3">
                <div className="w-2 h-8 rounded-full" style={{ background: selectedSensor.color, boxShadow: `0 0 10px ${selectedSensor.color}` }} />
                {selectedSensor.label} Matrix
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="px-5 py-2.5 rounded-xl bg-black/5 border border-[var(--gaia-border-glass)]">
                <p className="text-[10px] text-[var(--gaia-text-muted)] uppercase font-mono tracking-widest mb-1 font-bold">Optimal Bandwidth</p>
                <p className="text-sm font-bold font-mono" style={{ color: selectedSensor.color, textShadow: `0 0 10px ${selectedSensor.color}80` }}>
                  {selectedSensor.optimalMin} – {selectedSensor.optimalMax} {selectedSensor.unit}
                </p>
              </div>
              <Badge variant="outline" className="px-4 py-2 border-[var(--gaia-cyan)] text-[var(--gaia-cyan)] bg-[rgba(0,240,255,0.05)] font-mono uppercase tracking-widest font-bold">
                <Signal className="w-4 h-4 mr-2 animate-pulse" />
                WS Connected
              </Badge>
            </div>
          </div>

          {!liveData ? (
            <div className="h-80 flex items-center justify-center">
              <ShimmerLoader className="w-full h-full rounded-2xl opacity-50" />
            </div>
          ) : (
            <>
              <div className="h-[350px] relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id={`gradient-${selectedSensor.type}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={selectedSensor.color} stopOpacity={0.6} />
                        <stop offset="100%" stopColor={selectedSensor.color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                    <XAxis 
                      dataKey="time" 
                      tick={{ fill: 'var(--gaia-text-muted)', fontSize: 10, fontFamily: 'JetBrains Mono' }} 
                      axisLine={false} 
                      tickLine={false}
                      minTickGap={30}
                    />
                    <YAxis
                      tick={{ fill: 'var(--gaia-text-muted)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                      axisLine={false}
                      tickLine={false}
                      domain={['dataMin - 2', 'dataMax + 2']}
                      tickFormatter={(val) => val.toFixed(1)}
                    />
                    <Tooltip
                      cursor={{ stroke: 'rgba(0,0,0,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }}
                      contentStyle={{
                        background: 'rgba(2, 6, 4, 0.9)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(0,255,136,0.2)',
                        borderRadius: '12px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                      }}
                      itemStyle={{ color: '#fff', fontSize: 12, fontFamily: 'JetBrains Mono', fontWeight: 'bold' }}
                      labelStyle={{ color: 'var(--gaia-text-muted)', fontSize: 10, fontFamily: 'JetBrains Mono', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                    />
                    
                    <Area
                      type="monotone"
                      dataKey={() => selectedSensor.optimalMax}
                      stroke="none"
                      fill="rgba(0,0,0,0.02)"
                      dot={false}
                      activeDot={false}
                      isAnimationActive={false}
                    />
                    
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={selectedSensor.color}
                      strokeWidth={4}
                      fill={`url(#gradient-${selectedSensor.type})`}
                      dot={false}
                      activeDot={{ r: 6, fill: '#030806', stroke: selectedSensor.color, strokeWidth: 3 }}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8 relative z-10">
                {[
                  { label: 'Current Output', value: chartData[chartData.length - 1]?.value || 0 },
                  { label: 'Moving Avg', value: parseFloat((chartData.reduce((s, d) => s + d.value, 0) / (chartData.length || 1)).toFixed(1)) },
                  { label: 'Session Min', value: chartData.length > 0 ? Math.min(...chartData.map((d) => d.value)) : 0 },
                  { label: 'Session Max', value: chartData.length > 0 ? Math.max(...chartData.map((d) => d.value)) : 0 },
                ].map((stat, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-black/5 border border-[var(--gaia-border-glass)] flex flex-col items-center justify-center hover:bg-[rgba(0,0,0,0.04)] hover:border-[var(--gaia-border-glass)] transition-colors">
                    <p className="text-[10px] text-[var(--gaia-text-muted)] font-mono uppercase tracking-widest mb-2 font-bold">{stat.label}</p>
                    <p className="text-2xl font-bold text-[var(--gaia-text-primary)] font-mono drop-shadow-[0_0_8px_rgba(0,0,0,0.1)]">
                      {stat.value} <span className="text-[10px] text-[var(--gaia-text-dim)] font-normal ml-1">{selectedSensor.unit}</span>
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
