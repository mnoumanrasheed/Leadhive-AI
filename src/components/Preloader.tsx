import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { Sparkles, Check, Activity, ShieldCheck, Zap, Layers } from 'lucide-react'

interface PreloaderProps {
  onComplete?: () => void
  minDuration?: number
}

const pipelinePhases = [
  { step: '01', title: 'Ingesting Multi-Channel Stream', detail: 'WhatsApp · Instagram · Webchat', icon: Layers },
  { step: '02', title: 'Calibrating AI Qualification Engine', detail: 'Budget · Timing · Fit · Intent', icon: Zap },
  { step: '03', title: 'Synchronizing Sales Intelligence', detail: 'Priority Routing & CRM Handover', icon: ShieldCheck },
  { step: '04', title: 'LeadHive AI Systems Active', detail: 'Autonomous Frontline Ready', icon: Activity },
]

export function Preloader({ onComplete, minDuration = 2200 }: PreloaderProps) {
  const [progress, setProgress] = useState(0)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)

    if (reducedMotion) {
      setIsLoaded(true)
      onComplete?.()
      return
    }

    document.body.style.overflow = 'hidden'
    const startTime = performance.now()

    const interval = window.setInterval(() => {
      const elapsed = performance.now() - startTime
      const rawProgress = Math.min(100, Math.floor((elapsed / minDuration) * 100))
      
      setProgress((prev) => Math.max(prev, rawProgress))

      if (rawProgress >= 85) {
        setPhaseIndex(3)
      } else if (rawProgress >= 55) {
        setPhaseIndex(2)
      } else if (rawProgress >= 25) {
        setPhaseIndex(1)
      } else {
        setPhaseIndex(0)
      }

      if (elapsed >= minDuration) {
        window.clearInterval(interval)
        setProgress(100)
        setTimeout(() => {
          setIsLoaded(true)
          document.body.style.overflow = ''
          window.scrollTo(0, 0)
          onComplete?.()
        }, 360)
      }
    }, 20)

    return () => {
      window.clearInterval(interval)
      document.body.style.overflow = ''
    }
  }, [minDuration, onComplete, reducedMotion])

  const currentPhase = pipelinePhases[phaseIndex]
  const PhaseIcon = currentPhase.icon

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          className="preloader-overlay"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.03,
            filter: 'blur(12px)',
            transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
          }}
          aria-live="polite"
          aria-busy="true"
        >
          {/* Deep Cinematic Ambient Depth */}
          <div className="preloader-ambient" aria-hidden="true">
            <motion.div
              className="preloader-glow preloader-glow-cyan"
              animate={{
                scale: [1, 1.25, 1],
                opacity: [0.28, 0.45, 0.28],
                x: [0, 20, 0],
                y: [0, -15, 0],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="preloader-glow preloader-glow-blue"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.22, 0.38, 0.22],
                x: [0, -25, 0],
                y: [0, 18, 0],
              }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            />
            <div className="preloader-grid-plane" />
            <div className="preloader-radial-vignette" />
          </div>

          <div className="preloader-content-hud">
            {/* Top HUD Telemetry Pill */}
            <motion.div
              className="preloader-hud-top"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="hud-badge"><i /> LEAD INTELLIGENCE ENGINE</span>
              <span className="hud-metric">LATENCY: <b>14ms</b></span>
            </motion.div>

            {/* Central Futuristic Hive AI Emblem with Orbiting Radar Rings */}
            <div className="preloader-emblem-stage">
              {/* Outer Counter-Rotating Dashed Orbit */}
              <motion.div
                className="preloader-orbit-outer"
                animate={{ rotate: -360 }}
                transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
              />

              {/* Inner Clockwise Rotating Glowing Ring */}
              <motion.div
                className="preloader-orbit-inner"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              >
                <span className="orbit-node node-top" />
                <span className="orbit-node node-bottom" />
              </motion.div>

              {/* Ambient Core Halo Pulse */}
              <motion.div
                className="preloader-logo-halo"
                animate={{
                  scale: [1, 1.35, 1],
                  opacity: [0.4, 0.85, 0.4],
                }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* Main Futuristic Glass Hexagon Card */}
              <motion.div
                className="preloader-hex-card"
                initial={{ scale: 0.82, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Official Logo Mark */}
                <img
                  src="/LeadHive%20AI%20Logo.png"
                  alt="LeadHive AI"
                  className="preloader-logo-img"
                />
                
                {/* Scanning High-Intensity Laser Line */}
                <span className="preloader-scan-laser" />

                {/* Corner Tech Accents */}
                <span className="corner-accent corner-tl" />
                <span className="corner-accent corner-tr" />
                <span className="corner-accent corner-bl" />
                <span className="corner-accent corner-br" />
              </motion.div>
            </div>

            {/* Brand Title & Tagline */}
            <motion.div
              className="preloader-brand-block"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <div className="preloader-brand-title">
                <Sparkles className="brand-sparkle" />
                <span>LeadHive</span>
                <b>AI</b>
              </div>
              <p className="preloader-brand-subtitle">Autonomous Sales Intelligence Frontline</p>
            </motion.div>

            {/* Dynamic Real-Time Initialization HUD Card */}
            <motion.div
              className="preloader-phase-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <div className="phase-card-header">
                <span className="phase-indicator">
                  <PhaseIcon className="phase-icon" />
                  <span>PHASE {currentPhase.step}/04</span>
                </span>
                <span className="phase-pulse-dot" />
              </div>
              <strong className="phase-title">{currentPhase.title}</strong>
              <small className="phase-detail">{currentPhase.detail}</small>
            </motion.div>

            {/* High-Precision Luminous Progress Section */}
            <motion.div
              className="preloader-progress-hud"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {/* Stepped Segment Progress Bar */}
              <div className="preloader-progress-track">
                <motion.div
                  className="preloader-progress-fill"
                  style={{ width: `${progress}%` }}
                >
                  <span className="preloader-progress-beam" />
                  <span className="preloader-flare-glow" />
                </motion.div>
              </div>

              {/* Progress Footer Meta */}
              <div className="preloader-progress-meta">
                <div className="meta-left">
                  <span className="system-status-text">
                    <Check className="check-icon" /> Pipeline Synced
                  </span>
                </div>
                <div className="meta-right">
                  <span className="progress-numeric">{progress}<b>%</b></span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
