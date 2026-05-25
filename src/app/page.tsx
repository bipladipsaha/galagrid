'use client';

import { motion } from 'framer-motion';
import { Leaf, ScanLine, Brain, FlaskConical, Activity, MessageSquare, ArrowRight, Shield, Zap, Globe } from 'lucide-react';
import { ParticleField } from '@/components/effects/ParticleField';
import Link from 'next/link';

const FEATURES = [
  { icon: ScanLine, title: 'AI Disease Detection', desc: 'Upload a leaf image and get instant AI-powered disease diagnosis with 95%+ accuracy', color: '#00ff88' },
  { icon: Brain, title: 'Root Cause Analysis', desc: 'Understand WHY diseases occur — not just what they are. AI analyzes environmental correlations', color: '#00e5ff' },
  { icon: FlaskConical, title: 'Chemical Intelligence', desc: 'Smart tracking of pesticides and fertilizers with toxicity analysis and safety warnings', color: '#b388ff' },
  { icon: Activity, title: 'IoT Monitoring', desc: 'Real-time sensor data for soil moisture, temperature, humidity, and nutrient levels', color: '#ffab00' },
  { icon: MessageSquare, title: 'AI Farm Assistant', desc: 'Chat with AI that understands your farm data and provides context-aware recommendations', color: '#448aff' },
  { icon: Shield, title: 'Sustainability Analytics', desc: 'Track and improve your farm sustainability score with actionable eco-friendly insights', color: '#00ff88' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#030806] text-[#e8f5e9] overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center">
        <ParticleField count={60} />
        <div className="absolute inset-0 bg-gradient-mesh" />

        {/* Radial glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,255,136,0.08) 0%, transparent 70%)' }}
        />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(0,255,136,0.06)] border border-[rgba(0,255,136,0.15)] mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
            <span className="text-xs text-[#81c784] font-medium">AI-Powered Agricultural Intelligence</span>
          </motion.div>

          {/* Logo */}
          <motion.div
            className="flex items-center justify-center gap-4 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00ff88] to-[#00cc6a] flex items-center justify-center"
              style={{ boxShadow: '0 0 40px rgba(0,255,136,0.3)' }}>
              <Leaf className="w-8 h-8 text-[#030806]" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-4 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Gaia<span className="text-[#00ff88] text-glow-strong">Grid</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-[#81c784] mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            AGRIMIND AI
          </motion.p>

          <motion.p
            className="text-base md:text-lg text-[#4a7c5c] mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            The AI-powered agricultural operating system that doesn&apos;t just detect crop diseases — it explains <em className="text-[#00ff88]">why</em> they happen and how to prevent them.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link href="/dashboard">
              <motion.button
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#00ff88] to-[#00cc6a] text-[#030806] font-bold text-base flex items-center gap-2"
                whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(0,255,136,0.3)' }}
                whileTap={{ scale: 0.97 }}
              >
                Launch Dashboard
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <Link href="/login">
              <motion.button
                className="px-8 py-3.5 rounded-xl border border-[rgba(0,255,136,0.2)] text-[#00ff88] font-semibold text-base hover:bg-[rgba(0,255,136,0.05)] transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Sign In
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {[
              { value: '95%+', label: 'Detection Accuracy' },
              { value: '50+', label: 'Crop Diseases' },
              { value: '<3s', label: 'Analysis Time' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-bold text-[#00ff88]">{stat.value}</p>
                <p className="text-xs text-[#4a7c5c] mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-[rgba(0,255,136,0.2)] flex items-start justify-center p-1.5">
            <motion.div
              className="w-1.5 h-3 rounded-full bg-[#00ff88]"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(0,255,136,0.06)] border border-[rgba(0,255,136,0.1)] mb-4">
              <Zap className="w-3 h-3 text-[#00ff88]" />
              <span className="text-xs text-[#81c784]">Platform Features</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Agriculture meets <span className="text-[#00ff88]">Artificial Intelligence</span>
            </h2>
            <p className="text-[#4a7c5c] max-w-xl mx-auto">
              A complete operating system for modern farming — from disease detection to sustainability optimization
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={i}
                className="glass-card glass-card-hover p-6 relative overflow-hidden group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-[0.04] group-hover:opacity-[0.08] transition-opacity -translate-y-8 translate-x-8"
                  style={{ background: feature.color }}
                />
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${feature.color}15` }}
                >
                  <feature.icon className="w-5 h-5" style={{ color: feature.color }} />
                </div>
                <h3 className="text-base font-semibold text-[#e8f5e9] mb-2">{feature.title}</h3>
                <p className="text-sm text-[#4a7c5c] leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4">
        <motion.div
          className="max-w-4xl mx-auto glass-card p-10 text-center relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(0,255,136,0.05)] to-[rgba(0,229,255,0.05)]" />
          <div className="relative z-10">
            <Globe className="w-10 h-10 text-[#00ff88] mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">Ready to transform your farm?</h2>
            <p className="text-[#4a7c5c] mb-6 max-w-lg mx-auto">
              Join thousands of farmers using AI to increase yields, reduce waste, and build sustainable agriculture.
            </p>
            <Link href="/dashboard">
              <motion.button
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#00ff88] to-[#00cc6a] text-[#030806] font-bold"
                whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(0,255,136,0.3)' }}
              >
                Get Started Free
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[rgba(0,255,136,0.06)] py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#00ff88] to-[#00cc6a] flex items-center justify-center">
              <Leaf className="w-3.5 h-3.5 text-[#030806]" />
            </div>
            <span className="text-sm font-semibold">GaiaGrid</span>
            <span className="text-xs text-[#4a7c5c]">AGRIMIND AI</span>
          </div>
          <p className="text-xs text-[#4a7c5c]">© 2024 GaiaGrid. AI-powered agriculture for a sustainable future.</p>
        </div>
      </footer>
    </div>
  );
}
