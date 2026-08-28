import { useState, useEffect } from 'react'
import { motion, useReducedMotion, AnimatePresence } from 'motion/react'
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowDown, 
  ArrowRight,
  Send, 
  Bot,
  MessageCircle,
  TrendingUp,
  Check
} from 'lucide-react'

// Step definitions for the cinematic 8.8-second loop
export type FlowPhase = 'inbound' | 'qualifying' | 'scored' | 'handover'

export function HeroPipelineVisual() {
  const reducedMotion = useReducedMotion()
  const [phase, setPhase] = useState<FlowPhase>('inbound')
  const [scoreCount, setScoreCount] = useState(70)

  // Controlled 8.8s continuous lifecycle loop
  useEffect(() => {
    if (reducedMotion) {
      setPhase('handover')
      setScoreCount(96)
      return
    }

    const t1 = setTimeout(() => setPhase('qualifying'), 2200)
    const t2 = setTimeout(() => {
      setPhase('scored')
      // Animate score count up
      let s = 72
      const interval = setInterval(() => {
        s += 3
        if (s >= 96) {
          setScoreCount(96)
          clearInterval(interval)
        } else {
          setScoreCount(s)
        }
      }, 50)
    }, 4200)
    const t3 = setTimeout(() => setPhase('handover'), 6500)
    const t4 = setTimeout(() => {
      setPhase('inbound')
      setScoreCount(72)
    }, 8800)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [phase === 'inbound', reducedMotion])

  return (
    <div className="flow-visual-container" aria-label="Lead Intelligence Flow">
      {/* Top Subtle Label */}
      <div className="flow-container-header">
        <div className="flow-live-pill">
          <span className="live-pulse-dot" />
          <span>LIVE QUALIFICATION PIPELINE</span>
        </div>
        <span className="flow-channel-tag">WhatsApp · IG · Messenger · Web</span>
      </div>

      <div className="flow-stages-wrapper">
        
        {/* =========================================================
            STAGE 1: INCOMING CONVERSATION (One clean floating card)
            ========================================================= */}
        <div className="flow-stage stage-incoming">
          <motion.div 
            className="single-message-card"
            initial={reducedMotion ? false : { opacity: 0, y: -16, scale: 0.96 }}
            animate={
              phase === 'inbound' 
                ? { opacity: 1, y: 0, scale: 1 } 
                : phase === 'qualifying'
                ? { opacity: 0.9, y: 4, scale: 0.98 }
                : { opacity: 0.45, y: 8, scale: 0.95 }
            }
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="msg-card-top">
              <div className="msg-sender">
                <span className="channel-icon-pill wa">
                  <MessageCircle size={12} />
                  <span>WhatsApp</span>
                </span>
                <strong>Jordan Blake</strong>
              </div>
              <span className="msg-time">Just now</span>
            </div>
            <p className="msg-quote">“Need pricing for 20 locations starting next month.”</p>
          </motion.div>
        </div>

        {/* Animated Connector 1 */}
        <div className="flow-connector-strip">
          <div className="flow-line" />
          <motion.div 
            className={`flow-particle ${phase === 'inbound' || phase === 'qualifying' ? 'active' : ''}`}
            animate={
              phase === 'inbound' || phase === 'qualifying'
                ? { top: ['0%', '100%'], opacity: [0, 1, 1, 0] }
                : { opacity: 0 }
            }
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* =========================================================
            STAGE 2: AI QUALIFICATION CORE (The Visual Focal Point)
            ========================================================= */}
        <div className={`flow-stage stage-core ${phase === 'qualifying' || phase === 'scored' ? 'core-active' : ''}`}>
          <div className="ai-core-capsule">
            <div className="ai-core-orbit" aria-hidden="true" />
            
            <div className="ai-core-inner">
              <div className="ai-brand-badge">
                <Bot size={15} className="bot-icon" />
                <span>LeadHive AI</span>
              </div>
              <strong className="ai-core-heading">AI Qualification</strong>
              <span className="ai-status-indicator">
                {phase === 'inbound' && 'Listening for intent signals...'}
                {phase === 'qualifying' && 'Extracting buying intent & budget...'}
                {phase === 'scored' && 'Commercial criteria validated'}
                {phase === 'handover' && 'Opportunity routed to sales'}
              </span>
            </div>

            {/* Emerging AI Signal Pills */}
            <div className="ai-signals-cluster">
              <motion.div 
                className="ai-signal-badge"
                animate={
                  phase === 'qualifying' || phase === 'scored' || phase === 'handover'
                    ? { opacity: 1, scale: 1, y: 0 }
                    : { opacity: 0, scale: 0.9, y: 6 }
                }
                transition={{ duration: 0.35, delay: 0.1 }}
              >
                <Check size={11} className="signal-check" />
                <span>Intent 96%</span>
              </motion.div>

              <motion.div 
                className="ai-signal-badge"
                animate={
                  phase === 'qualifying' || phase === 'scored' || phase === 'handover'
                    ? { opacity: 1, scale: 1, y: 0 }
                    : { opacity: 0, scale: 0.9, y: 6 }
                }
                transition={{ duration: 0.35, delay: 0.25 }}
              >
                <Check size={11} className="signal-check" />
                <span>Budget Confirmed</span>
              </motion.div>

              <motion.div 
                className="ai-signal-badge"
                animate={
                  phase === 'qualifying' || phase === 'scored' || phase === 'handover'
                    ? { opacity: 1, scale: 1, y: 0 }
                    : { opacity: 0, scale: 0.9, y: 6 }
                }
                transition={{ duration: 0.35, delay: 0.4 }}
              >
                <Check size={11} className="signal-check" />
                <span>20 UK Sites</span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Animated Connector 2 */}
        <div className="flow-connector-strip">
          <div className="flow-line" />
          <motion.div 
            className={`flow-particle ${phase === 'scored' || phase === 'handover' ? 'active' : ''}`}
            animate={
              phase === 'scored' || phase === 'handover'
                ? { top: ['0%', '100%'], opacity: [0, 1, 1, 0] }
                : { opacity: 0 }
            }
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* =========================================================
            STAGE 3: QUALIFIED OPPORTUNITY / SALES HANDOVER
            ========================================================= */}
        <div className="flow-stage stage-opportunity">
          <motion.div 
            className={`opportunity-dominant-card ${phase === 'scored' || phase === 'handover' ? 'card-active' : ''}`}
            initial={reducedMotion ? false : { opacity: 0.4, scale: 0.95 }}
            animate={
              phase === 'scored' || phase === 'handover'
                ? { opacity: 1, scale: 1, y: 0 }
                : { opacity: 0.35, scale: 0.97, y: 4 }
            }
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Opportunity Card Header */}
            <div className="opp-header">
              <div className="opp-tag-pill">
                <Sparkles size={12} className="sparkle-icon" />
                <span>QUALIFIED OPPORTUNITY</span>
              </div>
              <span className="opp-live-time">Instant Handover</span>
            </div>

            {/* Main Lead Info Row */}
            <div className="opp-profile-row">
              <div className="opp-avatar">JB</div>
              <div className="opp-identity">
                <h4 className="opp-name">Jordan Blake</h4>
                <p className="opp-deal">Enterprise Rollout · 20 Locations</p>
              </div>

              <div className="opp-score-box">
                <strong className="opp-score-num">{phase === 'inbound' || phase === 'qualifying' ? 96 : scoreCount}</strong>
                <span className="opp-score-label">High Intent</span>
              </div>
            </div>

            {/* Handover Status Action Bar */}
            <div className="opp-status-footer">
              <div className={`status-pill ${phase === 'handover' ? 'pill-success' : ''}`}>
                <CheckCircle2 size={13} className="status-icon" />
                <span>Sales Ready</span>
              </div>

              <div className="status-routed-indicator">
                <span>Routed to Sales</span>
                <ArrowRight size={13} className="routed-arrow" />
              </div>
            </div>
          </motion.div>
        </div>

      </div>

      {/* Subtle Bottom Outcome Bar */}
      <div className="flow-container-footer">
        <div className="footer-step-flow">
          <span>Inbound Message</span>
          <span className="footer-arrow">→</span>
          <span>AI Qualification</span>
          <span className="footer-arrow">→</span>
          <strong className="footer-highlight">Hot Lead Handover</strong>
        </div>
      </div>
    </div>
  )
}
