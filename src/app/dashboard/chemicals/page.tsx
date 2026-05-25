'use client';

import { motion } from 'framer-motion';
import {
  FlaskConical,
  Search,
  AlertTriangle,
  Shield,
  Leaf,
  Clock,
  XOctagon,
  CheckCircle,
  Info,
  Scan,
  TrendingDown,
} from 'lucide-react';
import { MOCK_CHEMICALS, MOCK_CHEMICAL_HISTORY } from '@/data/mockChemicals';
import { Badge } from '@/components/ui/badge';
import { useState, useMemo } from 'react';
import Link from 'next/link';

const TOXICITY_COLORS = {
  low: { color: 'var(--gaia-green-500)', label: 'Minimal Toxicity' },
  moderate: { color: 'var(--gaia-amber)', label: 'Moderate Toxicity' },
  high: { color: 'var(--gaia-red)', label: 'High Toxicity' },
  very_high: { color: '#ff1744', label: 'CRITICAL TOXICITY' },
};

export default function ChemicalsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChemical, setSelectedChemical] = useState(MOCK_CHEMICALS[0]);
  const [activeTab, setActiveTab] = useState<'tracker' | 'timeline' | 'safety'>('tracker');

  const filteredChemicals = useMemo(
    () => MOCK_CHEMICALS.filter(
      (c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.type.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [searchQuery]
  );

  return (
    <div className="max-w-[1600px] mx-auto min-h-full space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8 relative z-20">
        <div className="flex items-center gap-3 text-[var(--gaia-purple)] text-xs mb-3">
          <FlaskConical className="w-4 h-4 animate-pulse" />
          <span className="uppercase tracking-[0.2em] font-bold">Bio-Chemical Synthesis Matrix</span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold text-[var(--gaia-text-primary)] tracking-tight">
          Chemical <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--gaia-purple)] to-[var(--gaia-cyan)] drop-shadow-[0_0_15px_rgba(196,122,255,0.4)]">Intelligence</span>
        </h1>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 mb-8 p-1.5 rounded-xl bg-black/5 border border-[var(--gaia-border-glass)] w-fit relative z-10">
        {(['tracker', 'timeline', 'safety'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === tab
                ? 'bg-[var(--gaia-purple)] text-[var(--gaia-text-primary)] shadow-[0_0_15px_rgba(196,122,255,0.4)]'
                : 'text-[var(--gaia-text-muted)] hover:text-[var(--gaia-text-primary)] hover:bg-black/5'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'tracker' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
          {/* Chemical List */}
          <div className="lg:col-span-1 space-y-4">
            {/* Search */}
            <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/50 border border-[var(--gaia-border-glass)] focus-within:border-[var(--gaia-purple)] focus-within:shadow-[0_0_15px_rgba(196,122,255,0.2)] transition-all">
              <Search className="w-5 h-5 text-[var(--gaia-text-dim)]" />
              <input
                type="text"
                placeholder="Query database..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm text-[var(--gaia-text-primary)] placeholder-[var(--gaia-text-dim)] outline-none w-full font-mono"
              />
            </div>

            {/* QR Scan Mockup */}
            <Link href="/dashboard/scanner">
              <motion.div
                className="glass-panel p-4 flex items-center gap-4 cursor-pointer group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-12 h-12 rounded-xl bg-[rgba(196,122,255,0.1)] border border-[rgba(196,122,255,0.2)] flex items-center justify-center group-hover:bg-[rgba(196,122,255,0.2)] transition-colors">
                  <Scan className="w-6 h-6 text-[var(--gaia-purple)]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--gaia-text-primary)] tracking-wide">Initialize QR Scanner</p>
                  <p className="text-[10px] text-[var(--gaia-text-muted)] font-mono uppercase tracking-widest mt-1">Identify compound instantly</p>
                </div>
              </motion.div>
            </Link>

            {/* Chemical cards */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredChemicals.map((chem, i) => (
                <motion.div
                  key={chem.id}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${
                    selectedChemical?.id === chem.id
                      ? 'glass-panel border-[var(--gaia-purple)] shadow-[0_0_20px_rgba(196,122,255,0.15)] bg-[rgba(196,122,255,0.05)]'
                      : 'bg-black/5 border border-[var(--gaia-border-glass)] hover:border-[var(--gaia-border-glass)]'
                  }`}
                  onClick={() => setSelectedChemical(chem)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-[var(--gaia-text-primary)] tracking-wide">{chem.name}</span>
                    <Badge variant="outline" className="text-[9px] px-2 py-0.5 font-mono uppercase tracking-widest border-[var(--gaia-border-glass)] bg-[rgba(0,0,0,0.5)]">
                      {chem.type}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold font-mono tracking-widest uppercase">
                    <span style={{ color: TOXICITY_COLORS[chem.toxicityLevel].color }}>
                      {TOXICITY_COLORS[chem.toxicityLevel].label}
                    </span>
                    <span className="text-[var(--gaia-text-muted)]">ECO: {chem.ecoScore}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Chemical Detail */}
          {selectedChemical && (
            <motion.div
              key={selectedChemical.id}
              className="lg:col-span-2 space-y-6"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Header card */}
              <div className="glass-panel p-8 relative overflow-hidden">
                <div
                  className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
                  style={{ background: TOXICITY_COLORS[selectedChemical.toxicityLevel].color, filter: 'blur(60px)' }}
                />
                <div className="flex items-start justify-between mb-8 relative z-10">
                  <div>
                    <h2 className="text-3xl font-bold text-[var(--gaia-text-primary)] tracking-tight">{selectedChemical.name}</h2>
                    <p className="text-sm text-[var(--gaia-text-muted)] mt-1 font-mono tracking-widest uppercase">Active Compound: <span className="text-[var(--gaia-cyan)]">{selectedChemical.activeIngredient}</span></p>
                  </div>
                  <Badge
                    className="text-xs font-bold px-4 py-2 uppercase tracking-widest"
                    style={{
                      background: `${TOXICITY_COLORS[selectedChemical.toxicityLevel].color}20`,
                      color: TOXICITY_COLORS[selectedChemical.toxicityLevel].color,
                      border: `1px solid ${TOXICITY_COLORS[selectedChemical.toxicityLevel].color}`,
                      boxShadow: `0 0 15px ${TOXICITY_COLORS[selectedChemical.toxicityLevel].color}40`,
                    }}
                  >
                    {TOXICITY_COLORS[selectedChemical.toxicityLevel].label}
                  </Badge>
                </div>

                {/* Toxicity Meter */}
                <div className="mb-8 relative z-10">
                  <div className="flex justify-between text-[11px] text-[var(--gaia-text-muted)] mb-3 font-bold font-mono tracking-widest uppercase">
                    <span>Toxicity Spectrum</span>
                  </div>
                  <div className="h-4 rounded-full bg-black/5 overflow-hidden relative border border-[var(--gaia-border-glass)]">
                    <div className="absolute inset-0 flex opacity-60">
                      <div className="flex-1 bg-gradient-to-r from-[var(--gaia-green-500)] to-transparent" />
                      <div className="flex-1 bg-gradient-to-r from-[var(--gaia-amber)] to-transparent" />
                      <div className="flex-1 bg-gradient-to-r from-[var(--gaia-red)] to-transparent" />
                      <div className="flex-1 bg-gradient-to-r from-[#ff1744] to-transparent" />
                    </div>
                    <motion.div
                      className="absolute top-0 bottom-0 w-3 rounded-full bg-white shadow-[0_0_15px_rgba(0,0,0,0.2)]"
                      initial={{ left: '0%' }}
                      animate={{
                        left: selectedChemical.toxicityLevel === 'low' ? '12%' :
                              selectedChemical.toxicityLevel === 'moderate' ? '37%' :
                              selectedChemical.toxicityLevel === 'high' ? '62%' : '87%',
                      }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-[var(--gaia-text-dim)] mt-2 font-mono tracking-widest uppercase">
                    <span>Stable</span>
                    <span>Caution</span>
                    <span>Danger</span>
                    <span>Lethal</span>
                  </div>
                </div>

                {/* Eco Score */}
                <div className="grid grid-cols-2 gap-4 relative z-10">
                  <div className="p-4 rounded-xl bg-black/5 border border-[var(--gaia-border-glass)]">
                    <p className="text-[10px] text-[var(--gaia-text-muted)] uppercase tracking-widest mb-2 font-bold font-mono">Eco Impact Score</p>
                    <p className="text-3xl font-bold font-mono drop-shadow-[0_0_10px_currentColor]" style={{ color: selectedChemical.ecoScore > 60 ? 'var(--gaia-green-500)' : selectedChemical.ecoScore > 30 ? 'var(--gaia-amber)' : 'var(--gaia-red)' }}>
                      {selectedChemical.ecoScore}/100
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-black/5 border border-[var(--gaia-border-glass)]">
                    <p className="text-[10px] text-[var(--gaia-text-muted)] uppercase tracking-widest mb-2 font-bold font-mono">Compound Class</p>
                    <p className="text-3xl font-bold text-[var(--gaia-text-primary)] capitalize">{selectedChemical.type}</p>
                  </div>
                </div>
              </div>

              {/* Interactions */}
              <div className="glass-panel p-8">
                <div className="flex items-center gap-3 mb-6">
                  <AlertTriangle className="w-5 h-5 text-[var(--gaia-amber)] drop-shadow-[0_0_10px_rgba(255,183,0,0.5)]" />
                  <h3 className="text-sm font-bold text-[var(--gaia-text-primary)] tracking-widest uppercase">Synthesis Interactions</h3>
                </div>
                <div className="space-y-4">
                  {selectedChemical.interactions.map((interaction, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-xl border ${
                        interaction.severity === 'dangerous'
                          ? 'bg-[rgba(255,42,77,0.05)] border-[rgba(255,42,77,0.2)]'
                          : interaction.severity === 'caution'
                          ? 'bg-[rgba(255,171,0,0.05)] border-[rgba(255,171,0,0.2)]'
                          : 'bg-[rgba(0,255,136,0.05)] border-[rgba(0,255,136,0.2)]'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        {interaction.severity === 'dangerous' ? (
                          <XOctagon className="w-5 h-5 text-[var(--gaia-red)]" />
                        ) : interaction.severity === 'caution' ? (
                          <AlertTriangle className="w-5 h-5 text-[var(--gaia-amber)]" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-[var(--gaia-green-500)]" />
                        )}
                        <span className="text-sm font-bold text-[var(--gaia-text-primary)] tracking-wide">
                          + {interaction.interactsWith}
                        </span>
                        <Badge variant="outline" className={`text-[10px] font-mono tracking-widest uppercase ml-auto bg-white/50 ${
                          interaction.severity === 'dangerous' ? 'border-[var(--gaia-red)] text-[var(--gaia-red)]' :
                          interaction.severity === 'caution' ? 'border-[var(--gaia-amber)] text-[var(--gaia-amber)]' :
                          'border-[var(--gaia-green-500)] text-[var(--gaia-green-500)]'
                        }`}>
                          {interaction.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-[var(--gaia-text-secondary)] font-medium leading-relaxed pl-8">{interaction.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Eco-Friendly Alternatives */}
              {selectedChemical.alternatives.length > 0 && (
                <div className="glass-panel p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Leaf className="w-5 h-5 text-[var(--gaia-green-500)] drop-shadow-[0_0_10px_rgba(0,255,136,0.5)]" />
                    <h3 className="text-sm font-bold text-[var(--gaia-text-primary)] tracking-widest uppercase">Bio-Compatible Alternatives</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedChemical.alternatives.map((alt, i) => (
                      <motion.div
                        key={i}
                        className="p-4 rounded-xl bg-[var(--gaia-green-50)] border border-[rgba(0,255,136,0.1)] hover:border-[rgba(0,255,136,0.3)] hover:bg-[rgba(0,255,136,0.08)] transition-all flex items-center gap-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.1 }}
                      >
                        <Leaf className="w-4 h-4 text-[var(--gaia-green-500)]" />
                        <span className="text-sm font-bold text-[var(--gaia-text-primary)] tracking-wide">{alt}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      )}

      {activeTab === 'timeline' && (
        <motion.div
          className="glass-panel p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <Clock className="w-5 h-5 text-[var(--gaia-cyan)] drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]" />
            <h3 className="text-sm font-bold text-[var(--gaia-text-primary)] tracking-widest uppercase">Deployment Chronology</h3>
          </div>
          <div className="relative pl-4">
            <div className="absolute left-[27px] top-4 bottom-4 w-px bg-gradient-to-b from-[rgba(0,240,255,0.3)] to-[rgba(0,255,136,0.3)]" />
            <div className="space-y-8">
              {MOCK_CHEMICAL_HISTORY.map((app, i) => {
                const chem = MOCK_CHEMICALS.find((c) => c.id === app.chemicalId);
                return (
                  <motion.div
                    key={app.id}
                    className="flex items-start gap-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="w-8 h-8 rounded-full bg-[rgba(0,240,255,0.1)] flex items-center justify-center flex-shrink-0 z-10 border-2 border-[var(--gaia-cyan)] shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                      <FlaskConical className="w-4 h-4 text-[var(--gaia-cyan)]" />
                    </div>
                    <div className="flex-1 glass-panel p-6 border-[var(--gaia-border-glass)] bg-black/5">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-base font-bold text-[var(--gaia-text-primary)] tracking-wide">{chem?.name || 'Unknown Compound'}</span>
                        <span className="text-[10px] font-mono font-bold text-[var(--gaia-text-muted)] tracking-widest bg-white/50 px-3 py-1 rounded-full">
                          {app.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="p-3 bg-white/30 rounded-lg">
                          <p className="text-[9px] text-[var(--gaia-text-dim)] uppercase tracking-widest mb-1">Dosage</p>
                          <p className="text-sm font-bold text-[var(--gaia-text-primary)] font-mono">{app.dosage} <span className="text-[var(--gaia-text-muted)] text-xs">{app.unit}</span></p>
                        </div>
                        <div className="p-3 bg-white/30 rounded-lg">
                          <p className="text-[9px] text-[var(--gaia-text-dim)] uppercase tracking-widest mb-1">Target Sector</p>
                          <p className="text-sm font-bold text-[var(--gaia-text-primary)] tracking-wide">{app.cropType}</p>
                        </div>
                        <div className="p-3 bg-white/30 rounded-lg">
                          <p className="text-[9px] text-[var(--gaia-text-dim)] uppercase tracking-widest mb-1">Operator</p>
                          <p className="text-sm font-bold text-[var(--gaia-text-primary)] tracking-wide">{app.appliedBy}</p>
                        </div>
                      </div>
                      <p className="text-xs text-[var(--gaia-text-secondary)] font-medium leading-relaxed italic border-l-2 border-[var(--gaia-cyan)] pl-3">"{app.notes}"</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'safety' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
          {/* Dangerous Combinations */}
          <motion.div
            className="glass-panel p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <XOctagon className="w-5 h-5 text-[var(--gaia-red)] drop-shadow-[0_0_10px_rgba(255,42,77,0.5)]" />
              <h3 className="text-sm font-bold text-[var(--gaia-text-primary)] tracking-widest uppercase">Lethal Syntheses</h3>
            </div>
            <div className="space-y-4">
              {MOCK_CHEMICALS.flatMap((c) =>
                c.interactions
                  .filter((i) => i.severity === 'dangerous')
                  .map((interaction) => (
                    <div
                      key={`${c.id}-${interaction.interactsWith}`}
                      className="p-5 rounded-xl bg-[rgba(255,42,77,0.05)] border border-[rgba(255,42,77,0.2)] shadow-[0_0_15px_rgba(255,42,77,0.1)]"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <XOctagon className="w-4 h-4 text-[var(--gaia-red)]" />
                        <span className="text-sm font-bold text-[var(--gaia-red)] tracking-wide">
                          {c.name} + {interaction.interactsWith}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--gaia-text-secondary)] font-medium pl-7">{interaction.description}</p>
                    </div>
                  ))
              )}
            </div>
          </motion.div>

          {/* Safety Guidelines */}
          <motion.div
            className="glass-panel p-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-5 h-5 text-[var(--gaia-green-500)] drop-shadow-[0_0_10px_rgba(0,255,136,0.5)]" />
              <h3 className="text-sm font-bold text-[var(--gaia-text-primary)] tracking-widest uppercase">Mandatory Protocols</h3>
            </div>
            <div className="space-y-4">
              {[
                { icon: Info, text: 'Equip Level-2 PPE (Respirator, Nitrile, Ocular shield) during synthesis.', color: 'var(--gaia-cyan)' },
                { icon: Clock, text: 'Enforce absolute 48-hour quarantine between divergent chemical deployments.', color: 'var(--gaia-amber)' },
                { icon: TrendingDown, text: 'Optimize vector targeting to reduce raw volume expenditure by 20%.', color: 'var(--gaia-green-500)' },
                { icon: Leaf, text: 'Mandate bio-compatible alternatives when pathogen pressure remains nominal.', color: 'var(--gaia-green-500)' },
                { icon: AlertTriangle, text: 'UNAUTHORIZED SYNTHESIS STRICTLY PROHIBITED. Consult interaction matrix.', color: 'var(--gaia-red)' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-xl bg-black/5 border border-[var(--gaia-border-glass)] hover:border-[var(--gaia-border-glass)] transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <item.icon className="w-5 h-5 mt-0.5 flex-shrink-0 drop-shadow-[0_0_8px_currentColor]" style={{ color: item.color }} />
                  <p className="text-sm text-[var(--gaia-text-secondary)] font-medium leading-relaxed">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
