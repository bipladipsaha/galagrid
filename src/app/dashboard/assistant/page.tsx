'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Leaf, Droplets, Bug, FlaskConical } from 'lucide-react';
import { useAssistantStore } from '@/store/useAssistantStore';
import { useRef, useEffect, useCallback } from 'react';
import type { ChatMessage } from '@/types';

const SUGGESTED_PROMPTS = [
  { icon: Bug, text: 'Why are tomato leaves turning yellow?', color: '#ffab00' },
  { icon: Droplets, text: 'How to reduce water usage by 20%?', color: '#00e5ff' },
  { icon: FlaskConical, text: 'Best organic fertilizer for rice?', color: '#b388ff' },
  { icon: Leaf, text: 'How to prevent fungal disease in monsoon?', color: '#00ff88' },
];

// Simulated AI responses
const AI_RESPONSES: Record<string, string> = {
  'yellow': `**Possible causes for yellowing tomato leaves:**

🔬 **Nitrogen Deficiency** — Lower leaves yellowing first (most common)
- Your current N level: **340 mg/kg** (above optimal, but check distribution)
- Consider foliar spray of urea (0.5%) for quick uptake

🌡️ **Temperature Stress**
- Current temperature: **28°C** (within range, but nights above 20°C can cause stress)
- Monitor night temperatures for next 48 hours

💧 **Overwatering**
- Soil moisture at **78%** ⚠️ exceeds optimal (55%)
- Reduce irrigation frequency by 30%
- Switch to drip irrigation if using overhead sprinklers

🦠 **Early Blight (Alternaria)**
- Current disease risk: **72%** — elevated
- Humidity at **88%** is creating favorable conditions
- Recommend preventive Chlorothalonil spray at 2g/L

📊 **Based on your sensor data**, the most likely cause is **overwatering combined with high humidity**, which is creating conditions favorable for both nutrient lockout and fungal infection.

> **Action**: Reduce irrigation immediately, apply preventive fungicide within 48 hours, and scan affected leaves using the AI Scanner for precise diagnosis.`,

  'water': `**Water Usage Optimization Strategy:**

📊 **Current Usage Analysis:**
- Daily average: **2,450L** across all fields
- Optimal target: **1,800L** (26% reduction possible)

💡 **Recommended Actions:**

1. **Switch to Drip Irrigation** 💰 Save 30-40%
   - Replace overhead sprinklers in Fields A & C
   - ROI payback: ~2 seasons
   - Estimated savings: 735L/day

2. **Mulching** 🌱 Save 15-25%
   - Apply organic mulch (straw/leaf litter) around crop bases
   - Reduces evaporation significantly
   - Cost: Very low

3. **Sensor-Based Scheduling** 📡
   - Your soil moisture sensors show watering during peak evaporation hours
   - **Shift irrigation to 5-7 AM** — reduces loss by 20%
   - Automate based on soil moisture threshold (trigger at 40%, stop at 60%)

4. **Rainwater Harvesting** 🌧️
   - Expected rainfall this week: **60mm** on Wednesday
   - Setup collection system to capture ~40% for reuse

📈 **Projected savings with all measures:**
| Measure | Daily Savings | Annual Savings |
|---------|--------------|----------------|
| Drip Irrigation | 735L | 268,275L |
| Mulching | 367L | 133,955L |
| Smart Scheduling | 490L | 178,850L |
| **Total** | **1,592L** | **581,080L** |

> Your **Sustainability Score** would improve from **72** to **89** with these changes.`,

  'organic': `**Best Organic Fertilizers for Rice:**

🌾 **Top Recommendations (ranked by effectiveness):**

1. **Vermicompost** ⭐ Best Overall
   - NPK: ~1.5-2.0-1.0
   - Application: 2-3 tons/acre as basal
   - Benefits: Improves soil structure, adds beneficial microbes
   - Sustainability Score: **95/100**

2. **Green Manure (Sesbania/Dhaincha)**
   - Incorporates 60-80 kg N/acre when ploughed in
   - Plant 45 days before transplanting
   - Zero cost, maximum sustainability
   - Sustainability Score: **100/100**

3. **Neem Cake**
   - NPK: ~5.0-1.0-1.5
   - Application: 200-300 kg/acre
   - Dual benefit: fertilizer + pest repellent
   - Sustainability Score: **90/100**

4. **Fish Amino Acid**
   - Foliar spray at 2-3ml/L during tillering
   - Rich in amino acids for growth boost
   - Sustainability Score: **85/100**

📊 **Based on your soil data:**
- Current N: **210 mg/kg** (adequate)
- Current P: **15 mg/kg** (low ⚠️)
- Current K: **180 mg/kg** (adequate)

> **Priority**: Address phosphorus deficiency with **bone meal** (200 kg/acre) + vermicompost as basal application.`,

  'fungal': `**Preventing Fungal Disease During Monsoon:**

🌧️ **Your Risk Assessment:**
- Disease Risk Level: **HIGH** (monsoon + current humidity 88%)
- Primary threats: Early Blight, Late Blight, Anthracnose

🛡️ **Prevention Strategy (Priority Order):**

**1. Cultural Controls** (Implement Immediately)
- ✂️ Prune lower branches for air circulation
- 📐 Maintain 45cm plant spacing (current: 25cm ⚠️)
- 🚿 Stop overhead irrigation — switch to drip
- 🧹 Remove fallen debris and infected leaves daily

**2. Preventive Sprays** (Start this week)
- **Week 1**: Copper Hydroxide 2g/L (organic, preventive)
- **Week 2**: Trichoderma viride soil drench (biocontrol)
- **Week 3**: Chlorothalonil 2g/L (if risk persists)
- Rotate fungicide groups to prevent resistance

**3. Monitoring Protocol**
- 📸 AI Leaf Scan every 3 days during active monsoon
- 📡 Set soil moisture alert threshold to 65%
- 🌡️ Monitor leaf wetness duration (target: <6 hours/day)

**4. Drainage**
- Ensure field drainage channels are clear
- Raised bed cultivation reduces root zone saturation

📅 **Weekly Schedule:**
| Day | Action |
|-----|--------|
| Mon | Scout + AI Scan |
| Wed | Preventive spray |
| Fri | Drainage check |
| Sun | Remove infected material |

> **Alert**: Rain forecast for Wednesday (60mm). Apply preventive spray by Tuesday evening.`,
};

function getAIResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('yellow') || lower.includes('turning')) return AI_RESPONSES['yellow'];
  if (lower.includes('water') || lower.includes('irrigation') || lower.includes('reduce')) return AI_RESPONSES['water'];
  if (lower.includes('organic') || lower.includes('fertilizer') || lower.includes('rice')) return AI_RESPONSES['organic'];
  if (lower.includes('fungal') || lower.includes('monsoon') || lower.includes('prevent') || lower.includes('disease')) return AI_RESPONSES['fungal'];

  return `Based on your farm data analysis:

📊 **Current Farm Status:**
- Health Score: 78/100
- Soil Moisture: 55% (optimal)
- Temperature: 28°C
- Active Alerts: 3

Your query about "${input}" is noted. Here are my recommendations:

1. **Monitor sensor readings** — Check the Sensors dashboard for real-time data
2. **Run an AI scan** — Upload leaf images for disease detection
3. **Review chemical schedule** — Check the Chemical Intelligence panel

Would you like me to provide more specific analysis on any of these areas?`;
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
    await new Promise((r) => setTimeout(r, 1500 + Math.random() * 1500));

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
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gradient-mesh">
      {/* Header */}
      <div className="px-4 lg:px-6 py-4 border-b border-[rgba(0,255,136,0.08)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00ff88] to-[#00e5ff] flex items-center justify-center">
            <Bot className="w-5 h-5 text-[#030806]" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#e8f5e9]">AGRIMIND Assistant</h1>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" style={{ boxShadow: '0 0 6px rgba(0,255,136,0.5)' }} />
              <span className="text-[11px] text-[#4a7c5c]">Online • References farm data in real-time</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00ff88] to-[#00e5ff] flex items-center justify-center flex-shrink-0 mt-1">
                  <Sparkles className="w-4 h-4 text-[#030806]" />
                </div>
              )}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.15)] text-[#e8f5e9]'
                    : 'glass-card text-[#e8f5e9]'
                }`}
              >
                <div className="text-sm leading-relaxed whitespace-pre-wrap prose-sm prose-invert"
                  dangerouslySetInnerHTML={{
                    __html: msg.content
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#00ff88]">$1</strong>')
                      .replace(/\n/g, '<br/>')
                      .replace(/`(.*?)`/g, '<code class="text-[#00e5ff] bg-[rgba(0,229,255,0.1)] px-1 rounded text-xs">$1</code>')
                      .replace(/\|(.*?)\|/g, '<span class="text-[#81c784]">|$1|</span>')
                  }}
                />
                <p className="text-[10px] text-[#4a7c5c] mt-2">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-[rgba(0,255,136,0.15)] flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-4 h-4 text-[#00ff88]" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            className="flex gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00ff88] to-[#00e5ff] flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-[#030806]" />
            </div>
            <div className="glass-card px-4 py-3 flex items-center gap-1">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      {messages.length <= 1 && (
        <div className="px-4 lg:px-6 pb-2">
          <div className="grid grid-cols-2 gap-2">
            {SUGGESTED_PROMPTS.map((prompt, i) => (
              <motion.button
                key={i}
                className="flex items-center gap-2 p-3 rounded-xl bg-[rgba(0,255,136,0.03)] border border-[rgba(0,255,136,0.08)] hover:border-[rgba(0,255,136,0.2)] transition-colors text-left"
                onClick={() => handleSend(prompt.text)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                whileHover={{ scale: 1.01 }}
              >
                <prompt.icon className="w-4 h-4 flex-shrink-0" style={{ color: prompt.color }} />
                <span className="text-xs text-[#81c784] line-clamp-1">{prompt.text}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 lg:px-6 py-4 border-t border-[rgba(0,255,136,0.08)]">
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[rgba(0,255,136,0.04)] border border-[rgba(0,255,136,0.1)] focus-within:border-[rgba(0,255,136,0.3)] transition-colors">
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask AGRIMIND anything about your farm..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-transparent text-sm text-[#e8f5e9] placeholder-[#4a7c5c] outline-none"
          />
          <motion.button
            onClick={() => handleSend()}
            className="w-9 h-9 rounded-lg bg-[#00ff88] flex items-center justify-center text-[#030806] disabled:opacity-30"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!inputValue.trim()}
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
