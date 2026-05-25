'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useRef, useState } from 'react';
import {
  Upload,
  Scan,
  CheckCircle,
  FlaskConical,
  X,
  RefreshCw,
  Search,
  Shield,
  Leaf
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

// Mock Chemical Result for Barcode Scan
const MOCK_BARCODE_RESULT = {
  id: 'chem-7',
  name: 'Azoxystrobin 25% SC',
  type: 'Fungicide',
  activeIngredient: 'Azoxystrobin',
  toxicityLevel: 'moderate',
  ecoScore: 65,
  usage: 'Effective against a wide range of fungal diseases like early and late blight.',
  safety: [
    'Wear appropriate PPE when mixing.',
    'Toxic to aquatic life; avoid runoff.',
    'Do not apply if rain is expected within 24 hours.'
  ]
};

export default function BarcodeScannerPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<typeof MOCK_BARCODE_RESULT | null>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleScan = async () => {
    if (!imagePreview) return;
    setIsScanning(true);
    
    // Simulate scan delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    setIsScanning(false);
    setResult(MOCK_BARCODE_RESULT);
  };

  const resetScan = () => {
    setImagePreview(null);
    setResult(null);
    setIsScanning(false);
  };

  return (
    <div className="p-4 lg:p-6 min-h-full bg-gradient-mesh">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--gaia-text-primary)]">
            Chemical Barcode <span className="text-[#b388ff] text-glow">Scanner</span>
          </h1>
          <p className="text-sm text-[var(--gaia-text-muted)] mt-1">
            Scan a chemical bottle's barcode or label for instant safety and usage insights
          </p>
        </div>
        <Link href="/dashboard/chemicals">
          <button className="px-4 py-2 rounded-lg bg-[rgba(179,136,255,0.1)] text-[#b388ff] text-sm font-medium hover:bg-[rgba(179,136,255,0.2)] transition-colors border border-[rgba(179,136,255,0.2)]">
            Back to Tracker
          </button>
        </Link>
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
                    ? 'border-[#b388ff] bg-[rgba(179,136,255,0.06)]'
                    : 'border-[rgba(179,136,255,0.15)] hover:border-[rgba(179,136,255,0.3)] bg-[rgba(179,136,255,0.02)]'
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
                  capture="environment"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                />
                <div className="absolute inset-0 grid-pattern opacity-20" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                  <motion.div
                    className="w-20 h-20 rounded-2xl bg-[rgba(179,136,255,0.08)] flex items-center justify-center mb-6"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Scan className="w-10 h-10 text-[#b388ff]" style={{ filter: 'drop-shadow(0 0 10px rgba(179,136,255,0.4))' }} />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-[var(--gaia-text-primary)] mb-2">
                    Take a photo of the Barcode
                  </h3>
                  <p className="text-sm text-[var(--gaia-text-muted)] text-center mb-4">
                    or click to browse • Supports JPG, PNG, WebP
                  </p>
                </div>
              </motion.div>
            ) : (
              // ─── Image Preview ───
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative rounded-2xl overflow-hidden border border-[rgba(179,136,255,0.15)]"
                style={{ minHeight: '400px' }}
              >
                <img
                  src={imagePreview}
                  alt="Barcode scan"
                  className="w-full h-full object-cover"
                  style={{ minHeight: '400px', maxHeight: '500px' }}
                />

                {/* Scan Overlay */}
                {isScanning && (
                  <>
                    <div className="absolute inset-0 grid-pattern opacity-40" />
                    <motion.div
                      className="absolute left-0 right-0 h-1"
                      style={{
                        background: 'linear-gradient(90deg, transparent, #b388ff, transparent)',
                        boxShadow: '0 0 20px rgba(179,136,255,0.5), 0 0 60px rgba(179,136,255,0.2)',
                      }}
                      animate={{ top: ['0%', '100%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    />
                    <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                       <span className="text-[#b388ff] font-medium tracking-widest animate-pulse">ANALYZING BARCODE...</span>
                    </div>
                  </>
                )}

                {/* Controls */}
                {!isScanning && !result && (
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); resetScan(); }}
                      className="p-2 rounded-lg bg-[rgba(0,0,0,0.6)] backdrop-blur-sm text-[var(--gaia-text-primary)] hover:bg-white/90 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Button */}
          <AnimatePresence>
            {imagePreview && !result && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
                {!isScanning && (
                  <motion.button
                    onClick={handleScan}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#9c27b0] to-[#b388ff] text-[#ffffff] font-bold text-base flex items-center justify-center gap-3"
                    whileHover={{ scale: 1.01, boxShadow: '0 0 40px rgba(179,136,255,0.3)' }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Search className="w-5 h-5" />
                    Identify Chemical
                  </motion.button>
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
              {/* Chemical Identification Card */}
              <motion.div
                className="glass-card p-6 relative overflow-hidden"
              >
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10"
                  style={{ background: '#ffab00', filter: 'blur(40px)' }}
                />
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-[#b388ff]" />
                  <h3 className="text-sm font-medium text-[#b388ff]">Barcode Recognized</h3>
                </div>

                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-[var(--gaia-text-primary)]">{result.name}</h2>
                    <p className="text-xs text-[var(--gaia-text-muted)] mt-1">Active: {result.activeIngredient}</p>
                  </div>
                  <Badge
                    className="text-xs font-semibold px-3 py-1 bg-[rgba(255,171,0,0.1)] text-[#ffab00] border border-[rgba(255,171,0,0.4)]"
                  >
                    Moderate Toxicity
                  </Badge>
                </div>

                <div className="p-4 rounded-lg bg-[var(--gaia-green-50)] border border-[rgba(0,255,136,0.08)] mb-4">
                  <p className="text-[10px] text-[var(--gaia-text-muted)] uppercase tracking-wider mb-2 flex items-center gap-2">
                    <FlaskConical className="w-3 h-3 text-[#00ff88]" />
                    Usage Profile
                  </p>
                  <p className="text-sm text-[var(--gaia-text-primary)] leading-relaxed">
                    {result.usage}
                  </p>
                </div>

                {/* Eco Score */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-[rgba(0,255,136,0.04)] border border-[rgba(0,255,136,0.08)]">
                    <p className="text-[10px] text-[var(--gaia-text-muted)] uppercase tracking-wider mb-1">Eco Score</p>
                    <p className="text-lg font-bold text-[#00ff88]">{result.ecoScore}/100</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[rgba(0,255,136,0.04)] border border-[rgba(0,255,136,0.08)]">
                    <p className="text-[10px] text-[var(--gaia-text-muted)] uppercase tracking-wider mb-1">Type</p>
                    <p className="text-lg font-bold text-[var(--gaia-text-primary)] capitalize">{result.type}</p>
                  </div>
                </div>
              </motion.div>

              {/* Safety Instructions */}
              <motion.div
                className="glass-card p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-4 h-4 text-[#ffab00]" />
                  <h3 className="text-sm font-medium text-[var(--gaia-text-secondary)]">Critical Safety Guidelines</h3>
                </div>
                <div className="space-y-3">
                  {result.safety.map((rule, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-[rgba(255,171,0,0.03)] border border-[rgba(255,171,0,0.08)]">
                       <Shield className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#ffab00]" />
                       <p className="text-sm text-[var(--gaia-text-primary)]">{rule}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Scan Again */}
              <motion.button
                onClick={resetScan}
                className="w-full py-3 rounded-xl border border-[rgba(179,136,255,0.15)] text-[#b388ff] text-sm font-medium hover:bg-[rgba(179,136,255,0.05)] transition-colors flex items-center justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <RefreshCw className="w-4 h-4" />
                Scan Another Label
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
              <div className="w-16 h-16 rounded-2xl bg-[rgba(179,136,255,0.06)] flex items-center justify-center mb-4">
                <Scan className="w-8 h-8 text-[#6c489c]" />
              </div>
              <h3 className="text-base font-semibold text-[#b388ff] mb-2">
                Barcode Scan Results
              </h3>
              <p className="text-sm text-[var(--gaia-text-muted)] max-w-xs mb-6">
                Take a photo of a chemical bottle's barcode to instantly pull up its safety data sheet and eco-toxicity profile.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
