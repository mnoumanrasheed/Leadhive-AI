import { motion, useReducedMotion } from 'motion/react'
import { ArrowRight, ChevronRight, Sparkles } from 'lucide-react'
import { HeroPipelineVisual } from './HeroPipelineVisual'

export function Hero() {
  const reducedMotion = useReducedMotion()

  const copyReveal = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section className="hero" id="home">
      {/* Toned-down subtle ambient backdrop (~50% reduced opacity grid with soft focal glow) */}
      <div className="hero-3d-backdrop" aria-hidden="true">
        <div className="hero-ambient-glow hero-glow-headline" />
        <div className="hero-ambient-glow hero-glow-flow" />
        <div className="hero-subtle-grid-plane" />
      </div>

      <div className="hero-vignette" aria-hidden="true" />
      
      <div className="container hero-layout">
        {/* Left Column: Headline, Actions & Elegant Lightweight Metric Line */}
        <motion.div
          className="hero-copy"
          initial={reducedMotion ? false : 'hidden'}
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: reducedMotion ? 0 : 0.08 } },
          }}
        >
          {/* Eyebrow Pill */}
          <motion.div 
            className="hero-eyebrow-pill" 
            variants={copyReveal} 
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="eyebrow-status-dot" />
            <Sparkles size={13} className="eyebrow-icon" />
            <span className="eyebrow-text">Autonomous Sales Intelligence</span>
          </motion.div>

          {/* Strong Headline with Balanced Line Breaks */}
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

          {/* Action CTAs: Dominant Cyan Primary CTA + Quiet Secondary Glass CTA */}
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

          {/* Elegant Lightweight Single-Line Metric (No bulky boxed dashboard) */}
          <motion.div 
            className="hero-metric-line" 
            variants={copyReveal} 
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="metric-item">
              <strong>10,000</strong> inquiries
            </span>
            <span className="metric-arrow" aria-hidden="true">→</span>
            <span className="metric-item metric-ai">
              <strong>AI qualified</strong>
            </span>
            <span className="metric-arrow" aria-hidden="true">→</span>
            <span className="metric-item metric-hot">
              <strong>150</strong> sales-ready leads
            </span>
          </motion.div>
        </motion.div>

        {/* Right Column: Spacious Minimal Animated "Lead Intelligence Flow" */}
        <div className="hero-visual-column">
          <div className="hero-flow-frame">
            <HeroPipelineVisual />
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
