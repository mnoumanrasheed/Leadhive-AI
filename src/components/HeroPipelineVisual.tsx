import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { ArrowRight, Check, Sparkles, Target, Zap, ShieldCheck } from 'lucide-react'

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.22 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.09-.39-.13-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.78 2.71 4.3 3.8 2.53 1.09 2.53.73 2.98.69.46-.05 1.47-.6 1.68-1.18.2-.59.2-1.09.14-1.19-.06-.1-.22-.16-.47-.28z"/>
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  )
}

function WebChatIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      <circle cx="9" cy="10" r="1" fill="currentColor"/>
      <circle cx="12" cy="10" r="1" fill="currentColor"/>
      <circle cx="15" cy="10" r="1" fill="currentColor"/>
    </svg>
  )
}

const channels = [
  {
    id: 'whatsapp',
    channel: 'WhatsApp',
    sender: 'Sarah Jenkins',
    message: 'Pricing for 20 locations?',
    time: 'Just now',
    icon: WhatsAppIcon,
    accent: '#22c55e',
    accentBg: 'rgba(34, 197, 94, 0.15)',
  },
  {
    id: 'instagram',
    channel: 'Instagram',
    sender: 'David Vance',
    message: 'Can we launch next month?',
    time: '2m ago',
    icon: InstagramIcon,
    accent: '#ec4899',
    accentBg: 'rgba(236, 72, 153, 0.15)',
  },
  {
    id: 'web',
    channel: 'Web Chat',
    sender: 'Elena Rostova',
    message: 'Enterprise SLA & onboarding',
    time: '4m ago',
    icon: WebChatIcon,
    accent: '#38bdf8',
    accentBg: 'rgba(56, 189, 248, 0.15)',
  },
]

type Phase = 'ingesting' | 'understanding' | 'qualifying' | 'handover'

export function HeroPipelineVisual() {
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(containerRef, { amount: 0.15 })
  const reducedMotion = useReducedMotion()
  const [activeChannelIndex, setActiveChannelIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('ingesting')
  const [liveScore, setLiveScore] = useState(72)

  useEffect(() => {
    if (reducedMotion) {
      setPhase('handover')
      setLiveScore(92)
      return
    }

    if (!inView) return

    // Phase 1: Ingest signal from active channel (0ms)
    setPhase('ingesting')
    setLiveScore(72)

    // Phase 2: AI Core processing intent (1300ms)
    const t1 = setTimeout(() => {
      setPhase('understanding')
      setLiveScore(81)
    }, 1300)

    // Phase 3: AI Qualification checks activating (2700ms)
    const t2 = setTimeout(() => {
      setPhase('qualifying')
      setLiveScore(92)
    }, 2700)

    // Phase 4: Qualified opportunity delivered to Sales-ready card (4000ms)
    const t3 = setTimeout(() => {
      setPhase('handover')
    }, 4000)

    // Loop to next channel (5600ms)
    const t4 = setTimeout(() => {
      setActiveChannelIndex((prev) => (prev + 1) % channels.length)
    }, 5600)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [activeChannelIndex, inView, reducedMotion])

  const activeChannel = channels[activeChannelIndex]
  const isIngesting = phase === 'ingesting'
  const isUnderstanding = phase === 'understanding'
  const isQualifying = phase === 'qualifying'
  const isHandover = phase === 'handover'

  return (
    <div className="hero-pipeline-wrapper" ref={containerRef} aria-label="LeadHive AI real-time conversation qualification pipeline">
      {/* Top Header Bar */}
      <div className="hero-pipeline-topbar">
        <div className="pipeline-live-status">
          <span className="live-radar-dot" />
          <strong>LIVE INTELLIGENCE STREAM</strong>
        </div>
        <div className="pipeline-channels-badge">
          <span className="channels-dot" />
          <span>All frontlines connected</span>
        </div>
      </div>

      {/* Main 3-Part Composition Stage */}
      <div className="hero-pipeline-stage">
        
        {/* ========================================================
            PART 1: LEFT - Compact Incoming Channel Cards
           ======================================================== */}
        <div className="pipeline-channel-column" aria-label="Incoming multi-channel conversations">
          <div className="column-label">
            <span>INCOMING SIGNALS</span>
            <small>Real-time</small>
          </div>

          <div className="channel-cards-stack">
            {channels.map((item, index) => {
              const isActive = activeChannelIndex === index
              const Icon = item.icon

              return (
                <motion.div
                  key={item.id}
                  className={`pipeline-channel-card ${isActive ? 'is-active' : ''}`}
                  animate={
                    !reducedMotion && isActive
                      ? {
                          x: isIngesting ? [0, 4, 0] : 0,
                          borderColor: 'rgba(34, 211, 238, 0.45)',
                          boxShadow: '0 8px 24px rgba(2, 6, 23, 0.6), 0 0 16px rgba(34, 211, 238, 0.15)',
                        }
                      : {
                          x: 0,
                          borderColor: 'rgba(255, 255, 255, 0.07)',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                        }
                  }
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  <div className="channel-card-top">
                    <span className="channel-icon-pill" style={{ color: item.accent, backgroundColor: item.accentBg }}>
                      <Icon />
                    </span>
                    <span className="channel-name">{item.channel}</span>
                    <span className="channel-time">{item.time}</span>
                  </div>

                  <p className="channel-message-text">
                    "{item.message}"
                  </p>

                  {/* Active Signal Source Indicator */}
                  {isActive && (
                    <motion.div
                      className="channel-active-indicator"
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="signal-blip" style={{ backgroundColor: item.accent }} />
                      <small>Streaming to AI</small>
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>

          <div className="channel-stream-counter">
            <span className="stream-ticker">+9,997 more conversations parsed</span>
            <i />
          </div>
        </div>

        {/* ========================================================
            CONNECTOR 1: Left Channel to Central AI Core
           ======================================================== */}
        <div className="pipeline-connector-left" aria-hidden="true">
          <svg className="connector-svg" viewBox="0 0 100 240" preserveAspectRatio="none">
            <path
              className="connector-track"
              d="M 10 45 C 55 45, 45 120, 95 120"
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="2"
            />
            <path
              className="connector-track"
              d="M 10 120 C 55 120, 45 120, 95 120"
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="2"
            />
            <path
              className="connector-track"
              d="M 10 195 C 55 195, 45 120, 95 120"
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="2"
            />

            {/* Active Travelling Signal Beam */}
            {!reducedMotion && inView && isIngesting && (
              <motion.circle
                key={`sig-left-${activeChannelIndex}`}
                r="4.5"
                fill="#22d3ee"
                filter="drop-shadow(0 0 6px #22d3ee)"
                initial={{ offsetDistance: '0%', opacity: 0 }}
                animate={{
                  offsetDistance: ['0%', '100%'],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{ duration: 1.1, ease: 'easeInOut' }}
                style={{
                  offsetPath: `path("${
                    activeChannelIndex === 0
                      ? 'M 10 45 C 55 45, 45 120, 95 120'
                      : activeChannelIndex === 1
                      ? 'M 10 120 C 55 120, 45 120, 95 120'
                      : 'M 10 195 C 55 195, 45 120, 95 120'
                  }")`,
                }}
              />
            )}
          </svg>
        </div>

        {/* ========================================================
            PART 2: CENTER - Large Majestic LeadHive AI Core
           ======================================================== */}
        <div className="pipeline-core-column" aria-label="LeadHive AI Intent and Qualification Engine">
          <div className="ai-core-container">
            {/* Outer Slow Rotating Dashed Ring */}
            <motion.div
              className="ai-core-ring-outer"
              animate={!reducedMotion && inView ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />

            {/* Inner Counter-Rotating Pulse Ring */}
            <motion.div
              className="ai-core-ring-inner"
              animate={
                !reducedMotion && inView
                  ? {
                      rotate: -360,
                      scale: isUnderstanding || isQualifying ? [1, 1.06, 1] : 1,
                    }
                  : { rotate: 0 }
              }
              transition={{
                rotate: { duration: 12, repeat: Infinity, ease: 'linear' },
                scale: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
              }}
            />

            {/* Radiant Ambient Core Halo */}
            <motion.div
              className="ai-core-halo"
              animate={
                !reducedMotion && inView
                  ? {
                      scale: isUnderstanding || isQualifying ? [1, 1.25, 1] : [1, 1.1, 1],
                      opacity: isUnderstanding || isQualifying ? [0.45, 0.85, 0.45] : [0.25, 0.4, 0.25],
                    }
                  : { opacity: 0.3 }
              }
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Centerpiece Core Hexagon Emblem */}
            <motion.div
              className={`ai-core-emblem ${isUnderstanding || isQualifying ? 'is-processing' : ''}`}
              animate={
                !reducedMotion && (isUnderstanding || isQualifying)
                  ? { scale: [1, 1.05, 1], boxShadow: ['0 0 20px rgba(34,211,238,0.4)', '0 0 35px rgba(34,211,238,0.7)', '0 0 20px rgba(34,211,238,0.4)'] }
                  : { scale: 1, boxShadow: '0 0 20px rgba(34,211,238,0.3)' }
              }
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="emblem-inner-glow" />
              <Sparkles className="emblem-sparkle-icon" />
              <span className="emblem-laser-scan" />
            </motion.div>

            {/* Engine Identity & Live Status */}
            <div className="ai-core-labels">
              <strong className="core-brand-name">LeadHive AI</strong>
              <motion.span
                key={phase}
                className="core-status-pill"
                initial={reducedMotion ? false : { opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Zap className="status-zap" />
                {isIngesting && 'Signal Ingested'}
                {isUnderstanding && 'Understanding Intent...'}
                {isQualifying && 'Qualifying Commercial Fit'}
                {isHandover && 'Opportunity Prioritized'}
              </motion.span>
            </div>

            {/* 3 Sequential Qualification Tags */}
            <div className="ai-qualification-matrix">
              {[
                { name: 'Budget Fit', key: 'budget' },
                { name: 'Timeline', key: 'timeline' },
                { name: 'Decision Scope', key: 'scope' },
              ].map((item, index) => {
                const isChecked =
                  isHandover ||
                  (isQualifying && index <= 2) ||
                  (isUnderstanding && index === 0)

                return (
                  <motion.div
                    key={item.key}
                    className={`matrix-badge ${isChecked ? 'is-verified' : ''}`}
                    animate={{
                      opacity: isChecked ? 1 : 0.45,
                      scale: isChecked ? 1 : 0.96,
                      backgroundColor: isChecked ? 'rgba(6, 182, 212, 0.12)' : 'rgba(15, 23, 42, 0.4)',
                      borderColor: isChecked ? 'rgba(34, 211, 238, 0.4)' : 'rgba(255, 255, 255, 0.08)',
                    }}
                    transition={{ duration: 0.35, delay: index * 0.1 }}
                  >
                    <span className="badge-check-circle">
                      {isChecked ? <Check className="check-svg" /> : <span className="uncheck-dot" />}
                    </span>
                    <span>{item.name}</span>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ========================================================
            CONNECTOR 2: Central AI Core to Right Output Card
           ======================================================== */}
        <div className="pipeline-connector-right" aria-hidden="true">
          <svg className="connector-svg" viewBox="0 0 100 240" preserveAspectRatio="none">
            <path
              className="connector-track"
              d="M 5 120 C 50 120, 50 120, 95 120"
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="2"
            />

            {/* Active Travelling Signal Beam to Output */}
            {!reducedMotion && inView && (isQualifying || isHandover) && (
              <motion.circle
                key={`sig-right-${activeChannelIndex}-${phase}`}
                r="4.5"
                fill="#22d3ee"
                filter="drop-shadow(0 0 6px #22d3ee)"
                initial={{ offsetDistance: '0%', opacity: 0 }}
                animate={{
                  offsetDistance: ['0%', '100%'],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{ duration: 0.95, ease: 'easeInOut' }}
                style={{
                  offsetPath: 'path("M 5 120 C 50 120, 50 120, 95 120")',
                }}
              />
            )}
          </svg>
        </div>

        {/* ========================================================
            PART 3: RIGHT - Premium Sales-Ready Output Card
           ======================================================== */}
        <div className="pipeline-output-column" aria-label="Prioritized qualified sales output">
          <div className="column-label">
            <span>QUALIFIED RESULT</span>
            <small>Sales Ready</small>
          </div>

          <motion.div
            className={`pipeline-sales-card ${isHandover ? 'is-highlighted' : ''}`}
            animate={
              !reducedMotion && isHandover
                ? {
                    y: [0, -3, 0],
                    borderColor: 'rgba(34, 211, 238, 0.55)',
                    boxShadow: '0 16px 36px rgba(2, 6, 23, 0.7), 0 0 24px rgba(34, 211, 238, 0.22)',
                  }
                : {
                    y: 0,
                    borderColor: 'rgba(34, 211, 238, 0.22)',
                    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.4)',
                  }
            }
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {/* Card Header Status */}
            <div className="sales-card-header">
              <div className="sales-status-badge">
                <Target className="target-icon" />
                <span>SALES-READY</span>
              </div>
              <span className="sales-live-dot" />
            </div>

            {/* Volume Metric Display */}
            <div className="sales-metric-row">
              <strong>150</strong>
              <div>
                <span>priority leads</span>
                <small>Ranked by commercial intent</small>
              </div>
            </div>

            {/* Specific Lead Intelligence Detail */}
            <div className="sales-lead-profile">
              <div className="lead-avatar-gradient">AC</div>
              <div className="lead-meta">
                <strong>Amelia Carter</strong>
                <span>20-site rollout · next month</span>
              </div>

              {/* Dynamic Intent Score Counter */}
              <div className="lead-score-badge">
                <small>FIT SCORE</small>
                <motion.strong
                  key={liveScore}
                  initial={reducedMotion ? false : { scale: 0.88, opacity: 0.6 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {liveScore}
                </motion.strong>
              </div>
            </div>

            {/* Quick Context Action */}
            <div className="sales-card-action">
              <span>Full context & buying signals attached</span>
              <ArrowRight className="arrow-icon" />
            </div>
          </motion.div>
        </div>

      </div>

      {/* Bottom Visual Caption Bar */}
      <div className="hero-pipeline-footer">
        <span className="footer-metric">
          <b>10,000+</b> conversations parsed
        </span>
        <span className="footer-divider" />
        <span className="footer-metric highlighted">
          <ShieldCheck className="shield-icon" />
          <b>150</b> high-intent sales opportunities delivered
        </span>
      </div>
    </div>
  )
}
