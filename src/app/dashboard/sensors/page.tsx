'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Wifi, Signal, Clock, RefreshCw, AlertCircle } from 'lucide-react';
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

  // 1. We no longer fetch history from Firestore because ESP32 only stores the latest data in RTDB.
  // We'll just build history locally while the page is open.
  useEffect(() => {
    // Initial clear
    setHistoryRaw([]);
  }, []);

  // 2. Subscribe to live latest document in Realtime Database
  useEffect(() => {
    setConnectionStatus('connecting');
    
    const unsub = onValue(
      ref(rtdb, 'AGRIMIND'),
      (snapshot) => {
        if (snapshot.exists()) {
          const raw = snapshot.val();
          
          // Map ESP32 JSON format to our frontend interface
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
          
          // Append to history array for live chart updating
          setHistoryRaw(prev => {
            const newArray = [...prev, data];
            if (newArray.length > 24) return newArray.slice(1);
            return newArray;
          });
        } else {
          // Default to 0 if no data exists in Firebase yet
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

  // Map the raw live data to all available configurations
  const allReadings = useMemo(() => {
    if (!liveData) return null;
    return SENSOR_CONFIGS.map(config => {
      let value = 0;
      if (config.type === 'temperature') value = liveData.temperature;
      else if (config.type === 'humidity') value = liveData.humidity;
      else if (config.type === 'soil_moisture') value = liveData.soilMoisture;
      else value = config.min + (config.max - config.min) * 0.5; // Mock fallback for NPK

      const status = value >= config.optimalMin && value <= config.optimalMax ? 'normal' : 'warning';
      return { config, latest: { value, status } };
    });
  }, [liveData]);

  // Format history for Recharts
  const chartData = useMemo(() => {
    return historyRaw.map(r => {
      let value = 0;
      if (selectedSensor.type === 'temperature') value = r.temperature;
      else if (selectedSensor.type === 'humidity') value = r.humidity;
      else if (selectedSensor.type === 'soil_moisture') value = r.soilMoisture;
      else value = selectedSensor.min + (selectedSensor.max - selectedSensor.min) * 0.5; // fallback

      // Handle both Firestore Timestamp and Date objects safely
      const dateObj = r.timestamp?.toDate ? r.timestamp.toDate() : new Date(r.timestamp);
      
      return {
        time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        value: Number(value?.toFixed(1) || 0)
      };
    });
  }, [historyRaw, selectedSensor]);

  return (
    <div className="p-4 lg:p-6 min-h-full bg-gradient-mesh">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-2 text-[#00e5ff] text-xs mb-2">
          <Activity className="w-4 h-4" />
          <span className="uppercase tracking-wider font-medium">IoT Monitoring System</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#e8f5e9]">
              Live <span className="text-[#00e5ff]">Telemetry</span>
            </h1>
            <p className="text-sm text-[#4a7c5c] mt-1">Real-time DHT22 and Soil Moisture streams</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
              connectionStatus === 'online' ? 'bg-[rgba(0,255,136,0.06)] border-[rgba(0,255,136,0.2)]' :
              connectionStatus === 'connecting' ? 'bg-[rgba(255,171,0,0.06)] border-[rgba(255,171,0,0.2)]' :
              'bg-[rgba(255,61,87,0.06)] border-[rgba(255,61,87,0.2)]'
            }`}>
              {connectionStatus === 'online' ? (
                <>
                  <Wifi className="w-4 h-4 text-[#00ff88]" />
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-[#00ff88]">Stream Active</span>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff88] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff88]"></span>
                    </span>
                  </div>
                </>
              ) : connectionStatus === 'connecting' ? (
                <>
                  <RefreshCw className="w-4 h-4 text-[#ffab00] animate-spin" />
                  <span className="text-xs font-medium text-[#ffab00]">Connecting to Node...</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-[#ff3d57]" />
                  <span className="text-xs font-medium text-[#ff3d57]">Connection Lost</span>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sensor Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-6">
        {!allReadings ? (
          [...Array(5)].map((_, i) => <ShimmerLoader key={i} className="h-28 rounded-xl" />)
        ) : (
          allReadings.map(({ config, latest }, i) => {
            const isSelected = selectedSensor.type === config.type;
            return (
              <motion.div
                key={config.type}
                className={`p-4 rounded-xl cursor-pointer transition-all ${
                  isSelected
                    ? 'glass-card border-[rgba(0,255,136,0.25)] glow-green'
                    : 'bg-[rgba(0,255,136,0.02)] border border-[rgba(0,255,136,0.05)] hover:border-[rgba(0,255,136,0.15)]'
                }`}
                onClick={() => setSelectedSensor(config)}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-[#4a7c5c] uppercase tracking-wider">{config.label}</span>
                  <div className={`status-dot ${latest.status === 'normal' ? 'status-dot-normal' : 'status-dot-warning'}`} />
                </div>
                <div className="flex items-end gap-1.5">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={latest.value}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="text-2xl font-bold text-[#e8f5e9]"
                    >
                      {latest.value}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-xs text-[#4a7c5c] mb-1">{config.unit}</span>
                </div>
                <div className="mt-1.5">
                  <div className="h-1 rounded-full bg-[rgba(0,255,136,0.06)] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      animate={{ width: `${Math.min(100, Math.max(0, ((latest.value - config.min) / (config.max - config.min)) * 100))}%` }}
                      transition={{ type: "spring", stiffness: 50 }}
                      style={{ background: config.color, opacity: 0.8 }}
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
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-[#e8f5e9] flex items-center gap-2">
                <div className="w-2 h-6 rounded-sm" style={{ background: selectedSensor.color }} />
                {selectedSensor.label} Trend
              </h3>
              <p className="text-xs text-[#4a7c5c] mt-1">Live data stream • Updates every 5s</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="px-4 py-2 rounded-lg bg-[rgba(0,0,0,0.2)] border border-[rgba(255,255,255,0.05)]">
                <p className="text-[10px] text-[#4a7c5c] uppercase mb-0.5">Optimal Range</p>
                <p className="text-sm font-medium" style={{ color: selectedSensor.color }}>
                  {selectedSensor.optimalMin} – {selectedSensor.optimalMax} {selectedSensor.unit}
                </p>
              </div>
              <Badge variant="outline" className="px-3 py-1.5 border-[rgba(0,255,136,0.3)] text-[#00ff88] bg-[rgba(0,255,136,0.05)]">
                <Signal className="w-3.5 h-3.5 mr-1.5 animate-pulse" />
                Live WebSocket
              </Badge>
            </div>
          </div>

          {!liveData ? (
            <div className="h-64 flex items-center justify-center">
              <ShimmerLoader className="w-full h-full rounded-xl" />
            </div>
          ) : (
            <>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id={`gradient-${selectedSensor.type}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={selectedSensor.color} stopOpacity={0.4} />
                        <stop offset="95%" stopColor={selectedSensor.color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis 
                      dataKey="time" 
                      tick={{ fill: '#4a7c5c', fontSize: 11 }} 
                      axisLine={false} 
                      tickLine={false}
                      minTickGap={30}
                    />
                    <YAxis
                      tick={{ fill: '#4a7c5c', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      domain={['dataMin - 2', 'dataMax + 2']}
                      tickFormatter={(val) => val.toFixed(1)}
                    />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(10, 26, 16, 0.9)',
                        border: '1px solid rgba(0,255,136,0.2)',
                        borderRadius: '12px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                        backdropFilter: 'blur(8px)'
                      }}
                      itemStyle={{ color: '#e8f5e9', fontSize: 13, fontWeight: 'bold' }}
                      labelStyle={{ color: '#81c784', fontSize: 11, marginBottom: '4px' }}
                    />
                    
                    {/* Reference lines for optimal range */}
                    <Area
                      type="monotone"
                      dataKey={() => selectedSensor.optimalMax}
                      stroke="none"
                      fill="rgba(0,255,136,0.02)"
                      dot={false}
                      activeDot={false}
                      isAnimationActive={false}
                    />
                    
                    {/* The actual data line */}
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={selectedSensor.color}
                      strokeWidth={3}
                      fill={`url(#gradient-${selectedSensor.type})`}
                      dot={false}
                      activeDot={{ r: 6, fill: '#030806', stroke: selectedSensor.color, strokeWidth: 3 }}
                      isAnimationActive={false} // Disable to make live appending smoother
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                {[
                  { label: 'Current Reading', value: chartData[chartData.length - 1]?.value || 0 },
                  { label: 'Moving Average', value: parseFloat((chartData.reduce((s, d) => s + d.value, 0) / (chartData.length || 1)).toFixed(1)) },
                  { label: 'Session Min', value: chartData.length > 0 ? Math.min(...chartData.map((d) => d.value)) : 0 },
                  { label: 'Session Max', value: chartData.length > 0 ? Math.max(...chartData.map((d) => d.value)) : 0 },
                ].map((stat, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[rgba(0,0,0,0.2)] border border-[rgba(255,255,255,0.03)] flex flex-col items-center justify-center group hover:bg-[rgba(0,255,136,0.02)] hover:border-[rgba(0,255,136,0.1)] transition-colors">
                    <p className="text-[10px] text-[#4a7c5c] uppercase tracking-wider mb-1 group-hover:text-[#81c784] transition-colors">{stat.label}</p>
                    <p className="text-xl font-bold text-[#e8f5e9]">
                      {stat.value} <span className="text-xs text-[#4a7c5c] font-normal">{selectedSensor.unit}</span>
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
