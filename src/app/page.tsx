'use client';

import { motion } from 'framer-motion';
import { Leaf, ScanLine, Brain, FlaskConical, Activity, ArrowRight, Shield, Target } from 'lucide-react';
import { ParticleField } from '@/components/effects/ParticleField';
import Link from 'next/link';

const FEATURES = [
  { icon: ScanLine, title: 'AI Disease Detection', desc: 'Holographic scanning detects pathogens with 99.9% accuracy', color: 'var(--gaia-green-500)' },
  { icon: Brain, title: 'Root Cause Engine', desc: 'Deep learning core analyzes 50+ environmental variables in realtime', color: 'var(--gaia-cyan)' },
  { icon: Target, title: 'Yield Prediction', desc: 'Predictive models forecast harvest outcomes with surgical precision', color: 'var(--gaia-green-400)' },
  { icon: FlaskConical, title: 'Chemical Tracking', desc: 'Smart toxicity monitoring and automated sustainability scoring', color: 'var(--gaia-amber)' },
  { icon: Activity, title: 'Live Sensor Mesh', desc: 'Realtime data streams from distributed IoT soil and weather nodes', color: 'var(--gaia-green-500)' },
  { icon: Shield, title: 'Eco-Defense System', desc: 'Actionable defense protocols to protect crops and the environment', color: 'var(--gaia-blue)' },
];

const STATS = [
  { value: '99.9%', label: 'Diagnostic Accuracy' },
  { value: '< 200ms', label: 'Inference Time' },
  { value: '50M+', label: 'Datapoints Analyzed' },
  { value: '12', label: 'Sensor Types Supported' }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--gaia-bg-primary)] overflow-hidden">
      {/* HUD Lines */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute left-[10%] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[var(--gaia-border-bright)] to-transparent" />
        <div className="absolute right-[10%] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[var(--gaia-border-bright)] to-transparent" />
      </div>

      {/* Cinematic Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-10">
        {/* Light theme particle field alternative could be added here, currently ParticleField is used */}
        
        {/* Deep background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--gaia-green-100)] blur-[150px] rounded-full pointer-events-none" />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
          
          {/* Futuristic Badge */}
          <motion.div
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/50 mb-10 border border-[var(--gaia-green-200)] shadow-sm"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center justify-center w-4 h-4 relative">
              <div className="absolute inset-0 rounded-full border border-[var(--gaia-green-500)] animate-ping opacity-50" />
              <div className="w-2 h-2 rounded-full bg-[var(--gaia-green-500)] shadow-[0_0_10px_var(--gaia-green-300)]" />
            </div>
            <span className="text-xs uppercase tracking-[0.2em] font-mono text-[var(--gaia-green-700)] font-bold">Precision Naturalism</span>
          </motion.div>

          {/* Logo Identity */}
          <motion.div
            className="flex items-center justify-center gap-4 mb-8"
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="relative w-16 h-16 flex items-center justify-center group">
              <div className="absolute inset-0 rounded-2xl bg-[var(--gaia-green-200)] opacity-40 blur-xl group-hover:opacity-60 transition-opacity duration-500" />
              <div className="absolute inset-0 rounded-2xl bg-[var(--gaia-green-500)] shadow-md" />
              <Leaf className="w-8 h-8 text-[var(--gaia-text-primary)] relative z-10" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[var(--gaia-green-800)]">
              AGRI<span className="text-[var(--gaia-green-500)]">MIND</span>
            </h1>
          </motion.div>

          {/* Main Headline */}
          <motion.h2
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-[1.1] max-w-4xl text-[var(--gaia-text-primary)]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            AI That Helps Farmers Understand <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--gaia-green-500)] to-[var(--gaia-green-400)]">WHY</span> Crops Fail
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-[var(--gaia-text-secondary)] mb-12 max-w-3xl mx-auto leading-relaxed font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            AGRIMIND combines AI disease detection, root cause analysis, and sustainability intelligence into one futuristic agriculture platform.
          </motion.p>

          {/* Cinematic CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Link href="/dashboard">
              <button className="btn-cyber px-8 py-4 rounded-xl font-bold tracking-wide flex items-center gap-3">
                <span className="relative z-10 text-[var(--gaia-green-900)]">Launch Dashboard</span>
                <ArrowRight className="w-5 h-5 relative z-10 text-[var(--gaia-green-900)]" />
              </button>
            </Link>
            <Link href="/dashboard/scanner">
              <button className="px-8 py-4 rounded-xl border-2 border-[var(--gaia-green-200)] text-[var(--gaia-green-700)] hover:bg-[var(--gaia-green-50)] transition-all flex items-center gap-3 group font-bold">
                <ScanLine className="w-5 h-5 text-[var(--gaia-green-500)] group-hover:animate-pulse" />
                <span>Try AI Scanner</span>
              </button>
            </Link>
          </motion.div>

          {/* Animated Stats Bar */}
          <motion.div 
            className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 w-full max-w-5xl mx-auto border-t border-[var(--gaia-border-glass)] pt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            {STATS.map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="text-3xl md:text-4xl font-mono font-bold text-[var(--gaia-green-700)] mb-2 group-hover:text-[var(--gaia-green-500)] transition-colors">
                  {stat.value}
                </div>
                <div className="text-xs tracking-[0.15em] uppercase font-bold text-[var(--gaia-text-muted)]">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* Intelligence Grid */}
      <section className="py-32 px-4 relative z-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-20" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[var(--gaia-text-primary)]">
              Agricultural <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--gaia-green-500)] to-[var(--gaia-green-400)]">Superintelligence</span>
            </h2>
            <p className="text-[var(--gaia-text-secondary)] max-w-2xl mx-auto text-lg font-medium">
              Advanced neural networks monitoring every parameter of your ecosystem.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={i}
                className="glass-panel glass-panel-hover p-8 relative group bg-[var(--gaia-bg-primary)] border-[var(--gaia-border-glass)]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                {/* Accent corner */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[var(--gaia-green-200)] to-transparent opacity-0 group-hover:opacity-50 transition-opacity rounded-tr-xl" />
                
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 relative overflow-hidden bg-white shadow-sm border border-[var(--gaia-border-glass)]">
                  <feature.icon className="w-7 h-7 relative z-10" style={{ color: feature.color }} />
                </div>
                
                <h3 className="text-xl font-bold text-[var(--gaia-text-primary)] mb-3 tracking-wide">{feature.title}</h3>
                <p className="text-[var(--gaia-text-muted)] leading-relaxed text-sm font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--gaia-border-glass)] py-12 px-4 relative z-10 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Leaf className="w-5 h-5 text-[var(--gaia-green-500)]" />
            <span className="text-base font-bold tracking-widest text-[var(--gaia-green-800)]">AGRI<span className="text-[var(--gaia-green-500)]">MIND</span></span>
          </div>
          <div className="flex gap-8 text-sm text-[var(--gaia-text-muted)] font-mono font-bold">
            <span className="hover:text-[var(--gaia-green-600)] transition-colors cursor-pointer">SYSTEM.STATUS: ONLINE</span>
            <span className="hover:text-[var(--gaia-green-600)] transition-colors cursor-pointer">VERSION.1.0.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
