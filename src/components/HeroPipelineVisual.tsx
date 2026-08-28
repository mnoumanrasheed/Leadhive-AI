import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  ArrowDown, 
  Calendar, 
  Send, 
  TrendingUp, 
  Play, 
  Pause,
  Layers,
  Bot
} from 'lucide-react'

// Step definitions for the loop
export type PipelinePhase = 'inbound' | 'analyzing' | 'scoring' | 'handover'

const PHASES: { id: PipelinePhase; label: string; duration: number }[] = [
  { id: 'inbound', label: '1. Inbound Stream', duration: 3200 },
  { id: 'analyzing', label: '2. AI Qualification', duration: 3400 },
  { id: 'scoring', label: '3. Intent Scoring', duration: 3200 },
  { id: 'handover', label: '4. Sales Handover', duration: 4200 },
]

export function HeroPipelineVisual() {
  const reducedMotion = useReducedMotion()
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  const activePhase = PHASES[currentPhaseIndex].id

  // Automated cinematic loop
  useEffect(() => {
    if (!isPlaying || reducedMotion) return

    const timer = setTimeout(() => {
      setCurrentPhaseIndex((prev) => (prev + 1) % PHASES.length)
    }, PHASES[currentPhaseIndex].duration)

    return () => clearTimeout(timer)
  }, [currentPhaseIndex, isPlaying, reducedMotion])

  return (
    <div className="pipeline-visual-panel" aria-label="LeadHive Conversation Intelligence Pipeline Visual">
      {/* Panel Top Navigation & Status Bar */}
      <div className="pipeline-panel-header">
        <div className="pipeline-header-left">
          <div className="pipeline-live-indicator">
            <span className="live-core-dot" />
            <span className="live-pulse-wave" />
          </div>
          <div className="pipeline-title-group">
            <strong className="pipeline-title">Omnichannel Qualification Flow</strong>
            <span className="pipeline-subtitle">Autonomous Real-Time Lead Ingestion</span>
          </div>
        </div>

        <div className="pipeline-header-right">
          <div className="pipeline-latency-badge">
            <Zap size={11} className="latency-icon" />
            <span>0.3s Handover</span>
          </div>
          <button 
            type="button" 
            className="pipeline-playback-btn"
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? "Pause animation" : "Resume animation"}
            aria-label={isPlaying ? "Pause animation" : "Resume animation"}
          >
            {isPlaying ? <Pause size={11} /> : <Play size={11} />}
          </button>
        </div>
      </div>

      {/* Pipeline Phase Stepper Indicator */}
      <div className="pipeline-stepper-bar">
        {PHASES.map((p, idx) => (
          <button
            key={p.id}
            type="button"
            className={`stepper-step ${idx === currentPhaseIndex ? 'active' : ''} ${idx < currentPhaseIndex ? 'completed' : ''}`}
            onClick={() => {
              setCurrentPhaseIndex(idx)
              setIsPlaying(false)
            }}
          >
            <span className="stepper-dot" />
            <span className="stepper-label">{p.label}</span>
          </button>
        ))}
      </div>

      {/* Main Flow Stage Canvas */}
      <div className="pipeline-stage-body">
        
        {/* =========================================================
            ZONE 1: OMNICHANNEL INBOUND SOURCES
            ========================================================= */}
        <div className="pipeline-zone zone-sources">
          <div className="zone-header">
            <span className="zone-tag">ZONE 1 · INBOUND CHANNELS</span>
            <span className="zone-meta">4 Live Sources Connected</span>
          </div>

          <div className="sources-pills-row">
            <div className={`source-channel-pill wa ${activePhase === 'inbound' ? 'active-emitting' : ''}`}>
              <i className="source-icon wa">◔</i>
              <span>WhatsApp</span>
              <span className="source-status-pulse green" />
            </div>
            <div className={`source-channel-pill ig ${activePhase === 'inbound' ? 'active-emitting' : ''}`}>
              <i className="source-icon ig">◎</i>
              <span>Instagram</span>
              <span className="source-status-pulse pink" />
            </div>
            <div className={`source-channel-pill fb ${activePhase === 'inbound' ? 'active-emitting' : ''}`}>
              <i className="source-icon fb">f</i>
              <span>Messenger</span>
              <span className="source-status-pulse blue" />
            </div>
            <div className={`source-channel-pill web ${activePhase === 'inbound' ? 'active-emitting' : ''}`}>
              <i className="source-icon web">↗</i>
              <span>Website Chat</span>
              <span className="source-status-pulse cyan" />
            </div>
          </div>

          {/* Inbound Message Snippets */}
          <div className="inbound-snippets-container">
            {/* High Intent WhatsApp Card */}
            <motion.div 
              className={`message-bubble-card whatsapp-card ${activePhase === 'inbound' ? 'entering' : activePhase === 'analyzing' ? 'in-engine' : activePhase === 'scoring' ? 'scored-dominant' : 'resolved-handover'}`}
              animate={
                activePhase === 'inbound' 
                  ? { y: 0, opacity: 1, scale: 1 } 
                  : activePhase === 'analyzing'
                  ? { y: 16, opacity: 0.95, scale: 0.98 }
                  : activePhase === 'scoring'
                  ? { y: 24, opacity: 1, scale: 1.02 }
                  : { y: 32, opacity: 0.2, scale: 0.95 }
              }
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="msg-header">
                <div className="msg-author">
                  <span className="author-badge wa">WA</span>
                  <strong>Jordan Blake</strong>
                  <span className="author-time">Just now</span>
                </div>
                <span className="msg-channel-tag">WhatsApp Business</span>
              </div>
              <p className="msg-text">“Hi, need urgent pricing to deploy across 20 UK retail branches next month.”</p>
            </motion.div>

            {/* Mid Intent Instagram Card */}
            <motion.div 
              className={`message-bubble-card instagram-card ${activePhase === 'scoring' ? 'de-emphasized' : ''}`}
              animate={
                activePhase === 'inbound' 
                  ? { y: 0, opacity: 0.92, scale: 0.98 } 
                  : activePhase === 'analyzing'
                  ? { y: 12, opacity: 0.85, scale: 0.95 }
                  : activePhase === 'scoring'
                  ? { y: 16, opacity: 0.45, scale: 0.92 }
                  : { y: 20, opacity: 0.1, scale: 0.9 }
              }
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="msg-header">
                <div className="msg-author">
                  <span className="author-badge ig">IG</span>
                  <strong>Mia Thorne</strong>
                </div>
                <span className="msg-channel-tag">Instagram DM</span>
              </div>
              <p className="msg-text">“Can I book an automated routing demo for my 5-person team?”</p>
            </motion.div>

            {/* Low Intent Web Chat Card */}
            <motion.div 
              className="message-bubble-card web-card"
              animate={
                activePhase === 'inbound' 
                  ? { y: 0, opacity: 0.85, scale: 0.96 } 
                  : activePhase === 'analyzing'
                  ? { y: 8, opacity: 0.65, scale: 0.92 }
                  : { y: 12, opacity: 0.15, scale: 0.88 }
              }
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="msg-header">
                <div className="msg-author">
                  <span className="author-badge web">WEB</span>
                  <strong>Guest #489</strong>
                </div>
                <span className="msg-channel-tag">Docs Chat</span>
              </div>
              <p className="msg-text">“Where can I see the API documentation?”</p>
            </motion.div>
          </div>
        </div>

        {/* Guided Connecting Stream Lines */}
        <div className="pipeline-flow-stream" aria-hidden="true">
          <div className="stream-line line-left" />
          <div className="stream-line line-center" />
          <div className="stream-line line-right" />
          <div className={`stream-data-particle ${activePhase === 'inbound' || activePhase === 'analyzing' ? 'anim-flow' : ''}`} />
        </div>

        {/* =========================================================
            ZONE 2: AI QUALIFICATION ENGINE
            ========================================================= */}
        <div className={`pipeline-zone zone-engine ${activePhase === 'analyzing' ? 'engine-active-pulse' : ''}`}>
          <div className="engine-card">
            {/* Active Scanning Laser Line */}
            <div className={`engine-scan-line ${activePhase === 'analyzing' ? 'scanning' : ''}`} />

            <div className="engine-header-row">
              <div className="engine-core-title">
                <div className="engine-icon-wrap">
                  <Bot size={15} className="engine-bot-icon" />
                  <span className="engine-glow-halo" />
                </div>
                <div>
                  <strong>AI Qualification Engine</strong>
                  <span className="engine-status-text">
                    {activePhase === 'inbound' && 'Awaiting incoming streams...'}
                    {activePhase === 'analyzing' && 'Analyzing commercial intent & budget signals...'}
                    {activePhase === 'scoring' && 'Calculating conversion probability...'}
                    {activePhase === 'handover' && 'Handover dispatched in 0.3s'}
                  </span>
                </div>
              </div>

              <div className="engine-model-badge">
                <Sparkles size={11} />
                <span>LeadHive NLP v4</span>
              </div>
            </div>

            {/* Extracted Neural Intent Badges */}
            <div className="engine-signals-grid">
              <div className={`signal-chip ${activePhase === 'analyzing' || activePhase === 'scoring' || activePhase === 'handover' ? 'signal-detected' : ''}`}>
                <span className="signal-key">Commercial Intent:</span>
                <strong className="signal-val">Enterprise Rollout (96%)</strong>
              </div>
              <div className={`signal-chip ${activePhase === 'analyzing' || activePhase === 'scoring' || activePhase === 'handover' ? 'signal-detected' : ''}`}>
                <span className="signal-key">Budget Confirmed:</span>
                <strong className="signal-val">£42,000 ARR</strong>
              </div>
              <div className={`signal-chip ${activePhase === 'analyzing' || activePhase === 'scoring' || activePhase === 'handover' ? 'signal-detected' : ''}`}>
                <span className="signal-key">Decision Authority:</span>
                <strong className="signal-val">VP Sales Operations</strong>
              </div>
              <div className={`signal-chip ${activePhase === 'analyzing' || activePhase === 'scoring' || activePhase === 'handover' ? 'signal-detected' : ''}`}>
                <span className="signal-key">Urgency:</span>
                <strong className="signal-val">Immediate (30 Days)</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Guided Connecting Stream Lines */}
        <div className="pipeline-flow-stream" aria-hidden="true">
          <div className="stream-line line-center" />
          <div className={`stream-data-particle ${activePhase === 'scoring' || activePhase === 'handover' ? 'anim-flow' : ''}`} />
        </div>

        {/* =========================================================
            ZONE 3: INTENT SCORING & LEAD FILTERING
            ========================================================= */}
        <div className="pipeline-zone zone-scoring">
          <div className="scoring-outcomes-grid">
            {/* Low Intent: Filtered Out */}
            <div className={`score-badge-card low-score ${activePhase === 'scoring' || activePhase === 'handover' ? 'dimmed-out' : ''}`}>
              <div className="score-top">
                <span className="score-num">43 / 100</span>
                <span className="score-tag">Low Intent</span>
              </div>
              <span className="score-action">Auto-FAQ Routed</span>
            </div>

            {/* Mid Intent: Automated Nurture */}
            <div className={`score-badge-card mid-score ${activePhase === 'scoring' || activePhase === 'handover' ? 'secondary-nurture' : ''}`}>
              <div className="score-top">
                <span className="score-num">76 / 100</span>
                <span className="score-tag">SMB Request</span>
              </div>
              <span className="score-action">Auto-Nurture Sequence</span>
            </div>

            {/* High Intent: Prioritized Winner */}
            <div className={`score-badge-card high-score ${activePhase === 'scoring' || activePhase === 'handover' ? 'highlight-winner' : ''}`}>
              <div className="score-top">
                <span className="score-num winner-num">96 / 100</span>
                <span className="score-tag winner-tag">High Commercial Intent</span>
              </div>
              <span className="score-action winner-action">Instant Sales Rep Handover</span>
            </div>
          </div>
        </div>

        {/* Arrow to Final Handover */}
        <div className="pipeline-handover-pointer" aria-hidden="true">
          <ArrowDown size={14} className="handover-down-arrow" />
        </div>

        {/* =========================================================
            ZONE 4: SALES HANDOVER OUTPUT (FINAL OUTCOME)
            ========================================================= */}
        <div className={`pipeline-zone zone-handover ${activePhase === 'handover' ? 'handover-stage-active' : ''}`}>
          <div className="handover-lead-card">
            <div className="handover-card-header">
              <div className="handover-badge-pill">
                <CheckCircle2 size={13} className="check-icon-green" />
                <span>SALES-READY OPPORTUNITY</span>
              </div>
              <div className="handover-timestamp">0.3s Handover Delivered</div>
            </div>

            <div className="handover-profile-row">
              <div className="lead-avatar-wrap">
                <div className="lead-avatar">JB</div>
                <span className="channel-corner-icon wa">◔</span>
              </div>

              <div className="lead-identity">
                <div className="lead-name-row">
                  <strong className="lead-name">Jordan Blake</strong>
                  <span className="lead-verified-pill">Verified Decision Maker</span>
                </div>
                <p className="lead-org">VP Sales Operations · Nexus Retail (20 UK Sites)</p>
              </div>

              <div className="lead-deal-size">
                <span className="deal-label">Estimated Deal</span>
                <strong className="deal-val">£42,000 ARR</strong>
              </div>
            </div>

            {/* Instant Sales Dispatch Timeline */}
            <div className="handover-actions-strip">
              <div className="action-pill green-glow">
                <CheckCircle2 size={12} />
                <span>Intent Scored 96/100</span>
              </div>
              <div className="action-pill blue-glow">
                <Calendar size={12} />
                <span>Demo Meeting Auto-Booked</span>
              </div>
              <div className="action-pill cyan-glow">
                <Send size={12} />
                <span>Routed to AE (Sarah Lin) via Slack</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Panel Bottom Footer Bar */}
      <div className="pipeline-panel-footer">
        <div className="footer-metric-pill">
          <TrendingUp size={12} className="metric-icon" />
          <span>Conversion Lift: <strong>+318%</strong></span>
        </div>
        <div className="footer-metric-pill">
          <Layers size={12} className="metric-icon" />
          <span>Zero Human Triage Delay</span>
        </div>
        <div className="footer-workflow-tag">
          Omnichannel → AI Qualify → Intent Score → Instant Handover
        </div>
      </div>
    </div>
  )
}
