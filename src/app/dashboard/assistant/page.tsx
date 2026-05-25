'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Leaf, Droplets, Bug, FlaskConical, Network, Terminal } from 'lucide-react';
import { useAssistantStore } from '@/store/useAssistantStore';
import { useRef, useEffect, useCallback } from 'react';
import type { ChatMessage } from '@/types';

const SUGGESTED_PROMPTS = [
  { icon: Bug, text: 'Analyze pathogenic vectors for yellowing leaves', color: 'var(--gaia-amber)' },
  { icon: Droplets, text: 'Optimize H2O flux by 20%', color: 'var(--gaia-cyan)' },
  { icon: FlaskConical, text: 'Calculate optimal bio-nutrient synthesis', color: 'var(--gaia-purple)' },
  { icon: Network, text: 'Execute monsoon fungal resistance protocol', color: 'var(--gaia-green-500)' },
];

// Simulated AI responses
const AI_RESPONSES: Record<string, string> = {
  'yellow': `**[NEURAL DIAGNOSTIC]: Yellowing Leaf Vectors**

🔬 **Nitrogen Deficiency** — Lower biomass yellowing (high probability)
- Current N-level: **340 mg/kg** (Surplus detected. Warning: Potential distribution failure)
- > *Protocol*: Initiate foliar urea spray (0.5%) for immediate cellular uptake.

🌡️ **Thermal Stress**
- Current temp: **28°C** (Optimal)
- > *Protocol*: Monitor nocturnal thermal fluctuations for next 48h.

💧 **Hydration Overload**
- Soil moisture at **78%** ⚠️ (Critical: Exceeds 55% optimal threshold)
- > *Protocol*: Throttle irrigation matrix by 30%. Switch to drip-line distribution.

🦠 **Pathogen Alert: Alternaria (Early Blight)**
- Risk factor: **72%** (Elevated)
- Catalyst: **88%** ambient humidity.
- > *Protocol*: Deploy Chlorothalonil synthesis at 2g/L.

📊 **SYSTEM CONCLUSION:** 
Root cause identified as **Hydration Overload** compounding with **Elevated Humidity**, triggering nutrient lockout and early fungal propagation.

> **ACTION REQUIRED**: Throttle irrigation immediately. Deploy fungicide. Initialize full canopy scan.`,

  'water': `**[OPTIMIZATION]: H2O Flux Protocol**

📊 **Telemetry Analysis:**
- Current daily flux: **2,450L**
- Target optimal flux: **1,800L** (26% efficiency gain possible)

💡 **Execution Directives:**

1. **Deploy Drip Irrigation Matrix** 💰 (30-40% Gain)
   - Target Sectors: Alpha & Gamma fields.
   - Projected savings: 735L/cycle.

2. **Bio-Mulching Integration** 🌱 (15-25% Gain)
   - Deploy organic cover to minimize surface evaporation.
   - Cost: Minimal. Impact: High.

3. **Algorithmic Scheduling** 📡
   - Sensory logs indicate suboptimal timing (peak solar evaporation).
   - > *Action*: Realign irrigation window to 0500-0700 hours.
   - Projected savings: 490L/cycle.

4. **Atmospheric Harvesting** 🌧️
   - Meteorological data indicates **60mm** precipitation incoming at T+48h.
   - > *Action*: Engage collection arrays to capture 40% volume.

📈 **Projected System Efficiency:**
Total daily reduction: **1,592L**
Ecosystem Impact Score will increase from **72** to **89**.`,

  'organic': `**[SYNTHESIS]: Bio-Nutrient Optimization**

🌾 **Primary Recommendations (Ranked by Efficacy):**

1. **Vermicompost Substrate** ⭐ (Optimal)
   - NPK Matrix: ~1.5-2.0-1.0
   - Deployment: 2-3 tons/acre (basal layer).
   - Eco-Score: **95/100**

2. **Green Manure (Sesbania/Dhaincha)**
   - N-Fixation: 60-80 kg/acre.
   - Eco-Score: **100/100** (Maximum Sustainability)

3. **Neem Extract Cake**
   - NPK Matrix: ~5.0-1.0-1.5
   - Dual function: Nutrient source + Pathogen deterrent.
   - Eco-Score: **90/100**

4. **Amino Acid Foliar Matrix**
   - Deployment: 2-3ml/L during tillering phase.
   - Eco-Score: **85/100**

📊 **Current Substrate Telemetry:**
- N-Level: **210 mg/kg** (Stable)
- P-Level: **15 mg/kg** (⚠️ CRITICAL LOW)
- K-Level: **180 mg/kg** (Stable)

> **SYSTEM DIRECTIVE**: Immediate phosphorus supplementation required. Deploy bone meal (200 kg/acre) integrated with basal vermicompost.`,

  'fungal': `**[DEFENSE PROTOCOL]: Monsoon Fungal Resistance**

🌧️ **Threat Assessment:**
- Pathogen Risk: **CRITICAL** (Monsoon conditions + 88% Humidity)
- Identified vectors: Early Blight, Late Blight, Anthracnose.

🛡️ **Defense Directives:**

**1. Structural Modification** (Immediate)
- ✂️ Prune lower biomass to increase aerodynamic flow.
- 📐 Recalibrate plant spacing to 45cm (Current: 25cm ⚠️).
- 🚿 Terminate overhead irrigation.

**2. Chemical Defense Matrix** (Deployment Schedule)
- **Phase 1**: Copper Hydroxide 2g/L (Preventative shield).
- **Phase 2**: Trichoderma viride deployment (Biological counter-measure).
- **Phase 3**: Chlorothalonil 2g/L (If pathogen breaches primary defenses).

**3. Sensor Calibration**
- 📸 Increase AI Leaf Scan frequency to 3-day intervals.
- 📡 Lower soil moisture critical alert to 65%.

📅 **Automated Schedule Generated:**
- T+0: Sensory sweep & structural modification.
- T+48: Initiate Phase 1 chemical defense prior to incoming precipitation (60mm).

> **WARNING**: Atmospheric event detected in 48 hours. Execute Phase 1 defense immediately.`,
};

function getAIResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('yellow') || lower.includes('turning') || lower.includes('pathogenic')) return AI_RESPONSES['yellow'];
  if (lower.includes('water') || lower.includes('irrigation') || lower.includes('reduce') || lower.includes('flux')) return AI_RESPONSES['water'];
  if (lower.includes('organic') || lower.includes('fertilizer') || lower.includes('rice') || lower.includes('bio-nutrient')) return AI_RESPONSES['organic'];
  if (lower.includes('fungal') || lower.includes('monsoon') || lower.includes('prevent') || lower.includes('disease') || lower.includes('protocol')) return AI_RESPONSES['fungal'];

  return `**[SYSTEM LOG]: Query Processed**

📊 **Current Telemetry:**
- System Integrity: 78/100
- Hydration Levels: 55% (Optimal)
- Thermal Index: 28°C
- Active Alerts: 3

Your query regarding "${input}" has been logged into the central matrix. Recommended actions:

1. **Access Sensor Matrix** — Review live telemetry feeds.
2. **Initialize AI Scanner** — Provide visual data for neural processing.
3. **Review Protocols** — Check the defense and chemical deployment logs.

Awaiting further parameters...`;
}

export default function AssistantPage() {
  const { messages, isTyping, inputValue, addMessage, setTyping, setInputValue } = useAssistantStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = useCallback(async (text?: string) => {
    const message = text || inputValue.trim();
    if (!message) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    addMessage(userMsg);
    setInputValue('');
    setTyping(true);

    // Simulate AI thinking
    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

    // Add AI response
    const response = getAIResponse(message);
    const aiMsg: ChatMessage = {
      id: `msg-${Date.now()}-ai`,
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };
    addMessage(aiMsg);
    setTyping(false);
  }, [inputValue, addMessage, setInputValue, setTyping]);

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-[1200px] mx-auto rounded-2xl glass-panel overflow-hidden border border-[rgba(0,255,136,0.2)] shadow-[0_0_30px_rgba(0,0,0,0.5)] mt-4">
      {/* Header */}
      <div className="px-6 py-5 border-b border-[rgba(0,255,136,0.15)] bg-white/50 backdrop-blur-md relative overflow-hidden">
        <div className="absolute inset-0 bg-holographic-grid opacity-20" />
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[rgba(0,255,136,0.05)] border border-[rgba(0,255,136,0.2)] flex items-center justify-center relative group">
              <div className="absolute inset-0 bg-[var(--gaia-green-500)] opacity-20 blur-xl rounded-xl group-hover:opacity-40 transition-opacity" />
              <Bot className="w-6 h-6 text-[var(--gaia-green-500)] relative z-10 drop-shadow-[0_0_10px_rgba(0,255,136,0.8)]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--gaia-text-primary)] tracking-widest uppercase">Nexus AI Core</h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-[var(--gaia-green-500)] animate-pulse shadow-[0_0_8px_var(--gaia-green-500)]" />
                <span className="text-xs text-[var(--gaia-green-500)] font-mono uppercase tracking-widest">Neural Link Established</span>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[var(--gaia-text-muted)]">
            <Terminal className="w-4 h-4 text-[var(--gaia-cyan)]" />
            SYS.UPTIME: 99.99%
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 space-y-6 bg-white/30">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {msg.role === 'assistant' && (
                <div className="w-10 h-10 rounded-xl bg-[rgba(0,255,136,0.05)] border border-[rgba(0,255,136,0.2)] flex items-center justify-center flex-shrink-0 mt-1 shadow-[0_0_15px_rgba(0,255,136,0.1)]">
                  <Sparkles className="w-5 h-5 text-[var(--gaia-cyan)] drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-6 py-4 relative overflow-hidden ${
                  msg.role === 'user'
                    ? 'bg-[rgba(0,255,136,0.05)] border border-[rgba(0,255,136,0.2)] text-[var(--gaia-text-primary)] shadow-[0_0_20px_rgba(0,255,136,0.1)] rounded-tr-sm'
                    : 'bg-black/5 border border-[var(--gaia-border-glass)] text-[var(--gaia-text-primary)] shadow-[0_4px_20px_rgba(0,0,0,0.3)] rounded-tl-sm'
                }`}
              >
                {msg.role === 'assistant' && <div className="absolute inset-0 bg-gradient-to-br from-[rgba(0,255,136,0.02)] to-transparent pointer-events-none" />}
                
                <div className="text-sm leading-relaxed whitespace-pre-wrap font-medium relative z-10"
                  dangerouslySetInnerHTML={{
                    __html: msg.content
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-[var(--gaia-green-500)] drop-shadow-[0_0_5px_rgba(0,255,136,0.4)] tracking-wide">$1</strong>')
                      .replace(/\n/g, '<br/>')
                      .replace(/`(.*?)`/g, '<code class="text-[var(--gaia-cyan)] bg-[rgba(0,240,255,0.1)] border border-[rgba(0,240,255,0.2)] px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')
                      .replace(/> (.*?)(<br\/>|$)/g, '<div class="border-l-2 border-[var(--gaia-cyan)] pl-3 my-2 text-[var(--gaia-cyan)] bg-[rgba(0,240,255,0.05)] p-2 rounded-r-md">$1</div>$2')
                      .replace(/\[(.*?)\]/g, '<span class="text-[var(--gaia-cyan)] font-mono text-xs uppercase tracking-widest">[$1]</span>')
                  }}
                />
                <div className={`text-[10px] font-mono mt-3 uppercase tracking-widest ${msg.role === 'user' ? 'text-[var(--gaia-green-500)] text-right' : 'text-[var(--gaia-text-muted)]'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
              </div>
              {msg.role === 'user' && (
                <div className="w-10 h-10 rounded-xl bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.3)] flex items-center justify-center flex-shrink-0 mt-1 shadow-[0_0_15px_rgba(0,255,136,0.2)]">
                  <User className="w-5 h-5 text-[var(--gaia-green-500)] drop-shadow-[0_0_8px_rgba(0,255,136,0.8)]" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            className="flex gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-10 h-10 rounded-xl bg-[rgba(0,255,136,0.05)] border border-[rgba(0,255,136,0.2)] flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(0,255,136,0.1)]">
              <Sparkles className="w-5 h-5 text-[var(--gaia-cyan)] animate-pulse" />
            </div>
            <div className="bg-black/5 border border-[var(--gaia-border-glass)] rounded-2xl rounded-tl-sm px-6 py-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--gaia-green-500)] animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-[var(--gaia-green-500)] animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-[var(--gaia-green-500)] animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      {messages.length <= 1 && (
        <div className="px-6 pb-4 bg-white/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SUGGESTED_PROMPTS.map((prompt, i) => (
              <motion.button
                key={i}
                className="flex items-center gap-3 p-4 rounded-xl bg-black/5 border border-[var(--gaia-border-glass)] hover:border-[rgba(0,255,136,0.3)] hover:bg-[rgba(0,255,136,0.05)] transition-all text-left group shadow-[0_4px_10px_rgba(0,0,0,0.2)]"
                onClick={() => handleSend(prompt.text)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <div className="p-2 rounded-lg bg-[rgba(0,0,0,0.5)] border border-[var(--gaia-border-glass)] group-hover:border-[currentColor]" style={{ color: prompt.color }}>
                  <prompt.icon className="w-4 h-4" />
                </div>
                <span className="text-xs text-[var(--gaia-text-secondary)] font-medium font-mono uppercase tracking-wide group-hover:text-[var(--gaia-text-primary)] transition-colors">{prompt.text}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-6 py-5 border-t border-[rgba(0,255,136,0.15)] bg-white/50 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-3 p-2 rounded-2xl bg-[rgba(0,0,0,0.5)] border border-[rgba(0,255,136,0.2)] focus-within:border-[var(--gaia-green-500)] focus-within:shadow-[0_0_20px_rgba(0,255,136,0.15)] transition-all">
          <div className="pl-4">
            <Terminal className="w-4 h-4 text-[var(--gaia-text-dim)]" />
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Enter command or query matrix..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-transparent text-sm text-[var(--gaia-text-primary)] placeholder-[var(--gaia-text-dim)] outline-none font-mono py-2"
          />
          <motion.button
            onClick={() => handleSend()}
            className="w-12 h-12 rounded-xl btn-cyber flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!inputValue.trim()}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
