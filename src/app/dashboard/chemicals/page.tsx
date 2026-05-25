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
  low: { color: '#00ff88', label: 'Low Toxicity' },
  moderate: { color: '#ffab00', label: 'Moderate Toxicity' },
  high: { color: '#ff3d57', label: 'High Toxicity' },
  very_high: { color: '#ff1744', label: 'Very High Toxicity' },
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
    <div className="p-4 lg:p-6 min-h-full bg-gradient-mesh">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-2 text-[#b388ff] text-xs mb-2">
          <FlaskConical className="w-4 h-4" />
          <span className="uppercase tracking-wider font-medium">Chemical Intelligence System</span>
        </div>
        <h1 className="text-2xl font-bold text-[#e8f5e9]">
          Chemical <span className="text-[#b388ff]">Intelligence</span>
        </h1>
        <p className="text-sm text-[#4a7c5c] mt-1">
          Smart tracking, toxicity analysis & safety recommendations
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 mb-6 p-1 rounded-lg bg-[rgba(0,255,136,0.03)] border border-[rgba(0,255,136,0.06)] w-fit">
        {(['tracker', 'timeline', 'safety'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all capitalize ${
              activeTab === tab
                ? 'bg-[rgba(0,255,136,0.1)] text-[#00ff88]'
                : 'text-[#4a7c5c] hover:text-[#81c784]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'tracker' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chemical List */}
          <div className="lg:col-span-1 space-y-4">
            {/* Search */}
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-[rgba(0,255,136,0.04)] border border-[rgba(0,255,136,0.08)]">
              <Search className="w-4 h-4 text-[#4a7c5c]" />
              <input
                type="text"
                placeholder="Search chemicals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm text-[#e8f5e9] placeholder-[#4a7c5c] outline-none w-full"
              />
            </div>

            {/* QR Scan Mockup */}
            <Link href="/dashboard/chemicals/scanner">
              <motion.div
                className="glass-card p-4 flex items-center gap-3 cursor-pointer hover:border-[rgba(179,136,255,0.3)] transition-colors"
                whileHover={{ scale: 1.01 }}
              >
                <div className="w-10 h-10 rounded-lg bg-[rgba(179,136,255,0.1)] flex items-center justify-center">
                  <Scan className="w-5 h-5 text-[#b388ff]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#e8f5e9]">Scan Barcode/QR</p>
                  <p className="text-[10px] text-[#4a7c5c]">Identify chemical products instantly</p>
                </div>
              </motion.div>
            </Link>

            {/* Chemical cards */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filteredChemicals.map((chem, i) => (
                <motion.div
                  key={chem.id}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedChemical?.id === chem.id
                      ? 'glass-card border-[rgba(0,255,136,0.2)] glow-green'
                      : 'bg-[rgba(0,255,136,0.02)] border border-[rgba(0,255,136,0.05)] hover:border-[rgba(0,255,136,0.12)]'
                  }`}
                  onClick={() => setSelectedChemical(chem)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-[#e8f5e9]">{chem.name}</span>
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0" style={{ borderColor: `${TOXICITY_COLORS[chem.toxicityLevel].color}40`, color: TOXICITY_COLORS[chem.toxicityLevel].color }}>
                      {chem.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-[10px]">
                    <span style={{ color: TOXICITY_COLORS[chem.toxicityLevel].color }}>
                      {TOXICITY_COLORS[chem.toxicityLevel].label}
                    </span>
                    <span className="text-[#4a7c5c]">Eco: {chem.ecoScore}/100</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Chemical Detail */}
          {selectedChemical && (
            <motion.div
              key={selectedChemical.id}
              className="lg:col-span-2 space-y-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {/* Header card */}
              <div className="glass-card p-6 relative overflow-hidden">
                <div
                  className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-[0.06]"
                  style={{ background: TOXICITY_COLORS[selectedChemical.toxicityLevel].color, filter: 'blur(40px)' }}
                />
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-[#e8f5e9]">{selectedChemical.name}</h2>
                    <p className="text-xs text-[#4a7c5c] mt-0.5">Active: {selectedChemical.activeIngredient}</p>
                  </div>
                  <Badge
                    className="text-xs font-semibold px-3 py-1"
                    style={{
                      background: `${TOXICITY_COLORS[selectedChemical.toxicityLevel].color}15`,
                      color: TOXICITY_COLORS[selectedChemical.toxicityLevel].color,
                    }}
                  >
                    {TOXICITY_COLORS[selectedChemical.toxicityLevel].label}
                  </Badge>
                </div>

                {/* Toxicity Meter */}
                <div className="mb-4">
                  <div className="flex justify-between text-[10px] text-[#4a7c5c] mb-1">
                    <span>Toxicity Level</span>
                  </div>
                  <div className="h-3 rounded-full bg-[rgba(0,255,136,0.06)] overflow-hidden relative">
                    <div className="absolute inset-0 flex">
                      <div className="flex-1 bg-gradient-to-r from-[#00ff88] to-[#00ff88]" style={{ opacity: 0.15 }} />
                      <div className="flex-1 bg-gradient-to-r from-[#ffab00] to-[#ffab00]" style={{ opacity: 0.15 }} />
                      <div className="flex-1 bg-gradient-to-r from-[#ff3d57] to-[#ff3d57]" style={{ opacity: 0.15 }} />
                      <div className="flex-1 bg-gradient-to-r from-[#ff1744] to-[#ff1744]" style={{ opacity: 0.15 }} />
                    </div>
                    <motion.div
                      className="absolute top-0 bottom-0 w-2 rounded-full bg-white shadow-lg"
                      initial={{ left: '0%' }}
                      animate={{
                        left: selectedChemical.toxicityLevel === 'low' ? '10%' :
                              selectedChemical.toxicityLevel === 'moderate' ? '37%' :
                              selectedChemical.toxicityLevel === 'high' ? '62%' : '87%',
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-[#4a7c5c] mt-1">
                    <span>Safe</span>
                    <span>Moderate</span>
                    <span>High</span>
                    <span>Extreme</span>
                  </div>
                </div>

                {/* Eco Score */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-[rgba(0,255,136,0.04)] border border-[rgba(0,255,136,0.08)]">
                    <p className="text-[10px] text-[#4a7c5c] uppercase tracking-wider mb-1">Eco Score</p>
                    <p className="text-xl font-bold" style={{ color: selectedChemical.ecoScore > 60 ? '#00ff88' : selectedChemical.ecoScore > 30 ? '#ffab00' : '#ff3d57' }}>
                      {selectedChemical.ecoScore}/100
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-[rgba(0,255,136,0.04)] border border-[rgba(0,255,136,0.08)]">
                    <p className="text-[10px] text-[#4a7c5c] uppercase tracking-wider mb-1">Type</p>
                    <p className="text-xl font-bold text-[#e8f5e9] capitalize">{selectedChemical.type}</p>
                  </div>
                </div>
              </div>

              {/* Interactions */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-4 h-4 text-[#ffab00]" />
                  <h3 className="text-sm font-medium text-[#81c784]">Chemical Interactions</h3>
                </div>
                <div className="space-y-3">
                  {selectedChemical.interactions.map((interaction, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg border ${
                        interaction.severity === 'dangerous'
                          ? 'bg-[rgba(255,61,87,0.06)] border-[rgba(255,61,87,0.2)]'
                          : interaction.severity === 'caution'
                          ? 'bg-[rgba(255,171,0,0.06)] border-[rgba(255,171,0,0.15)]'
                          : 'bg-[rgba(0,255,136,0.04)] border-[rgba(0,255,136,0.1)]'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        {interaction.severity === 'dangerous' ? (
                          <XOctagon className="w-4 h-4 text-[#ff3d57]" />
                        ) : interaction.severity === 'caution' ? (
                          <AlertTriangle className="w-4 h-4 text-[#ffab00]" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-[#00ff88]" />
                        )}
                        <span className="text-sm font-medium text-[#e8f5e9]">
                          + {interaction.interactsWith}
                        </span>
                        <Badge variant="outline" className={`text-[9px] ml-auto capitalize ${
                          interaction.severity === 'dangerous' ? 'border-[#ff3d57] text-[#ff3d57]' :
                          interaction.severity === 'caution' ? 'border-[#ffab00] text-[#ffab00]' :
                          'border-[#00ff88] text-[#00ff88]'
                        }`}>
                          {interaction.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-[#4a7c5c]">{interaction.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Eco-Friendly Alternatives */}
              {selectedChemical.alternatives.length > 0 && (
                <div className="glass-card p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Leaf className="w-4 h-4 text-[#00ff88]" />
                    <h3 className="text-sm font-medium text-[#81c784]">Eco-Friendly Alternatives</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedChemical.alternatives.map((alt, i) => (
                      <motion.div
                        key={i}
                        className="p-3 rounded-lg bg-[rgba(0,255,136,0.04)] border border-[rgba(0,255,136,0.08)] hover:border-[rgba(0,255,136,0.2)] transition-colors flex items-center gap-2"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                      >
                        <Leaf className="w-3 h-3 text-[#00ff88]" />
                        <span className="text-sm text-[#e8f5e9]">{alt}</span>
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
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-4 h-4 text-[#00e5ff]" />
            <h3 className="text-sm font-medium text-[#81c784]">Treatment Application Timeline</h3>
          </div>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-[rgba(0,255,136,0.1)]" />
            <div className="space-y-6">
              {MOCK_CHEMICAL_HISTORY.map((app, i) => {
                const chem = MOCK_CHEMICALS.find((c) => c.id === app.chemicalId);
                return (
                  <motion.div
                    key={app.id}
                    className="flex items-start gap-4 pl-1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="w-7 h-7 rounded-full bg-[rgba(0,255,136,0.1)] flex items-center justify-center flex-shrink-0 z-10 border border-[rgba(0,255,136,0.2)]">
                      <FlaskConical className="w-3 h-3 text-[#00ff88]" />
                    </div>
                    <div className="flex-1 glass-card p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[#e8f5e9]">{chem?.name || 'Unknown'}</span>
                        <span className="text-[10px] text-[#4a7c5c]">
                          {app.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        <div>
                          <p className="text-[9px] text-[#4a7c5c] uppercase">Dosage</p>
                          <p className="text-xs text-[#e8f5e9]">{app.dosage} {app.unit}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-[#4a7c5c] uppercase">Crop</p>
                          <p className="text-xs text-[#e8f5e9]">{app.cropType}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-[#4a7c5c] uppercase">Applied By</p>
                          <p className="text-xs text-[#e8f5e9]">{app.appliedBy}</p>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#4a7c5c]">{app.notes}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'safety' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dangerous Combinations */}
          <motion.div
            className="glass-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <XOctagon className="w-4 h-4 text-[#ff3d57]" />
              <h3 className="text-sm font-medium text-[#81c784]">Dangerous Combinations</h3>
            </div>
            <div className="space-y-3">
              {MOCK_CHEMICALS.flatMap((c) =>
                c.interactions
                  .filter((i) => i.severity === 'dangerous')
                  .map((interaction) => (
                    <div
                      key={`${c.id}-${interaction.interactsWith}`}
                      className="p-4 rounded-lg bg-[rgba(255,61,87,0.06)] border border-[rgba(255,61,87,0.15)]"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <XOctagon className="w-4 h-4 text-[#ff3d57]" />
                        <span className="text-sm font-bold text-[#ff3d57]">
                          {c.name} + {interaction.interactsWith}
                        </span>
                      </div>
                      <p className="text-xs text-[#81c784]">{interaction.description}</p>
                    </div>
                  ))
              )}
            </div>
          </motion.div>

          {/* Safety Guidelines */}
          <motion.div
            className="glass-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-[#00ff88]" />
              <h3 className="text-sm font-medium text-[#81c784]">Safety Recommendations</h3>
            </div>
            <div className="space-y-3">
              {[
                { icon: Info, text: 'Always wear PPE (gloves, mask, goggles) when handling chemicals', color: '#00e5ff' },
                { icon: Clock, text: 'Maintain minimum 48-hour interval between different chemical applications', color: '#ffab00' },
                { icon: TrendingDown, text: 'Reduce chemical usage by 20% through precision application techniques', color: '#00ff88' },
                { icon: Leaf, text: 'Prefer organic alternatives when pest/disease pressure is moderate or below', color: '#00ff88' },
                { icon: AlertTriangle, text: 'Never mix chemicals without consulting the interaction database first', color: '#ff3d57' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg bg-[rgba(0,255,136,0.02)] border border-[rgba(0,255,136,0.05)]"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                >
                  <item.icon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: item.color }} />
                  <p className="text-sm text-[#e8f5e9]">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
