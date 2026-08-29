import { motion, useReducedMotion } from 'motion/react'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { HeroPipelineVisual } from './HeroPipelineVisual'

export function Hero() {
  const reducedMotion = useReducedMotion()

  const copyReveal = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section className="hero" id="home">
      <div className="hero-3d-backdrop" aria-hidden="true">
        <div className="hero-ambient-glow hero-glow-headline" />
        <div className="hero-ambient-glow hero-glow-flow" />
        <div className="hero-subtle-grid-plane" />
      </div>

      <div className="hero-vignette" aria-hidden="true" />

      <div className="container hero-layout">
        <motion.div
          className="hero-copy"
          initial={reducedMotion ? false : 'hidden'}
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: reducedMotion ? 0 : 0.08 } },
          }}
        >
          <motion.div
            className="hero-eyebrow-pill"
            variants={copyReveal}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="eyebrow-status-dot" />
            <span className="eyebrow-text">Autonomous Sales Intelligence</span>
          </motion.div>

          <motion.h1
            className="hero-headline"
            variants={copyReveal}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            Turn every conversation into <span className="gradient-text">a qualified opportunity.</span>
          </motion.h1>

          <motion.p
            className="hero-lead"
            variants={copyReveal}
            transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
          >
            LeadHive AI understands, qualifies, and prioritizes inbound conversations across every channel—so your team acts on the opportunities that matter.
          </motion.p>

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

          <motion.div
            className="hero-metric-line"
            variants={copyReveal}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="metric-item">
              <strong>10,000</strong> conversations
            </span>
            <span className="metric-arrow" aria-hidden="true">→</span>
            <span className="metric-item metric-hot">
              <strong>150</strong> sales-ready leads
            </span>
          </motion.div>
        </motion.div>

        <div className="hero-visual-column">
          <div className="hero-flow-frame">
            <HeroPipelineVisual />
          </div>
        </div>
      </div>

    </section>
  )
}
