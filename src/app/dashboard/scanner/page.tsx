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
  low: { color: '#00ff88', bg: 'rgba(0,255,136,0.1)', label: 'Low' },
  moderate: { color: '#ffab00', bg: 'rgba(255,171,0,0.1)', label: 'Moderate' },
  high: { color: '#ff3d57', bg: 'rgba(255,61,87,0.1)', label: 'High' },
  critical: { color: '#ff1744', bg: 'rgba(255,23,68,0.15)', label: 'Critical' },
};

// ─── Scan Stages ───
const SCAN_STAGES = [
  { key: 'uploading', label: 'Uploading Image', icon: Upload, duration: 800 },
  { key: 'analyzing', label: 'AI Analysis', icon: Brain, duration: 1500 },
  { key: 'detecting', label: 'Disease Detection', icon: ScanLine, duration: 1200 },
  { key: 'reasoning', label: 'Root Cause Analysis', icon: Zap, duration: 1000 },
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

    // Simulate multi-stage scanning
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

    // Generate result
    const scanResult = simulateScanResult(imagePreview);
    setResult(scanResult);
  }, [imagePreview, startScan, setScanStage, setScanProgress, setResult]);

  return (
    <div className="p-4 lg:p-6 min-h-full bg-gradient-mesh">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold text-[#e8f5e9]">
          AI Leaf <span className="text-[#00ff88] text-glow">Scanner</span>
        </h1>
        <p className="text-sm text-[#4a7c5c] mt-1">
          Upload a leaf image for AI-powered disease detection & root cause analysis
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left — Upload / Image / Scan */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {!imagePreview ? (
              // ─── Upload Zone ───
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden ${
                  isDragging
                    ? 'border-[#00ff88] bg-[rgba(0,255,136,0.06)]'
                    : 'border-[rgba(0,255,136,0.15)] hover:border-[rgba(0,255,136,0.3)] bg-[rgba(0,255,136,0.02)]'
                }`}
                style={{ minHeight: '400px' }}
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

                {/* Grid overlay */}
                <div className="absolute inset-0 grid-pattern opacity-20" />

                <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                  <motion.div
                    className="w-20 h-20 rounded-2xl bg-[rgba(0,255,136,0.08)] flex items-center justify-center mb-6"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <ScanLine className="w-10 h-10 text-[#00ff88]" style={{ filter: 'drop-shadow(0 0 10px rgba(0,255,136,0.4))' }} />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-[#e8f5e9] mb-2">
                    Drop leaf image here
                  </h3>
                  <p className="text-sm text-[#4a7c5c] text-center mb-4">
                    or click to browse • Supports JPG, PNG, WebP
                  </p>
                  <div className="px-4 py-2 rounded-full bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.2)] text-xs text-[#00ff88]">
                    AI-powered analysis in seconds
                  </div>
                </div>

                {/* Corner decorations */}
                {['top-4 left-4', 'top-4 right-4', 'bottom-4 left-4', 'bottom-4 right-4'].map((pos, i) => (
                  <div key={i} className={`absolute ${pos} w-6 h-6 border-[#00ff88] opacity-30 ${
                    i === 0 ? 'border-t-2 border-l-2 rounded-tl-lg' :
                    i === 1 ? 'border-t-2 border-r-2 rounded-tr-lg' :
                    i === 2 ? 'border-b-2 border-l-2 rounded-bl-lg' :
                    'border-b-2 border-r-2 rounded-br-lg'
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
                className="relative rounded-2xl overflow-hidden border border-[rgba(0,255,136,0.15)]"
                style={{ minHeight: '400px' }}
              >
                {/* Image */}
                <img
                  src={imagePreview}
                  alt="Leaf scan"
                  className="w-full h-full object-cover"
                  style={{ minHeight: '400px', maxHeight: '500px' }}
                />

                {/* Scan overlay during scanning */}
                {isScanning && (
                  <>
                    {/* Grid overlay */}
                    <div className="absolute inset-0 grid-pattern opacity-40" />
                    {/* Moving scan line */}
                    <motion.div
                      className="absolute left-0 right-0 h-1"
                      style={{
                        background: 'linear-gradient(90deg, transparent, #00ff88, transparent)',
                        boxShadow: '0 0 20px rgba(0,255,136,0.5), 0 0 60px rgba(0,255,136,0.2)',
                      }}
                      animate={{ top: ['0%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    />
                    {/* Corner brackets */}
                    {['top-4 left-4', 'top-4 right-4', 'bottom-4 left-4', 'bottom-4 right-4'].map((pos, i) => (
                      <motion.div
                        key={i}
                        className={`absolute ${pos} w-8 h-8`}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <div className={`w-full h-full border-[#00ff88] ${
                          i === 0 ? 'border-t-2 border-l-2 rounded-tl-lg' :
                          i === 1 ? 'border-t-2 border-r-2 rounded-tr-lg' :
                          i === 2 ? 'border-b-2 border-l-2 rounded-bl-lg' :
                          'border-b-2 border-r-2 rounded-br-lg'
                        }`} style={{ boxShadow: '0 0 10px rgba(0,255,136,0.3)' }} />
                      </motion.div>
                    ))}
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-[rgba(0,0,0,0.4)]" />
                  </>
                )}

                {/* Top controls */}
                {!isScanning && !result && (
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); resetScan(); }}
                      className="p-2 rounded-lg bg-[rgba(0,0,0,0.6)] backdrop-blur-sm text-[#e8f5e9] hover:bg-[rgba(0,0,0,0.8)] transition-colors"
                    >
                      <X className="w-4 h-4" />
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
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#00ff88] to-[#00cc6a] text-[#030806] font-bold text-base flex items-center justify-center gap-3"
                    whileHover={{ scale: 1.01, boxShadow: '0 0 40px rgba(0,255,136,0.3)' }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <ScanLine className="w-5 h-5" />
                    Start AI Analysis
                  </motion.button>
                ) : (
                  <div className="glass-card p-4 space-y-3">
                    {/* Progress bar */}
                    <div className="h-2 rounded-full bg-[rgba(0,255,136,0.1)] overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-[#00ff88] to-[#00e5ff]"
                        style={{ width: `${scanProgress}%`, boxShadow: '0 0 10px rgba(0,255,136,0.5)' }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    {/* Stage indicators */}
                    <div className="grid grid-cols-4 gap-2">
                      {SCAN_STAGES.map((stage, i) => {
                        const stageIndex = SCAN_STAGES.findIndex(s => s.key === scanStage);
                        const isComplete = i < stageIndex;
                        const isCurrent = stage.key === scanStage;
                        const Icon = stage.icon;
                        return (
                          <div
                            key={stage.key}
                            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                              isCurrent ? 'bg-[rgba(0,255,136,0.08)]' : ''
                            }`}
                          >
                            <Icon className={`w-4 h-4 ${isComplete ? 'text-[#00ff88]' : isCurrent ? 'text-[#00ff88] animate-pulse' : 'text-[#2d5a3f]'}`} />
                            <span className={`text-[10px] text-center ${isCurrent ? 'text-[#00ff88]' : 'text-[#4a7c5c]'}`}>
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
              className="space-y-4"
            >
              {/* Disease Detection Card */}
              <motion.div
                className="glass-card p-6 relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10"
                  style={{ background: SEVERITY_CONFIG[result.disease.severity].color, filter: 'blur(40px)' }}
                />
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-[#00ff88]" />
                  <h3 className="text-sm font-medium text-[#81c784]">Diagnosis Complete</h3>
                </div>

                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-[#e8f5e9]">{result.disease.name}</h2>
                    <p className="text-xs text-[#4a7c5c] italic">{result.disease.scientificName}</p>
                  </div>
                  <Badge
                    className="text-xs font-semibold px-3 py-1"
                    style={{
                      background: SEVERITY_CONFIG[result.disease.severity].bg,
                      color: SEVERITY_CONFIG[result.disease.severity].color,
                      border: `1px solid ${SEVERITY_CONFIG[result.disease.severity].color}40`,
                    }}
                  >
                    {SEVERITY_CONFIG[result.disease.severity].label} Severity
                  </Badge>
                </div>

                <p className="text-sm text-[#81c784] mb-4 leading-relaxed">
                  {result.disease.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-[rgba(0,255,136,0.04)] border border-[rgba(0,255,136,0.08)]">
                    <p className="text-[10px] text-[#4a7c5c] uppercase tracking-wider mb-1">Confidence</p>
                    <p className="text-lg font-bold text-[#00ff88]">{result.disease.confidence}%</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[rgba(0,255,136,0.04)] border border-[rgba(0,255,136,0.08)]">
                    <p className="text-[10px] text-[#4a7c5c] uppercase tracking-wider mb-1">Affected</p>
                    <p className="text-lg font-bold text-[#ffab00]">{result.disease.affectedArea}%</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[rgba(0,255,136,0.04)] border border-[rgba(0,255,136,0.08)]">
                    <p className="text-[10px] text-[#4a7c5c] uppercase tracking-wider mb-1">Risk Score</p>
                    <p className="text-lg font-bold text-[#ff3d57]">{result.rootCause.riskScore}</p>
                  </div>
                </div>
              </motion.div>

              {/* Root Cause Preview */}
              <motion.div
                className="glass-card p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-4 h-4 text-[#00e5ff]" />
                  <h3 className="text-sm font-medium text-[#81c784]">AI Root Cause Analysis</h3>
                </div>
                <p className="text-sm text-[#e8f5e9] mb-3">{result.rootCause.primaryCause}</p>
                <div className="space-y-2 mb-4">
                  {result.rootCause.factors.slice(0, 3).map((factor, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-[#81c784]">{factor.name}</span>
                          <span className="text-xs text-[#4a7c5c]">{factor.impact}% impact</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-[rgba(0,255,136,0.08)] overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              background: factor.status === 'critical' ? '#ff3d57' : factor.status === 'suboptimal' ? '#ffab00' : '#00ff88',
                              width: `${factor.impact}%`,
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: `${factor.impact}%` }}
                            transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/dashboard/analysis">
                  <button className="w-full py-2.5 rounded-lg border border-[rgba(0,255,136,0.2)] text-[#00ff88] text-sm font-medium hover:bg-[rgba(0,255,136,0.05)] transition-colors flex items-center justify-center gap-2">
                    View Full Analysis
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
              </motion.div>

              {/* Treatments */}
              <motion.div
                className="glass-card p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <FlaskConical className="w-4 h-4 text-[#b388ff]" />
                  <h3 className="text-sm font-medium text-[#81c784]">Recommended Treatments</h3>
                </div>
                <div className="space-y-3">
                  {result.treatments.slice(0, 3).map((treatment, i) => (
                    <motion.div
                      key={treatment.id}
                      className="p-3 rounded-lg bg-[rgba(0,255,136,0.03)] border border-[rgba(0,255,136,0.06)] hover:border-[rgba(0,255,136,0.15)] transition-colors"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {treatment.isOrganic && <Sprout className="w-3 h-3 text-[#00ff88]" />}
                          <span className="text-sm font-medium text-[#e8f5e9]">{treatment.name}</span>
                        </div>
                        <span className="text-[10px] text-[#4a7c5c] uppercase">{treatment.type}</span>
                      </div>
                      <p className="text-xs text-[#4a7c5c] mb-2 line-clamp-2">{treatment.description}</p>
                      <div className="flex items-center gap-3 text-[10px]">
                        <span className="text-[#00ff88]">✓ {treatment.effectiveness}% effective</span>
                        <span className="text-[#00e5ff]">♻ {treatment.sustainabilityScore}/100</span>
                        {treatment.dosage && (
                          <span className="text-[#4a7c5c]">💊 {treatment.dosage}</span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Scan Again */}
              <motion.button
                onClick={resetScan}
                className="w-full py-3 rounded-xl border border-[rgba(0,255,136,0.15)] text-[#81c784] text-sm font-medium hover:bg-[rgba(0,255,136,0.05)] transition-colors flex items-center justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <RefreshCw className="w-4 h-4" />
                Scan Another Leaf
              </motion.button>
            </motion.div>
          ) : (
            // ─── Empty State ───
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-8 flex flex-col items-center justify-center text-center"
              style={{ minHeight: '400px' }}
            >
              <div className="w-16 h-16 rounded-2xl bg-[rgba(0,255,136,0.06)] flex items-center justify-center mb-4">
                <Leaf className="w-8 h-8 text-[#2d5a3f]" />
              </div>
              <h3 className="text-base font-semibold text-[#81c784] mb-2">
                AI Diagnosis Results
              </h3>
              <p className="text-sm text-[#4a7c5c] max-w-xs mb-6">
                Upload a leaf image and start the AI scan to see disease detection, root cause analysis, and treatment recommendations
              </p>
              <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
                {[
                  { icon: ScanLine, label: 'Detection' },
                  { icon: Brain, label: 'Root Cause' },
                  { icon: Shield, label: 'Treatment' },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 p-3 rounded-lg bg-[rgba(0,255,136,0.03)]">
                    <item.icon className="w-5 h-5 text-[#2d5a3f]" />
                    <span className="text-[10px] text-[#4a7c5c]">{item.label}</span>
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
