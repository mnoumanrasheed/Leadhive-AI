import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowRight, ChevronRight, Sparkles, Zap, ShieldCheck, TrendingUp, Cpu, Layout, Flame } from 'lucide-react'
import { ProductDemo } from './ProductDemo'
import { HeroPipelineVisual } from './HeroPipelineVisual'

// Smooth one-time count-up animation component
function AnimatedCounter({ value, suffix = '', duration = 1.6 }: { value: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) {
      setCount(value)
      return
    }

    let start = 0
    const startTime = performance.now()
    const durationMs = duration * 1000

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / durationMs, 1)
      // Ease out expo for smooth deceleration
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      const current = Math.round(start + (value - start) * ease)
      setCount(current)

      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }

    const frameId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frameId)
  }, [value, duration, reducedMotion])

  return <span>{count.toLocaleString()}{suffix}</span>
}

export function Hero() {
  const reducedMotion = useReducedMotion()
  const [viewMode, setViewMode] = useState<'pipeline' | 'ui'>('pipeline')

  const copyReveal = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section className="hero" id="home">
      {/* Cinematic Ambient Atmosphere & Subtle Toned-Down Grid */}
      <div className="hero-3d-backdrop" aria-hidden="true">
        {/* Subtle Ambient Lighting Flares */}
        <div className="hero-ambient-glow hero-glow-headline" />
        <div className="hero-ambient-glow hero-glow-neural" />
        <div className="hero-ambient-glow hero-glow-bottom" />
        
        {/* Refined Low-Contrast Perspective Floor Grid */}
        <div className="hero-subtle-grid-plane" />
      </div>

      <div className="hero-vignette" aria-hidden="true" />
      
      <div className="container hero-layout">
        {/* Left Column: Headline, Actions & Unified Conversion Pipeline */}
        <motion.div
          className="hero-copy"
          initial={reducedMotion ? false : 'hidden'}
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: reducedMotion ? 0 : 0.09 } },
          }}
        >
          {/* Refined Eyebrow */}
          <motion.div 
            className="hero-eyebrow-pill" 
            variants={copyReveal} 
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="eyebrow-status-dot" />
            <Sparkles size={13} className="eyebrow-icon" />
            <span className="eyebrow-text">Autonomous Sales Intelligence</span>
          </motion.div>

          {/* Clean Headline with Balanced Line Breaks */}
          <motion.h1 
            className="hero-headline"
            variants={copyReveal} 
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            Turn every conversation<br />
            into <span className="gradient-text">a qualified opportunity.</span>
          </motion.h1>

          {/* Value Proposition Lead Paragraph */}
          <motion.p 
            className="hero-lead" 
            variants={copyReveal} 
            transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
          >
            LeadHive AI engages incoming inquiries across WhatsApp, Instagram, Messenger, and Web—qualifying intent, prioritizing high-value deals, and delivering instant sales handovers.
          </motion.p>

          {/* Action CTAs: Dominant Cyan Button + Subtle Secondary Glass Button */}
          <motion.div 
            className="hero-actions" 
            variants={copyReveal} 
            transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
          >
            <a href="#contact" className="hero-primary-cta">
              <span>Book a live demo</span>
              <ArrowRight size={16} className="cta-icon" />
            </a>
            <a href="#workflow" className="hero-secondary-cta">
              <span>See how it works</span>
              <ChevronRight size={15} className="secondary-icon" />
            </a>
          </motion.div>

          {/* Refined Horizontal Conversion Pipeline */}
          <motion.div 
            className="hero-pipeline-wrapper" 
            variants={copyReveal} 
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="hero-pipeline-card">
              {/* Step 1: Raw Inquiries */}
              <div className="pipeline-step">
                <div className="pipeline-number">
                  <AnimatedCounter value={10000} />
                </div>
                <div className="pipeline-label">Incoming Inquiries</div>
              </div>

              {/* Connecting Energy Stream 1 */}
              <div className="pipeline-flow-connector" aria-hidden="true">
                <div className="pipeline-flow-line" />
                <div className="pipeline-flow-pulse pulse-1" />
              </div>

              {/* Step 2: AI Qualification Core */}
              <div className="pipeline-step pipeline-step-ai">
                <div className="ai-badge-pill">
                  <Zap size={12} className="ai-zap-icon" />
                  <span>AI Qualification</span>
                </div>
                <div className="pipeline-label">Real-time Intent Triage</div>
              </div>

              {/* Connecting Energy Stream 2 */}
              <div className="pipeline-flow-connector" aria-hidden="true">
                <div className="pipeline-flow-line" />
                <div className="pipeline-flow-pulse pulse-2" />
              </div>

              {/* Step 3: Hot Sales-Ready Leads */}
              <div className="pipeline-step pipeline-step-hot">
                <div className="pipeline-number pipeline-hot-number">
                  <Flame size={14} className="hot-flame-icon" />
                  <AnimatedCounter value={150} suffix=" Hot" />
                </div>
                <div className="pipeline-label">Sales-Ready Deals</div>
              </div>
            </div>
          </motion.div>

          {/* Refined Enterprise Proof Badges */}
          <motion.div 
            className="hero-proof-row" 
            aria-label="Enterprise capabilities" 
            variants={copyReveal} 
            transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="hero-proof-item">
              <ShieldCheck size={14} className="proof-icon" />
              <span>Enterprise Data Isolation</span>
            </div>
            <span className="hero-proof-separator">•</span>
            <div className="hero-proof-item">
              <TrendingUp size={14} className="proof-icon" />
              <span>Sub-Second Sales Handover</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column: Hero Focal Point - Product-Accurate Intelligence Pipeline Visual */}
        <div className="hero-visual-column">
          {/* Refined Mode Switcher Pill */}
          <div className="hero-mode-switch-wrapper">
            <div className="hero-mode-switch" role="tablist" aria-label="Hero visual mode">
              <button
                type="button"
                className={`mode-btn ${viewMode === 'pipeline' ? 'active' : ''}`}
                onClick={() => setViewMode('pipeline')}
                role="tab"
                aria-selected={viewMode === 'pipeline'}
              >
                <Cpu size={13} />
                <span>AI Qualification Pipeline</span>
              </button>
              <button
                type="button"
                className={`mode-btn ${viewMode === 'ui' ? 'active' : ''}`}
                onClick={() => setViewMode('ui')}
                role="tab"
                aria-selected={viewMode === 'ui'}
              >
                <Layout size={13} />
                <span>Live Platform View</span>
              </button>
            </div>
          </div>

          {/* Focal Glass Display Frame */}
          <div className="hero-focal-frame">
            {viewMode === 'pipeline' ? (
              <HeroPipelineVisual />
            ) : (
              <div className="hero-product-stage">
                <ProductDemo />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Omnichannel Channel Bar */}
      <div className="channel-line-wrapper">
        <div className="container channel-line">
          <span className="channel-line-label">Unified frontline across your primary channels:</span>
          <div className="channel-badges-group">
            <div className="channel-pill"><i className="wa">◔</i> WhatsApp Business</div>
            <div className="channel-pill"><i className="ig">◎</i> Instagram DMs</div>
            <div className="channel-pill"><i className="fb">f</i> Messenger</div>
            <div className="channel-pill"><i className="web">↗</i> Live Website Chat</div>
          </div>
        </div>
      </div>
    </section>
  )
}
