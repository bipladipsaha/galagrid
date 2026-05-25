'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useRef, useState } from 'react';
import {
  Upload,
  ScanLine,
  Leaf,
  AlertTriangle,
  Shield,
  Droplets,
  Sprout,
  ChevronRight,
  X,
  Zap,
  RefreshCw,
  CheckCircle,
  Brain,
  FlaskConical,
} from 'lucide-react';
import { useScanStore } from '@/store/useScanStore';
import { simulateScanResult } from '@/data/mockDiseases';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

// ─── Severity Config ───
const SEVERITY_CONFIG = {
  low: { color: 'var(--gaia-green-500)', bg: 'rgba(0,255,136,0.1)', label: 'Low' },
  moderate: { color: 'var(--gaia-amber)', bg: 'rgba(255,171,0,0.1)', label: 'Moderate' },
  high: { color: 'var(--gaia-red)', bg: 'rgba(255,42,77,0.1)', label: 'High' },
  critical: { color: '#ff1744', bg: 'rgba(255,23,68,0.15)', label: 'Critical' },
};

// ─── Scan Stages ───
const SCAN_STAGES = [
  { key: 'uploading', label: 'Initializing Link', icon: Upload, duration: 800 },
  { key: 'analyzing', label: 'Neural Matrix Sync', icon: Brain, duration: 1500 },
  { key: 'detecting', label: 'Pathogen Detection', icon: ScanLine, duration: 1200 },
  { key: 'reasoning', label: 'Causal Inference', icon: Zap, duration: 1000 },
];

export default function ScannerPage() {
  const {
    selectedImage,
    imagePreview,
    isScanning,
    scanStage,
    scanProgress,
    result,
    setImage,
    startScan,
    setScanStage,
    setScanProgress,
    setResult,
    resetScan,
  } = useScanStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = useCallback(
    (file: File) => {
      if (file && file.type.startsWith('image/')) {
        setImage(file);
      }
    },
    [setImage]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleScan = useCallback(async () => {
    if (!imagePreview) return;
    startScan();

    let progress = 0;
    for (const stage of SCAN_STAGES) {
      setScanStage(stage.key as 'uploading' | 'analyzing' | 'detecting' | 'reasoning');
      const stageProgress = 100 / SCAN_STAGES.length;
      const steps = 20;
      for (let i = 0; i < steps; i++) {
        await new Promise((r) => setTimeout(r, stage.duration / steps));
        progress += stageProgress / steps;
        setScanProgress(Math.min(progress, 99));
      }
    }

    const scanResult = simulateScanResult(imagePreview);
    setResult(scanResult);
  }, [imagePreview, startScan, setScanStage, setScanProgress, setResult]);

  return (
    <div className="max-w-[1600px] mx-auto min-h-full">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8 relative z-20">
        <h1 className="text-3xl lg:text-4xl font-bold text-[var(--gaia-text-primary)] tracking-tight">
          Holographic <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--gaia-cyan)] to-[var(--gaia-green-500)] drop-shadow-[0_0_15px_rgba(0,255,136,0.3)]">Scanner</span>
        </h1>
        <p className="text-sm text-[var(--gaia-text-muted)] mt-2 max-w-xl font-mono">
          Upload biomatter image for AI neural diagnosis and root cause analysis
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        {/* Left — Upload / Image / Scan */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {!imagePreview ? (
              // ─── Upload Zone ───
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`glass-panel transition-all duration-300 cursor-pointer overflow-hidden ${
                  isDragging
                    ? 'border-[var(--gaia-green-500)] bg-[rgba(0,255,136,0.05)] shadow-[0_0_30px_rgba(0,255,136,0.2)]'
                    : 'border-[rgba(0,255,136,0.1)] hover:border-[rgba(0,255,136,0.3)]'
                }`}
                style={{ minHeight: '450px' }}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                />

                {/* Holographic grid overlay */}
                <div className="absolute inset-0 bg-holographic-grid opacity-30 pointer-events-none" />

                <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                  <motion.div
                    className="w-24 h-24 rounded-2xl bg-[rgba(0,255,136,0.05)] border border-[rgba(0,255,136,0.2)] flex items-center justify-center mb-8 relative"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <div className="absolute inset-0 bg-[var(--gaia-green-500)] opacity-20 blur-xl rounded-2xl" />
                    <ScanLine className="w-12 h-12 text-[var(--gaia-green-500)] relative z-10 drop-shadow-[0_0_15px_rgba(0,255,136,0.8)]" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-[var(--gaia-text-primary)] tracking-wide mb-3">
                    Drag biomatter sample here
                  </h3>
                  <p className="text-sm text-[var(--gaia-text-muted)] text-center mb-6 font-mono">
                    or click to browse • High-Res JPG/PNG
                  </p>
                  <div className="px-5 py-2 rounded-full bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.2)] text-xs text-[var(--gaia-green-500)] font-bold tracking-widest uppercase">
                    Neural Analysis Ready
                  </div>
                </div>

                {/* Cyber Brackets */}
                {['top-6 left-6', 'top-6 right-6', 'bottom-6 left-6', 'bottom-6 right-6'].map((pos, i) => (
                  <div key={i} className={`absolute ${pos} w-8 h-8 border-[var(--gaia-green-500)] opacity-40 ${
                    i === 0 ? 'border-t-2 border-l-2' :
                    i === 1 ? 'border-t-2 border-r-2' :
                    i === 2 ? 'border-b-2 border-l-2' :
                    'border-b-2 border-r-2'
                  }`} />
                ))}
              </motion.div>
            ) : (
              // ─── Image Preview with Scan Overlay ───
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-panel overflow-hidden"
                style={{ minHeight: '450px' }}
              >
                {/* Image */}
                <img
                  src={imagePreview}
                  alt="Leaf scan"
                  className="w-full h-full object-cover"
                  style={{ minHeight: '450px', maxHeight: '550px' }}
                />

                {/* Scan overlay during scanning */}
                {isScanning && (
                  <>
                    <div className="absolute inset-0 bg-holographic-grid opacity-60" />
                    {/* Scanning Laser */}
                    <motion.div
                      className="absolute left-0 right-0 h-1 z-20"
                      style={{
                        background: 'linear-gradient(90deg, transparent, var(--gaia-green-500), transparent)',
                        boxShadow: '0 0 20px rgba(0,255,136,0.8), 0 0 60px rgba(0,255,136,0.4)',
                      }}
                      animate={{ top: ['0%', '100%'] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[rgba(0,255,136,0.2)] to-transparent pointer-events-none -translate-y-full" />
                    </motion.div>
                    
                    {/* Cyber Brackets targeting */}
                    {['top-8 left-8', 'top-8 right-8', 'bottom-8 left-8', 'bottom-8 right-8'].map((pos, i) => (
                      <motion.div
                        key={i}
                        className={`absolute ${pos} w-10 h-10`}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <div className={`w-full h-full border-[var(--gaia-cyan)] ${
                          i === 0 ? 'border-t-4 border-l-4' :
                          i === 1 ? 'border-t-4 border-r-4' :
                          i === 2 ? 'border-b-4 border-l-4' :
                          'border-b-4 border-r-4'
                        }`} style={{ boxShadow: '0 0 15px rgba(0,240,255,0.5)' }} />
                      </motion.div>
                    ))}
                    {/* Deep shadow */}
                    <div className="absolute inset-0 bg-[rgba(0,0,0,0.5)] z-10" />
                  </>
                )}

                {/* Top controls */}
                {!isScanning && !result && (
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); resetScan(); }}
                      className="p-3 rounded-xl bg-[rgba(0,0,0,0.7)] backdrop-blur-md text-[var(--gaia-text-primary)] hover:bg-[rgba(255,42,77,0.8)] transition-colors border border-[var(--gaia-border-glass)]"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scan Button / Progress */}
          <AnimatePresence>
            {imagePreview && !result && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
                {!isScanning ? (
                  <motion.button
                    onClick={handleScan}
                    className="btn-cyber w-full py-5 rounded-xl font-bold tracking-widest text-lg uppercase flex items-center justify-center gap-4"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ScanLine className="w-6 h-6 relative z-10" />
                    <span className="relative z-10">Execute Neural Scan</span>
                  </motion.button>
                ) : (
                  <div className="glass-panel p-5 space-y-4">
                    {/* Progress bar */}
                    <div className="h-3 rounded-full bg-[rgba(0,255,136,0.1)] overflow-hidden border border-[rgba(0,255,136,0.2)]">
                      <motion.div
                         className="h-full bg-gradient-to-r from-[var(--gaia-cyan)] to-[var(--gaia-green-500)]"
                        style={{ width: `${scanProgress}%`, boxShadow: '0 0 15px rgba(0,255,136,0.8)' }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    {/* Stage indicators */}
                    <div className="grid grid-cols-4 gap-3">
                      {SCAN_STAGES.map((stage, i) => {
                        const stageIndex = SCAN_STAGES.findIndex(s => s.key === scanStage);
                        const isComplete = i < stageIndex;
                        const isCurrent = stage.key === scanStage;
                        const Icon = stage.icon;
                        return (
                          <div
                            key={stage.key}
                            className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all ${
                              isCurrent ? 'bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.3)] shadow-[0_0_10px_rgba(0,255,136,0.1)]' : 'border border-transparent'
                            }`}
                          >
                            <Icon className={`w-5 h-5 ${isComplete ? 'text-[var(--gaia-green-500)]' : isCurrent ? 'text-[var(--gaia-cyan)] animate-pulse' : 'text-[var(--gaia-text-dim)]'}`} />
                            <span className={`text-[10px] font-mono text-center uppercase ${isCurrent ? 'text-[var(--gaia-cyan)]' : isComplete ? 'text-[var(--gaia-green-500)]' : 'text-[var(--gaia-text-muted)]'}`}>
                              {stage.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right — Results */}
        <AnimatePresence>
          {result ? (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Disease Detection Card */}
              <motion.div
                className="glass-panel p-8 relative overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <div
                  className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
                  style={{ background: SEVERITY_CONFIG[result.disease.severity].color, filter: 'blur(60px)' }}
                />
                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <CheckCircle className="w-6 h-6 text-[var(--gaia-green-500)] drop-shadow-[0_0_10px_rgba(0,255,136,0.5)]" />
                  <h3 className="text-sm font-bold text-[var(--gaia-text-primary)] tracking-widest uppercase">Diagnosis Output</h3>
                </div>

                <div className="flex items-start justify-between gap-4 mb-6 relative z-10">
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-[var(--gaia-text-primary)] tracking-tight mb-1">{result.disease.name}</h2>
                    <p className="text-sm text-[var(--gaia-cyan)] font-mono">{result.disease.scientificName}</p>
                  </div>
                  <Badge
                    className="text-xs font-bold px-4 py-1.5 uppercase tracking-wider"
                    style={{
                      background: SEVERITY_CONFIG[result.disease.severity].bg,
                      color: SEVERITY_CONFIG[result.disease.severity].color,
                      border: `1px solid ${SEVERITY_CONFIG[result.disease.severity].color}`,
                      boxShadow: `0 0 15px ${SEVERITY_CONFIG[result.disease.severity].color}40`,
                    }}
                  >
                    {SEVERITY_CONFIG[result.disease.severity].label} Risk
                  </Badge>
                </div>

                <p className="text-sm text-[var(--gaia-text-secondary)] mb-6 leading-relaxed relative z-10 font-medium">
                  {result.disease.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 relative z-10">
                  <div className="p-4 rounded-xl bg-[var(--gaia-green-50)] border border-[rgba(0,255,136,0.1)]">
                    <p className="text-[10px] text-[var(--gaia-text-muted)] uppercase tracking-[0.2em] mb-2 font-bold">Confidence</p>
                    <p className="text-2xl font-bold text-[var(--gaia-green-500)] font-mono">{result.disease.confidence}%</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[var(--gaia-green-50)] border border-[rgba(0,255,136,0.1)]">
                    <p className="text-[10px] text-[var(--gaia-text-muted)] uppercase tracking-[0.2em] mb-2 font-bold">Affected</p>
                    <p className="text-2xl font-bold text-[var(--gaia-amber)] font-mono">{result.disease.affectedArea}%</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[var(--gaia-green-50)] border border-[rgba(0,255,136,0.1)]">
                    <p className="text-[10px] text-[var(--gaia-text-muted)] uppercase tracking-[0.2em] mb-2 font-bold">Risk Score</p>
                    <p className="text-2xl font-bold text-[var(--gaia-red)] font-mono drop-shadow-[0_0_10px_rgba(255,42,77,0.4)]">{result.rootCause.riskScore}</p>
                  </div>
                </div>
              </motion.div>

              {/* Root Cause Preview */}
              <motion.div
                className="glass-panel p-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <Brain className="w-5 h-5 text-[var(--gaia-cyan)] drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]" />
                  <h3 className="text-sm font-bold text-[var(--gaia-text-primary)] tracking-widest uppercase">Causal Matrix</h3>
                </div>
                <p className="text-sm text-[var(--gaia-text-primary)] mb-6 font-medium leading-relaxed">{result.rootCause.primaryCause}</p>
                <div className="space-y-4 mb-6">
                  {result.rootCause.factors.slice(0, 3).map((factor, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-[var(--gaia-text-secondary)] uppercase tracking-wider">{factor.name}</span>
                          <span className="text-xs font-mono text-[var(--gaia-text-muted)]">{factor.impact}% impact</span>
                        </div>
                        <div className="h-2 rounded-full bg-black/5 overflow-hidden border border-[var(--gaia-border-glass)]">
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              background: factor.status === 'critical' ? 'var(--gaia-red)' : factor.status === 'suboptimal' ? 'var(--gaia-amber)' : 'var(--gaia-green-500)',
                              width: `${factor.impact}%`,
                              boxShadow: `0 0 10px ${factor.status === 'critical' ? 'var(--gaia-red)' : factor.status === 'suboptimal' ? 'var(--gaia-amber)' : 'var(--gaia-green-500)'}`
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: `${factor.impact}%` }}
                            transition={{ delay: 0.3 + i * 0.1, duration: 1 }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/dashboard/analysis">
                  <button className="w-full py-3.5 rounded-xl border border-[rgba(0,255,136,0.3)] text-[var(--gaia-green-500)] text-sm font-bold tracking-widest uppercase hover:bg-[rgba(0,255,136,0.1)] hover:shadow-[0_0_20px_rgba(0,255,136,0.2)] transition-all flex items-center justify-center gap-2">
                    Access Full Telemetry
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
              </motion.div>

              {/* Scan Again */}
              <motion.button
                onClick={resetScan}
                className="w-full py-4 rounded-xl bg-black/5 border border-[var(--gaia-border-glass)] text-[var(--gaia-text-primary)] text-sm font-bold tracking-widest uppercase hover:bg-[rgba(0,0,0,0.08)] transition-all flex items-center justify-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <RefreshCw className="w-4 h-4" />
                Initialize New Scan
              </motion.button>
            </motion.div>
          ) : (
            // ─── Empty State ───
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel p-10 flex flex-col items-center justify-center text-center"
              style={{ minHeight: '450px' }}
            >
              <div className="w-20 h-20 rounded-2xl bg-[var(--gaia-green-50)] border border-[rgba(0,255,136,0.1)] flex items-center justify-center mb-6">
                <Brain className="w-10 h-10 text-[var(--gaia-text-dim)]" />
              </div>
              <h3 className="text-lg font-bold text-[var(--gaia-text-primary)] tracking-widest uppercase mb-3">
                Awaiting Data Input
              </h3>
              <p className="text-sm text-[var(--gaia-text-muted)] max-w-sm mb-10 leading-relaxed">
                Provide visual biomatter for immediate neural processing, risk assessment, and mitigation protocols.
              </p>
              <div className="grid grid-cols-3 gap-6 w-full max-w-sm">
                {[
                  { icon: ScanLine, label: 'Detection' },
                  { icon: Brain, label: 'Causality' },
                  { icon: Shield, label: 'Protocols' },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-black/5 border border-[var(--gaia-border-glass)]">
                    <item.icon className="w-6 h-6 text-[var(--gaia-text-dim)]" />
                    <span className="text-[10px] text-[var(--gaia-text-muted)] font-bold uppercase tracking-wider">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
